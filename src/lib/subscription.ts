import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

type SubscriptionCheckResult = 
  | { valid: true; user: User }
  | { valid: false; reason: 'not_authenticated' | 'no_active_subscription' };

export async function checkActiveSubscription(supabase: Awaited<ReturnType<typeof createClient>>): Promise<SubscriptionCheckResult> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { valid: false, reason: 'not_authenticated' };
  }

  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .single();

  if (subError || !subscription || subscription.status !== 'active') {
    return { valid: false, reason: 'no_active_subscription' };
  }

  return { valid: true, user };
}
