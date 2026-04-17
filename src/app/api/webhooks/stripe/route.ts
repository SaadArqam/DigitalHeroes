import { headers } from 'next/headers';
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

const safeDate = (ts?: number | null) => ts ? new Date(ts * 1000).toISOString() : null;

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
  const { data, error } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('stripe_event_id', eventId)
    .maybeSingle();
  if (error) {
    console.warn('isEventProcessed query error (non-fatal):', error.message);
    return false;
  }
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
      throw new Error("FATAL: NEXT_PUBLIC_SUPABASE_URL is missing");
    }
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith('sb_publishable')) {
      throw new Error("FATAL: SUPABASE_SERVICE_ROLE_KEY is missing or is accidentally set to the anon public key");
    }

    let event: Stripe.Event;
    const stripe = getStripe();

    try {
      if (!webhookSecret) {
        throw new Error('Webhook secret is not configured');
      }
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Webhook signature verification failed', { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdminClient();
    const eventId = event.id;

    console.log('Webhook received:', event.type);

    if (await isEventProcessed(eventId, supabaseAdmin)) {
      console.log(`Event ${eventId} already processed`);
      return new Response('ok', { status: 200 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session, supabaseAdmin);
        break;
      }
      case 'invoice.paid':
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice, supabaseAdmin);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice, supabaseAdmin);
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpsert(subscription, supabaseAdmin);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, supabaseAdmin);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    await markEventProcessed(eventId, supabaseAdmin);
    return new Response('ok', { status: 200 });
  } catch (error) {
    console.error('WEBHOOK ERROR:', error);
    return new Response('ok', { status: 200 });
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabaseAdmin: any
) {
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
    throw new Error('FATAL: No subscription ID on checkout session. Session mode must be "subscription".');
  }

  console.log('User ID:', supabase_user_id);

  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  console.log(`Subscription ${subscriptionId} retrieved from Stripe, status: ${subscription.status}`);

  const customerId = session.customer as string;
  try {
    await stripe.customers.update(customerId, {
      metadata: { supabase_user_id },
    });
  } catch (err) {
    console.warn('Could not update Stripe customer metadata (non-fatal):', err);
  }

  await handleSubscriptionUpsert(subscription, supabaseAdmin, supabase_user_id);
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabaseAdmin: any
) {
  if ((invoice as any).subscription) {
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription.toString());
    await handleSubscriptionUpsert(subscription, supabaseAdmin);
  }
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  supabaseAdmin: any
) {
  if ((invoice as any).subscription) {
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription.toString());
    await handleSubscriptionUpsert(subscription, supabaseAdmin);
  }
}

async function handleSubscriptionUpsert(
  subscription: Stripe.Subscription,
  supabaseAdmin: any,
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
    current_period_end: safeDate((subscription as any).current_period_end),
  };

  console.log("Upserting subscription data:", subscriptionData);

  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert(
      subscriptionData,
    {
      onConflict: 'user_id'
    });

  if (upsertError) {
    console.error("WEBHOOK ERROR:", upsertError);
    throw upsertError;
  }

  console.log(`Subscription ${subscription.id} synced to database successfully for user ${supabaseUserId} with status ${normalizedStatus}.`);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabaseAdmin: any
) {
  await handleSubscriptionUpsert(subscription, supabaseAdmin);
}
