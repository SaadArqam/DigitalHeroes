import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-03-25.dahlia',
  });
}

const STATUS_MAP: Record<string, 'active' | 'lapsed' | 'cancelled'> = {
  active: 'active',
  trialing: 'active',
  past_due: 'lapsed',
  unpaid: 'lapsed',
  incomplete: 'lapsed',
  incomplete_expired: 'lapsed',
  canceled: 'cancelled',
  cancelled: 'cancelled'
};

async function isEventProcessed(eventId: string, supabase: any): Promise<boolean> {
  const { data } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('stripe_event_id', eventId)
    .single();
  return !!data;
}

async function markEventProcessed(eventId: string, supabase: any) {
  await supabase
    .from('webhook_events')
    .insert({
      stripe_event_id: eventId,
      processed_at: new Date().toISOString(),
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

    const supabase = createSupabaseAdminClient();
    const eventId = event.id;

    if (await isEventProcessed(eventId, supabase)) {
      console.log(`Event ${eventId} already processed`);
      return NextResponse.json({ received: true });
    }
    await markEventProcessed(eventId, supabase);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session, supabase);
        break;
      }

      case 'invoice.paid':
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice, supabase);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice, supabase);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpsert(subscription, supabase);
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
      await handleSubscriptionUpsert(subscription, supabase);
    }
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: any
) {
  try {
    if ((invoice as any).subscription) {
      const stripe = getStripe();
      const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription.toString());
      await handleSubscriptionUpsert(subscription, supabase);
    }
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}

async function handleSubscriptionUpsert(
  subscription: Stripe.Subscription,
  supabase: any
) {
  try {
    const customerId = subscription.customer as string;
    const stripe = getStripe();
    const customer = await stripe.customers.retrieve(customerId);
    const supabaseUserId = (customer as Stripe.Customer).metadata?.supabase_user_id;

    if (!supabaseUserId) {
      console.error('No supabase_user_id found in customer metadata');
      return;
    }

    const priceId = subscription.items.data[0]?.price?.id;
    let plan: 'monthly' | 'yearly' = 'monthly';
    
    if (priceId === process.env.STRIPE_PRICE_YEARLY) {
      plan = 'yearly';
    } else if (priceId === process.env.STRIPE_PRICE_MONTHLY) {
      plan = 'monthly';
    }

    let baseStatus = subscription.status;
    if (subscription.cancel_at_period_end && subscription.status === 'active') {
      baseStatus = 'canceled';
    }
    const normalizedStatus = STATUS_MAP[baseStatus] || 'lapsed';

    const subscriptionData = {
      user_id: supabaseUserId,
      plan,
      status: normalizedStatus,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: existingSub, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing subscription:', fetchError);
      throw fetchError;
    }

    if (existingSub) {
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('id', existingSub.id);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        throw updateError;
      }
    } else {
      const { data, error: upsertError } = await supabase
        .from('subscriptions')
        .upsert({
          ...subscriptionData,
          created_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (upsertError) {
        console.error('Error upserting subscription:', upsertError);
        throw upsertError;
      }
    }

    console.log(`Subscription ${subscription.id} synced to database for user ${supabaseUserId} with status ${normalizedStatus}`);
  } catch (error) {
    console.error('Error handling subscription upsert:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: any
) {
  try {
    await handleSubscriptionUpsert(subscription, supabase);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}
