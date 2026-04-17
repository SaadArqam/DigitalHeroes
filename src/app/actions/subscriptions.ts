'use server';

import { createClient } from '@/lib/supabase/server';
import { PlanSchema } from '@/lib/validations';
import { CheckoutSessionResponse } from '@/lib/types';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

// Define your Stripe price IDs - you'll need to create these in your Stripe dashboard
const STRIPE_PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  yearly: process.env.STRIPE_PRICE_YEARLY!,
} as const;

export async function createCheckoutSession(plan: 'monthly' | 'yearly'): Promise<CheckoutSessionResponse> {
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/subscribe?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/subscribe?canceled=true`,
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
