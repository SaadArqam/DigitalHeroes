'use server';

import { createClient } from '@/lib/supabase/server';
import { DrawEngine } from '@/lib/draw-engine';
import { revalidatePath } from 'next/cache';

/**
 * Creates a new draw schedule for the specified month.
 */
export async function createDraw(month: string, mode: 'random' | 'algorithmic' = 'random') {
  const supabase = await createClient();
  
  // Auth check for admin role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Unauthorized' };
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single();
  if (profile?.role !== 'admin') return { success: false, message: 'Admin privileges required' };

  const { data, error } = await supabase
    .from('draws')
    .insert({
      month,
      mode,
      status: 'active',
      total_pool: 0, // Set after cycle analysis
      jackpot_rollover: 0
    })
    .select()
    .single();

  if (error) return { success: false, message: error.message };
  
  revalidatePath('/admin');
  return { success: true, data };
}

/**
 * Initiates a simulation sequence for the specified draw.
 */
export async function simulateDraw(drawId: string, mode: 'random' | 'algorithmic') {
  try {
    const output = await DrawEngine.simulateDraw(mode);
    return { success: true, data: output };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

/**
 * Finalizes and publishes the results of a draw.
 */
export async function publishDraw(drawId: string, mode: 'random' | 'algorithmic') {
  try {
    const output = await DrawEngine.runDraw(drawId, mode);
    
    revalidatePath('/dashboard');
    revalidatePath('/admin');
    
    return { success: true, data: output };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

/**
 * Retrieves the historical log of completed draws.
 */
export async function getDrawHistory() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('draws')
    .select('*')
    .eq('status', 'completed')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

/**
 * Fetches the current user's personalized prize results.
 */
export async function getUserDrawResults() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('draw_results')
    .select('*, draws(month, draw_numbers)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}
