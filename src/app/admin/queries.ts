'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';

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
    { data: charities }
  ] = await Promise.all([
    supabase.from('profiles').select('*'),
    supabase.from('subscriptions').select('*'),
    supabase.from('scores').select('*').order('date', { ascending: false }),
    supabase.from('draws').select('*, draw_results(*)').order('created_at', { ascending: false }),
    supabase.from('charities').select('*')
  ]);

  return { users, subscriptions, scores, draws, charities };
}
