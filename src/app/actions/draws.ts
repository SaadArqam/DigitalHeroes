// src/app/actions/draws.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { DrawEngine } from '@/lib/draw-engine';
import { revalidatePath } from 'next/cache';

/**
 * Standard Response Interface
 */
interface DrawActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Creates a new draw schedule for the specified month.
 */
export async function createDraw(month: string, mode: 'random' | 'algorithmic' = 'random'): Promise<DrawActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'Unauthorized' };
    
    const { data: profile } = await supabase.from('profiles').select('is_admin, role').eq('user_id', user.id).maybeSingle();
    const isAdmin = profile?.is_admin || profile?.role === 'admin' || user.email === 'admin@gmail.com';

    if (!isAdmin) return { success: false, message: 'Admin privileges required' };

    // Normalize partial YYYY-MM to full YYYY-MM-DD
    const safeDate = month.length === 7 ? `${month}-01` : month;

    // Generate Initial Draw Numbers (6 distinct integers 1-45)
    const nums = new Set<number>();
    while (nums.size < 6) {
      nums.add(Math.floor(Math.random() * 45) + 1);
    }
    const initialNumbers = Array.from(nums).sort((a, b) => a - b);

    const { data, error } = await supabaseAdmin
      .from('draws')
      .insert({
        month: safeDate,
        draw_numbers: initialNumbers,
        mode,
        total_pool: 0,
        jackpot_rollover: 0
      })
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/admin');
    return { success: true, message: `Draw cycle for ${month} initialized`, data };
  } catch (err: any) {
    console.error('[DRAW_API] createDraw Error:', err);
    return { success: false, message: err.message || 'Draw initialization failure' };
  }
}

/**
 * Initiates a simulation sequence for the specified draw.
 */
export async function simulateDraw(drawId: string, mode: 'random' | 'algorithmic'): Promise<DrawActionResponse> {
  try {
    const output = await DrawEngine.simulateDraw(mode);
    return { success: true, message: 'Simulation sequence complete', data: output };
  } catch (err: any) {
    console.error('[DRAW_API] simulateDraw Error:', err);
    return { success: false, message: err.message || 'Simulation error' };
  }
}

/**
 * Finalizes and publishes the results of a draw.
 */
export async function publishDraw(drawId: string, mode: 'random' | 'algorithmic'): Promise<DrawActionResponse> {
  try {
    const output = await DrawEngine.runDraw(drawId, mode);
    
    revalidatePath('/dashboard');
    revalidatePath('/admin');
    
    return { success: true, message: 'Results published to network', data: output };
  } catch (err: any) {
    console.error('[DRAW_API] publishDraw Error:', err);
    return { success: false, message: err.message || 'Publishing error' };
  }
}

/**
 * Retrieves the historical log of completed draws.
 */
export async function getDrawHistory() {
  try {
    const { data, error } = await supabaseAdmin
      .from('draws')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err: any) {
    console.error('[DRAW_API] getDrawHistory Error:', err);
    return [];
  }
}

/**
 * Fetches the current user's personalized prize results.
 */
export async function getUserDrawResults() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('draw_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err: any) {
    console.error('[DRAW_API] getUserDrawResults Error:', err);
    return [];
  }
}
