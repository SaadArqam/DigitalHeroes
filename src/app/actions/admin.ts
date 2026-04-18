// src/app/actions/admin.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

/**
 * Standard Response Interface
 */
interface AdminActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Validates the root identity is an administrator.
 */
async function validateAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase.from('profiles').select('is_admin, role').eq('user_id', user.id).maybeSingle();
  const isAdmin = profile?.is_admin || profile?.role === 'admin' || user.email === 'admin@gmail.com';
  
  if (!isAdmin) return { error: 'Access Denied: Root identity required.' };
  return { user };
}

export async function getAllUsers(): Promise<AdminActionResponse> {
  try {
    const auth = await validateAdmin();
    if (auth.error) return { success: false, message: auth.error };

    // 1. Fetch Profiles
    const { data: profiles, error: pError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (pError) throw pError;

    // 2. Fetch Subscriptions and Scores in parallel (Flat queries)
    const [ { data: subs }, { data: scores } ] = await Promise.all([
      supabaseAdmin.from('subscriptions').select('*'),
      supabaseAdmin.from('scores').select('id, user_id, score, date')
    ]);

    // 3. Join in Memory to bypass foreign key/PGRST200 issues
    const joinedData = (profiles || []).map(profile => ({
      ...profile,
      subscriptions: (subs || []).filter(s => s.user_id === profile.user_id),
      scores: (scores || []).filter(s => s.user_id === profile.user_id)
    }));

    return {
      success: true,
      data: joinedData,
      message: "Users fetched",
    };
  } catch (err: any) {
    console.error('[ADMIN_API] getAllUsers Error:', err);
    return {
      success: false,
      message: err.message || "Registry sync failure",
    };
  }
}

/**
 * Approves a user profile status.
 */
export async function approveUser(userId: string): Promise<AdminActionResponse> {
  try {
    const auth = await validateAdmin();
    if (auth.error) return { success: false, message: auth.error };

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) throw error;
    revalidatePath('/admin/users');
    return { success: true, message: 'Citizen profile approved' };
  } catch (err: any) {
    console.error('[ADMIN_API] approveUser Error:', err);
    return { success: false, message: err.message || 'Approval protocol failure' };
  }
}

/**
 * Rejects a user profile status.
 */
export async function rejectUser(userId: string): Promise<AdminActionResponse> {
  try {
    const auth = await validateAdmin();
    if (auth.error) return { success: false, message: auth.error };

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) throw error;
    revalidatePath('/admin/users');
    return { success: true, message: 'Citizen profile rejected' };
  } catch (err: any) {
    console.error('[ADMIN_API] rejectUser Error:', err);
    return { success: false, message: err.message || 'Rejection protocol failure' };
  }
}

export async function updateSubscriptionStatus(userId: string, status: 'active' | 'lapsed' | 'cancelled'): Promise<AdminActionResponse> {
  try {
    const auth = await validateAdmin();
    if (auth.error) return { success: false, message: auth.error };

    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) throw error;
    revalidatePath('/admin/users');
    return { success: true, message: `System status changed to ${status}` };
  } catch (err: any) {
    console.error('[ADMIN_API] updateSubscriptionStatus Error:', err);
    return { success: false, message: err.message || 'Operational sync error' };
  }
}

export async function getAllDraws(): Promise<AdminActionResponse> {
  try {
    const auth = await validateAdmin();
    if (auth.error) return { success: false, message: auth.error };

    const { data, error } = await supabaseAdmin
      .from('draws')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, message: 'Draw ledger retrieved', data };
  } catch (err: any) {
    console.error('[ADMIN_API] getAllDraws Error:', err);
    return { success: false, message: err.message || 'Draw ledger fetch failure' };
  }
}

export async function getAllWinners(): Promise<AdminActionResponse> {
  try {
    const auth = await validateAdmin();
    if (auth.error) return { success: false, message: auth.error };

    const { data: results, error: rError } = await supabaseAdmin
      .from('draw_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (rError) throw rError;

    // Fetch related data in parallel
    const [ { data: profiles }, { data: draws } ] = await Promise.all([
      supabaseAdmin.from('profiles').select('user_id, email'),
      supabaseAdmin.from('draws').select('id, month')
    ]);

    const joinedResults = (results || []).map(res => ({
      ...res,
      profiles: (profiles || []).find(p => p.user_id === res.user_id),
      draws: (draws || []).find(d => d.id === res.draw_id)
    }));

    return { success: true, message: 'Victory ledger synchronized', data: joinedResults };
  } catch (err: any) {
    console.error('[ADMIN_API] getAllWinners Error:', err);
    return { success: false, message: err.message || 'Victory ledger sync failure' };
  }
}

export async function getWinnerProofUrl(filePath: string) {
  const auth = await validateAdmin();
  if (auth.error) return null;

  const { data, error } = await supabaseAdmin
    .storage
    .from('winner-proofs')
    .createSignedUrl(filePath, 3600);

  if (error) return null;
  return data.signedUrl;
}

export async function updateWinnerStatus(resultId: string, status: string): Promise<AdminActionResponse> {
  try {
    const auth = await validateAdmin();
    if (auth.error) return { success: false, message: auth.error };

    const { error } = await supabaseAdmin
      .from('draw_results')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', resultId);

    if (error) throw error;
    revalidatePath('/admin/winners');
    return { success: true, message: `Status protocol set to ${status}` };
  } catch (err: any) {
    console.error('[ADMIN_API] updateWinnerStatus Error:', err);
    return { success: false, message: err.message || 'Status protocol error' };
  }
}

export async function getLeaderboard(): Promise<AdminActionResponse> {
  try {
    console.log("[ADMIN_API] Fetching Leaderboard (Flat)...");
    const { data: profiles, error: pError } = await supabaseAdmin
      .from('profiles')
      .select('user_id, email');

    if (pError) throw pError;

    const { data: scores, error: sError } = await supabaseAdmin
      .from('scores')
      .select('user_id, score');

    if (sError) throw sError;

    const leaderboard = profiles.map((p: any) => {
      const pScores = scores.filter((s: any) => s.user_id === p.user_id);
      const topScore = pScores.length > 0 ? Math.max(...pScores.map((s: any) => s.score)) : 0;
      return {
        user_id: p.user_id,
        identity: p.email,
        score: topScore,
        rank: 0
      };
    })
    .filter(u => u.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((u, i) => ({ ...u, rank: i + 1 }));

    return { success: true, message: 'Leaderboard synchronized', data: leaderboard };
  } catch (err: any) {
    console.error('[ADMIN_API] getLeaderboard Error:', err);
    return { success: false, message: 'Leaderboard sync error' };
  }
}

export async function upsertCharity(data: any): Promise<AdminActionResponse> {
  try {
    const auth = await validateAdmin();
    if (auth.error) return { success: false, message: auth.error };

    const { error } = await supabaseAdmin
      .from('charities')
      .upsert({
        ...data,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    revalidatePath('/admin/charities');
    revalidatePath('/charities');
    return { success: true, message: 'Charity registry updated' };
  } catch (err: any) {
    console.error('[ADMIN_API] upsertCharity Error:', err);
    return { success: false, message: err.message || 'Charity registry error' };
  }
}

export async function deleteCharity(id: string): Promise<AdminActionResponse> {
  try {
    const auth = await validateAdmin();
    if (auth.error) return { success: false, message: auth.error };

    const { error } = await supabaseAdmin.from('charities').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/charities');
    return { success: true, message: 'Charity removed from registry' };
  } catch (err: any) {
    console.error('[ADMIN_API] deleteCharity Error:', err);
    return { success: false, message: err.message || 'Deletion error' };
  }
}
