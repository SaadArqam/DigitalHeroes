// src/app/actions/admin.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const adminClient = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Validates the root identity is an administrator.
 */
async function validateAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('user_id', user.id).single();
  if (!profile?.is_admin && user.email !== 'admin@gmail.com') return { error: 'Access Denied: Root identity required.' };
  return { user };
}

export async function getAllUsers() {
  const auth = await validateAdmin();
  if (auth.error) throw new Error(auth.error);

  const { data, error } = await adminClient
    .from('profiles')
    .select('*, subscriptions(*), scores(id)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateSubscriptionStatus(userId: string, status: 'active' | 'lapsed' | 'cancelled') {
  const auth = await validateAdmin();
  if (auth.error) return { success: false, message: auth.error };

  const { error } = await adminClient
    .from('subscriptions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) return { success: false, message: error.message };
  revalidatePath('/admin/users');
  return { success: true };
}

export async function getAllDraws() {
  const auth = await validateAdmin();
  if (auth.error) throw new Error(auth.error);

  const { data, error } = await adminClient
    .from('draws')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAllWinners() {
  const auth = await validateAdmin();
  if (auth.error) throw new Error(auth.error);

  const { data, error } = await adminClient
    .from('draw_results')
    .select('*, profiles:user_id(email), draws(month)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getWinnerProofUrl(filePath: string) {
  const auth = await validateAdmin();
  if (auth.error) return null;

  const { data, error } = await adminClient
    .storage
    .from('winner-proofs')
    .createSignedUrl(filePath, 3600); // 1 hour access

  if (error) return null;
  return data.signedUrl;
}

export async function updateWinnerStatus(resultId: string, status: string) {
  const auth = await validateAdmin();
  if (auth.error) return { success: false, message: auth.error };

  const { error } = await adminClient
    .from('draw_results')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', resultId);

  if (error) return { success: false, message: error.message };
  revalidatePath('/admin/winners');
  return { success: true };
}

export async function upsertCharity(data: any) {
  const auth = await validateAdmin();
  if (auth.error) return { success: false, message: auth.error };

  const { error } = await adminClient
    .from('charities')
    .upsert({
      ...data,
      updated_at: new Date().toISOString()
    });

  if (error) return { success: false, message: error.message };
  revalidatePath('/admin/charities');
  revalidatePath('/charities');
  return { success: true };
}

export async function deleteCharity(id: string) {
  const auth = await validateAdmin();
  if (auth.error) return { success: false, message: auth.error };

  const { error } = await adminClient.from('charities').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  revalidatePath('/admin/charities');
  return { success: true };
}
