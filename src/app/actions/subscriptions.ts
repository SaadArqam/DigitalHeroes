'use server';

import { createClient } from '@/lib/supabase/server';
import { PlanSchema } from '@/lib/validations';
import { CheckoutSessionResponse, Subscription } from '@/lib/types';
import Stripe from 'stripe';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { monthlyPlan, yearlyPlan } from '@/lib/pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

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

function createSupabaseAdminClient() {
  return createAdminClient(
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

// Use centralized pricing configuration for Stripe price IDs
const STRIPE_PRICE_IDS = {
  monthly: monthlyPlan.stripePriceId,
  yearly: yearlyPlan.stripePriceId,
} as const;

export async function createCheckoutSession(plan: 'monthly' | 'yearly'): Promise<CheckoutSessionResponse> {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

console.log("🔥 BASE URL:", baseUrl);
  try {
    // Validate input
    const validatedPlan = PlanSchema.parse(plan);

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in to subscribe'
      };
    }

    // Check if user already has an active subscription
    const { data: existingSubscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      return {
        success: false,
        message: 'You already have an active subscription'
      };
    }

    // Get or create Stripe customer
    let customerId = existingSubscription?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;
    }

    // Get the price ID for the selected plan
    const priceId = STRIPE_PRICE_IDS[validatedPlan];
    if (!priceId) {
      return {
        success: false,
        message: 'Invalid plan selected'
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const successUrl = `${baseUrl}/dashboard?success=true`;
    const cancelUrl = `${baseUrl}/subscribe?canceled=true`;

    console.log("CHECKOUT SESSION CREATED FROM SERVER ACTION");
    console.log("BASE URL:", baseUrl);
    console.log("SUCCESS URL:", successUrl);
    console.log("Creating checkout session for user:", user.id);
    console.log("With plan:", validatedPlan);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        supabase_user_id: user.id,
        plan: validatedPlan,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
    });

    return {
      success: true,
      message: 'Checkout session created successfully',
      sessionId: session.id,
      url: session.url || undefined,
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred while creating checkout session'
    };
  }
}

export async function getUserSubscription(): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in to view subscription'
      };
    }

    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
      return {
        success: false,
        message: 'Error fetching subscription'
      };
    }

    return {
      success: true,
      message: 'Subscription fetched successfully',
      data: subscription
    };

  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}

export async function cancelSubscription(): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in to cancel subscription'
      };
    }

    // Get user's subscription
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (fetchError || !subscription) {
      return {
        success: false,
        message: 'No active subscription found'
      };
    }

    // Cancel subscription in Stripe
    const canceledSubscription = await stripe.subscriptions.cancel(subscription.stripe_subscription_id);

    // Update subscription in database
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription.id);

    if (updateError) {
      return {
        success: false,
        message: 'Error updating subscription in database'
      };
    }

    return {
      success: true,
      message: 'Subscription canceled successfully'
    };

  } catch (error) {
    console.error('Error canceling subscription:', error);
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred while canceling subscription'
    };
  }
}

export async function syncStripeSubscription(): Promise<{ success: boolean; message: string; data?: Subscription }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in'
      };
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subscription && subscription.status === 'active') {
      return {
        success: true,
        message: 'Subscription already active',
        data: subscription
      };
    }

    const adminSupabase = createSupabaseAdminClient();
    const { data: customer } = await adminSupabase
      .from('subscriptions')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('user_id', user.id)
      .single();

    let stripeSub: Stripe.Subscription | null = null;
    if (customer?.stripe_subscription_id) {
      stripeSub = await stripe.subscriptions.retrieve(customer.stripe_subscription_id);
    } else if (customer?.stripe_customer_id) {
      const { data: subscriptions } = await stripe.subscriptions.list({
        customer: customer.stripe_customer_id,
        limit: 1
      });
      if (subscriptions.length > 0) {
        stripeSub = subscriptions[0];
      }
    }

    if (!stripeSub) {
      return {
        success: false,
        message: 'No active Stripe subscription found'
      };
    }

    const priceId = stripeSub.items.data[0]?.price?.id;
    let plan: 'monthly' | 'yearly' = 'monthly';
    if (priceId === process.env.STRIPE_PRICE_YEARLY) plan = 'yearly';
    else if (priceId === process.env.STRIPE_PRICE_MONTHLY) plan = 'monthly';

    let baseStatus = stripeSub.status;
    if (stripeSub.cancel_at_period_end && stripeSub.status === 'active') {
      baseStatus = 'canceled';
    }
    const normalizedStatus = STATUS_MAP[baseStatus] || 'lapsed';

    const subscriptionData = {
      user_id: user.id,
      plan,
      status: normalizedStatus,
      stripe_customer_id: stripeSub.customer as string,
      stripe_subscription_id: stripeSub.id,
      current_period_end: new Date((stripeSub as any).current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: existingSub, error: fetchError } = await adminSupabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    let updatedSub;
    if (existingSub) {
      const { data } = await adminSupabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('id', existingSub.id)
        .select()
        .single();
      updatedSub = data;
    } else {
      const { data } = await adminSupabase
        .from('subscriptions')
        .upsert({
          ...subscriptionData,
          created_at: new Date().toISOString(),
        }, {
          onConflict: 'user_charity_preferences_user_id_key',
          ignoreDuplicates: false
        })
        .select()
        .single();
      updatedSub = data;
    }

    return {
      success: true,
      message: 'Subscription synced successfully',
      data: updatedSub as Subscription
    };

  } catch (error) {
    console.error('Error syncing subscription:', error);
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}
