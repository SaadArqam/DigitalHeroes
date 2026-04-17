'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const getAdminSupabase = () => createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') {
    // Check email fallback for dev/emergency
    const isAdminEmail = user.email === 'admin@gmail.com' || user.email === 'your@email.com';
    if (!isAdminEmail) return { error: 'Unauthorized' };
  }

  return { user, supabase };
}

// --- USER MANAGEMENT ---

export async function updateUserScore(scoreId: string, score: number, date: string) {
  const auth = await checkAdmin();
  if (auth.error) return { success: false, message: auth.error };

  const adminSupabase = getAdminSupabase();
  const { error } = await adminSupabase
    .from('scores')
    .update({ score, date })
    .eq('id', scoreId);

  if (error) return { success: false, message: error.message };
  revalidatePath('/admin');
  return { success: true, message: 'User score updated' };
}

// --- CHARITY MANAGEMENT ---

export async function upsertCharity(charity: any) {
  const auth = await checkAdmin();
  if (auth.error) return { success: false, message: auth.error };

  const adminSupabase = getAdminSupabase();
  const { error } = await adminSupabase
    .from('charities')
    .upsert({
      id: charity.id || undefined,
      name: charity.name,
      description: charity.description,
      logo_url: charity.logo_url,
      website_url: charity.website_url,
      is_active: charity.is_active ?? true
    });

  if (error) return { success: false, message: error.message };
  revalidatePath('/admin');
  return { success: true, message: 'Charity saved successfully' };
}

export async function deleteCharity(id: string) {
  const auth = await checkAdmin();
  if (auth.error) return { success: false, message: auth.error };

  const adminSupabase = getAdminSupabase();
  const { error } = await adminSupabase
    .from('charities')
    .delete()
    .eq('id', id);

  if (error) return { success: false, message: error.message };
  revalidatePath('/admin');
  return { success: true, message: 'Charity removed' };
}

// --- WINNER MANAGEMENT ---

export async function updateWinnerStatus(resultId: string, status: 'verified' | 'rejected' | 'paid') {
  const auth = await checkAdmin();
  if (auth.error) return { success: false, message: auth.error };

  const adminSupabase = getAdminSupabase();
  const { error } = await adminSupabase
    .from('draw_results')
    .update({ status })
    .eq('id', resultId);

  if (error) return { success: false, message: error.message };
  revalidatePath('/admin');
  return { success: true, message: `Winner status updated to ${status}` };
}
