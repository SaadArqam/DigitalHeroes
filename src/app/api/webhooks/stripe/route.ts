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

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error("FATAL: NEXT_PUBLIC_SUPABASE_URL is missing");
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith('sb_publishable')) {
      console.error("FATAL: SUPABASE_SERVICE_ROLE_KEY is missing or is accidentally set to the anon public key");
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

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

    try {
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

      await markEventProcessed(eventId, supabase);
      return NextResponse.json({ received: true });
    } catch (handlerError) {
      console.error("WEBHOOK ERROR processing event:", handlerError);
      return NextResponse.json(
        { error: 'Webhook handler logic failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Webhook payload/header reading error:', error);
    return NextResponse.json(
      { error: 'Webhook parsing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: any
) {
  console.log('Webhook received: checkout.session.completed');
  console.log('Session metadata:', session.metadata);
  console.log("Subscription ID:", session.subscription);

  const { supabase_user_id, plan } = session.metadata || {};

  if (!supabase_user_id) {
    throw new Error('Missing supabase_user_id in metadata — cannot process subscription');
  }

  if (!plan) {
    throw new Error('Missing plan in metadata — cannot process subscription');
  }

  const subscriptionId = session.subscription as string | null;
  if (!subscriptionId) {
    console.error('FATAL: No subscription ID on checkout session. Session mode must be "subscription".');
    return;
  }

  // Retrieve the full subscription object from Stripe, then upsert into Supabase.
  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  console.log(`Subscription ${subscriptionId} retrieved from Stripe, status: ${subscription.status}`);

  // Attach supabase_user_id to the Stripe customer so subscription-level events
  // (invoice.paid, customer.subscription.updated) can also resolve the user.
  const customerId = subscription.customer as string;
  try {
    await stripe.customers.update(customerId, {
      metadata: { supabase_user_id },
    });
  } catch (err) {
    console.warn('Could not update Stripe customer metadata (non-fatal):', err);
  }

  await handleSubscriptionUpsert(subscription, supabase, supabase_user_id);
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: any
) {
  if ((invoice as any).subscription) {
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription.toString());
    await handleSubscriptionUpsert(subscription, supabase);
  }
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: any
) {
  if ((invoice as any).subscription) {
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription.toString());
    await handleSubscriptionUpsert(subscription, supabase);
  }
}

async function handleSubscriptionUpsert(
  subscription: Stripe.Subscription,
  supabase: any,
  supabaseUserIdOverride?: string
) {
  const customerId = subscription.customer as string;
  let supabaseUserId = supabaseUserIdOverride;

  if (!supabaseUserId) {
    const stripe = getStripe();
    const customer = await stripe.customers.retrieve(customerId);
    console.log("Customer metadata:", (customer as Stripe.Customer).metadata);
    supabaseUserId = (customer as Stripe.Customer).metadata?.supabase_user_id;
  }

  if (!supabaseUserId) {
    console.error('No supabase_user_id found in customer metadata or override');
    throw new Error('Missing supabase_user_id. Cannot save subscription to DB.');
  }

  console.log(`handleSubscriptionUpsert: user=${supabaseUserId}, sub=${subscription.id}, status=${subscription.status}`);

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

  console.log("Upserting subscription data:", subscriptionData);

  // Safe idempotent upsert relying on unique user_id constraint
  const { error: upsertError } = await supabase
    .from('subscriptions')
    .upsert({
      ...subscriptionData,
    }, {
      onConflict: 'user_id',
      ignoreDuplicates: false
    });

  if (upsertError) {
    console.error('WEBHOOK ERROR: Error upserting subscription:', upsertError);
    throw new Error(`Failed to upsert subscription: ${upsertError.message}`);
  }

  console.log(`Subscription ${subscription.id} synced to database successfully for user ${supabaseUserId} with status ${normalizedStatus}.`);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: any
) {
  await handleSubscriptionUpsert(subscription, supabase);
}
