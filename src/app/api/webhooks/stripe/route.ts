import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

// Create Supabase client with service role key for admin operations
function createSupabaseAdminClient() {
  return createClient();
}

// Initialize Stripe lazily to avoid build-time issues
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-03-25.dahlia',
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature')!;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      if (!webhookSecret) {
        throw new Error('Webhook secret is not configured');
      }
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key for admin access
    const supabase = createSupabaseAdminClient();

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session, supabase);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice, supabase);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription, supabase);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, supabase);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, supabase);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: any
) {
  try {
    const { supabase_user_id, plan } = session.metadata || {};
    
    if (!supabase_user_id || !plan) {
      console.error('Missing metadata in checkout session');
      return;
    }

    // If subscription is already active, no need to do anything here
    // It will be handled by the subscription.created event
    console.log(`Checkout session completed for user: ${supabase_user_id}, plan: ${plan}`);
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: any
) {
  try {
    if ((invoice as any).subscription) {
      const stripe = getStripe();
      const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription.toString());
      await updateSubscriptionInDatabase(subscription, supabase);
    }
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  supabase: any
) {
  try {
    await updateSubscriptionInDatabase(subscription, supabase);
    console.log(`Subscription created: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: any
) {
  try {
    await updateSubscriptionInDatabase(subscription, supabase);
    console.log(`Subscription updated: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: any
) {
  try {
    // Mark subscription as canceled in database
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }

    console.log(`Subscription deleted: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function updateSubscriptionInDatabase(
  subscription: Stripe.Subscription,
  supabase: any
) {
  try {
    const customerId = subscription.customer as string;
    
    // Get customer to find user ID
    const stripe = getStripe();
    const customer = await stripe.customers.retrieve(customerId);
    const supabaseUserId = (customer as Stripe.Customer).metadata?.supabase_user_id;

    if (!supabaseUserId) {
      console.error('No supabase_user_id found in customer metadata');
      return;
    }

    // Determine plan type from price
    const priceId = subscription.items.data[0]?.price?.id;
    let plan: 'monthly' | 'yearly' = 'monthly';
    
    if (priceId === process.env.STRIPE_PRICE_YEARLY) {
      plan = 'yearly';
    } else if (priceId === process.env.STRIPE_PRICE_MONTHLY) {
      plan = 'monthly';
    }

    // Map Stripe status to our database status
    let status: string = subscription.status;
    if (subscription.cancel_at_period_end) {
      status = 'canceled';
    }

    // Check if subscription already exists
    const { data: existingSub, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing subscription:', fetchError);
      throw fetchError;
    }

    const subscriptionData = {
      user_id: supabaseUserId,
      plan,
      status,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingSub) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('id', existingSub.id);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        throw updateError;
      }
    } else {
      // Create new subscription
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          ...subscriptionData,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error inserting subscription:', insertError);
        throw insertError;
      }
    }

    console.log(`Subscription ${subscription.id} synced to database for user ${supabaseUserId}`);
  } catch (error) {
    console.error('Error updating subscription in database:', error);
    throw error;
  }
}
