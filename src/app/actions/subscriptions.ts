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

const STRIPE_PRICE_IDS = {
  monthly: monthlyPlan.stripePriceId,
  yearly: yearlyPlan.stripePriceId,
} as const;

export async function createCheckoutSession(plan: 'monthly' | 'yearly'): Promise<CheckoutSessionResponse> {
  try {
    const validatedPlan = PlanSchema.parse(plan);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: 'Auth required' };

    const { data: currentSub } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle();
    let customerId = currentSub?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: STRIPE_PRICE_IDS[validatedPlan], quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe?canceled=true`,
      metadata: { supabase_user_id: user.id, plan: validatedPlan },
      allow_promotion_codes: true,
    });

    return { success: true, message: 'Success', url: session.url || undefined };
  } catch (error: any) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return { success: false, message: error.message };
  }
}

export async function getUserSubscription(): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'Auth required' };

    const { data: subscription, error } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    return { success: true, message: 'Fetched', data: subscription };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function syncStripeSubscription(): Promise<{ success: boolean; message: string; data?: Subscription }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'Auth required' };

    const adminSupabase = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: subRec } = await adminSupabase.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle();

    if (!subRec?.stripe_customer_id) return { success: false, message: 'No Stripe history found' };

    const subs = await stripe.subscriptions.list({ customer: subRec.stripe_customer_id, limit: 1 });
    if (subs.data.length === 0) return { success: false, message: 'No active Stripe subscription' };

    const s = subs.data[0] as any;
    
    // PRODUCTION FIX: Reliable date conversion. Stripe uses SECONDS.
    const periodEnd = s.current_period_end ? new Date(s.current_period_end * 1000).toISOString() : new Date().toISOString();

    const normalizedStatus = STATUS_MAP[s.status] || 'lapsed';
    
    const { data: updated, error: upsertError } = await adminSupabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        status: normalizedStatus,
        stripe_customer_id: s.customer as string,
        stripe_subscription_id: s.id,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (upsertError) throw upsertError;
    return { success: true, message: 'Synced', data: updated as any };
  } catch (error: any) {
    console.error('[SUBSCRIPTION_SYNC_ERROR]', error);
    return { success: false, message: error.message };
  }
}

export async function createBillingPortalSession(): Promise<CheckoutSessionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'Auth required' };

    const { data: sub } = await supabase.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
    if (!sub?.stripe_customer_id) return { success: false, message: 'No billing profile' };

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });

    return { success: true, url: session.url, message: 'Portal ready' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
