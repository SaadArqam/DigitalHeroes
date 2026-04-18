'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Validates input and session.
 */
async function validateEntry(score: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Authentication Required' };
  if (score < 1 || score > 45) return { error: 'Score must be between 1 and 45' };

  return { user, supabase };
}

/**
 * Adds a new score. Deletes the oldest if capacity (5) is reached.
 */
export async function addScore(score: number, date: string) {
  const auth = await validateEntry(score);
  if (auth.error || !auth.user || !auth.supabase) {
    return { success: false, message: auth.error || 'System Identity Error' };
  }
  
  const { user, supabase } = auth;

  try {
    // 1. Duplicate check
    const { data: duplicate } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', date)
      .maybeSingle();

    if (duplicate) return { success: false, message: 'Conflict: An entry already exists for this date.' };

    // 2. Rolling Limit Management
    const { data: existing } = await supabase
      .from('scores')
      .select('id, date')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (existing && existing.length >= 5) {
      const oldest = existing[existing.length - 1];
      await supabase.from('scores').delete().eq('id', oldest.id);
    }

    // 3. Insert
    const { error } = await supabase.from('scores').insert({
      user_id: user.id,
      score,
      date
    });

    if (error) throw error;
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || 'System error' };
  }
}

/**
 * Updates a record with conflict validation.
 */
export async function editScore(id: string, score: number, date: string) {
  const auth = await validateEntry(score);
  if (auth.error || !auth.user || !auth.supabase) {
    return { success: false, message: auth.error || 'System Identity Error' };
  }
  
  const { user, supabase } = auth;

  try {
    const { data: conflict } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', date)
      .neq('id', id)
      .maybeSingle();

    if (conflict) return { success: false, message: 'Date Conflict: Another score exists for this date.' };

    const { error } = await supabase
      .from('scores')
      .update({ score, date })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || 'Update error' };
  }
}

/**
 * Deletes a player record.
 */
export async function deleteScore(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: 'Unauthorized' };

  try {
    const { error } = await supabase.from('scores').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || 'Deletion error' };
  }
}

/**
 * Fetches user's history (Newest First).
 */
export async function getScores() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  return data || [];
}
