import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ---------- CONFIG ----------

function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false }
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

const safeDate = (ts?: number | null) =>
  ts ? new Date(ts * 1000).toISOString() : null;

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

// ---------- IDEMPOTENCY ----------

async function isEventProcessed(eventId: string, supabase: any) {
  const { data, error } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('stripe_event_id', eventId)
    .maybeSingle();

  if (error) {
    console.warn('isEventProcessed error:', error.message);
    return false;
  }

  return !!data;
}

async function markEventProcessed(eventId: string, supabase: any) {
  await supabase.from('webhook_events').insert({
    stripe_event_id: eventId,
    processed_at: new Date().toISOString(),
  });
}

// ---------- MAIN HANDLER ----------

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    // ENV VALIDATION
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error("Missing SUPABASE URL");
    }

    if (
      !process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith('sb_publishable')
    ) {
      throw new Error("Invalid SERVICE ROLE KEY");
    }

    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }

    const stripe = getStripe();

    // VERIFY SIGNATURE
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('❌ Signature verification failed:', err);
      return new Response('Invalid signature', { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdminClient();
    const eventId = event.id;

    console.log('🔥 Webhook received:', event.type);

    // IDEMPOTENCY CHECK
    if (await isEventProcessed(eventId, supabaseAdmin)) {
      console.log('⚠️ Event already processed:', eventId);
      return new Response('ok', { status: 200 });
    }

    // ---------- PROCESS EVENTS ----------

    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
          supabaseAdmin
        );
        break;
      }

      case 'invoice.payment_succeeded':
      case 'invoice.paid': {
        await handleInvoice(event.data.object as Stripe.Invoice, supabaseAdmin);
        break;
      }

      case 'invoice.payment_failed': {
        await handleInvoice(event.data.object as Stripe.Invoice, supabaseAdmin);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        await handleSubscription(
          event.data.object as Stripe.Subscription,
          supabaseAdmin
        );
        break;
      }

      default:
        console.log('Unhandled event:', event.type);
    }

    // MARK SUCCESS ONLY AFTER PROCESSING
    await markEventProcessed(eventId, supabaseAdmin);

    return new Response('ok', { status: 200 });

  } catch (error) {
    console.error('❌ WEBHOOK FAILURE:', error);

    // IMPORTANT: let Stripe retry
    return new Response('Webhook failed', { status: 500 });
  }
}

// ---------- HANDLERS ----------

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabaseAdmin: any
) {
  console.log('Session metadata:', session.metadata);

  const userId = session.metadata?.supabase_user_id;
  const plan = session.metadata?.plan;

  if (!userId) {
    console.error('Missing user_id in metadata');
    return;
  }

  const subscriptionId = session.subscription as string;
  if (!subscriptionId) {
    console.error('Missing subscription ID');
    return;
  }

  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await handleSubscription(subscription, supabaseAdmin, userId, plan);
}

async function handleInvoice(
  invoice: Stripe.Invoice,
  supabaseAdmin: any
) {
  if (!(invoice as any).subscription) return;

  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(
    (invoice as any).subscription.toString()
  );

  await handleSubscription(subscription, supabaseAdmin);
}

async function handleSubscription(
  subscription: Stripe.Subscription,
  supabaseAdmin: any,
  overrideUserId?: string,
  overridePlan?: string
) {
  const stripe = getStripe();

  let userId = overrideUserId;

  if (!userId) {
    const customer = await stripe.customers.retrieve(
      subscription.customer as string
    );
    userId = (customer as Stripe.Customer).metadata?.supabase_user_id;
  }

  if (!userId) {
    console.error('❌ No user_id found — skipping');
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id;

  let plan: 'monthly' | 'yearly' =
    overridePlan === 'yearly' ||
    priceId === process.env.STRIPE_PRICE_YEARLY
      ? 'yearly'
      : 'monthly';

  let baseStatus = subscription.status;
  if (subscription.cancel_at_period_end && subscription.status === 'active') {
    baseStatus = 'canceled';
  }

  const normalizedStatus = STATUS_MAP[baseStatus] || 'lapsed';

  const data = {
    user_id: userId,
    plan,
    status: normalizedStatus,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    current_period_end: safeDate(
      (subscription as any).current_period_end
    ),
  };

  console.log('Upserting subscription:', data);

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(data, { onConflict: 'user_charity_preferences_user_id_key' });

  if (error) {
    console.error('❌ DB UPSERT ERROR:', error);
    throw error; // force retry
  }

  console.log('✅ Subscription saved successfully');
}