'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';

const PLAN_PRICES = {
  monthly: 50,
  yearly: 500
};

const getAdminSupabase = () => createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function fetchAdminData() {
  const supabase = getAdminSupabase();

  const [
    { data: users }, 
    { data: subscriptions }, 
    { data: scores }, 
    { data: draws }, 
    { data: charities },
    { data: winners }
  ] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
    supabase.from('scores').select('*, profiles(email)').order('date', { ascending: false }),
    supabase.from('draws').select('*, draw_results(*)').order('created_at', { ascending: false }),
    supabase.from('charities').select('*').order('name', { ascending: true }),
    supabase.from('draw_results').select('*, profiles(email)').order('created_at', { ascending: false })
  ]);

  // Calculate statistics
  const activeSubs = subscriptions?.filter(s => s.status === 'active') || [];
  const totalRevenue = activeSubs.reduce((acc, sub) => acc + (PLAN_PRICES[sub.plan as keyof typeof PLAN_PRICES] || 0), 0);
  const totalPrizePool = totalRevenue * 0.7; // 70% to prize pool, 10% to charity, 20% to platform
  const totalCharityImpact = totalRevenue * 0.1;

  const stats = {
    totalUsers: users?.length || 0,
    activeSubscriptions: activeSubs.length,
    totalRevenue,
    totalPrizePool,
    totalCharityImpact,
    pendingWinners: winners?.filter(w => w.status === 'pending').length || 0
  };

  return { users, subscriptions, scores, draws, charities, winners, stats };
}
