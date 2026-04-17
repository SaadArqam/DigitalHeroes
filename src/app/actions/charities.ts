'use server';

import { createClient } from '@/lib/supabase/server';
import { CharityPreferenceSchema, CharityIdSchema } from '@/lib/validations';
import { CharityPreferenceResponse, Charity, UserCharityPreference } from '@/lib/types';
import { createClient as createAdminClient } from '@supabase/supabase-js';

/**
 * PRODUCTION FIX: Charity Upsert Contraint
 * Ensure your DB has the following unique constraint:
 * ALTER TABLE user_charity_preferences ADD CONSTRAINT user_charity_preferences_user_id_key UNIQUE (user_id);
 */

export async function getCharities(): Promise<{ success: boolean; message: string; data?: Charity[] }> {
  try {
    const supabase = await createClient();
    const { data: charities, error } = await supabase
      .from('charities')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('name', { ascending: true });

    if (error) return { success: false, message: 'Error fetching charities' };
    return { success: true, message: 'Charities fetched successfully', data: charities || [] };
  } catch (error: any) {
    return { success: false, message: error.message || 'An unexpected error occurred' };
  }
}

export async function searchCharities(query: string): Promise<{ success: boolean; message: string; data?: Charity[] }> {
  try {
    if (!query || query.trim().length < 2) return { success: false, message: 'Query too short' };
    const supabase = await createClient();
    const { data: charities, error } = await supabase
      .from('charities')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('is_featured', { ascending: false })
      .order('name', { ascending: true });

    if (error) return { success: false, message: 'Error searching' };
    return { success: true, message: 'Success', data: charities || [] };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getCharityById(id: string): Promise<{ success: boolean; message: string; data?: Charity }> {
  try {
    const validatedId = CharityIdSchema.parse({ id });
    const supabase = await createClient();
    const { data: charity, error } = await supabase.from('charities').select('*').eq('id', validatedId.id).single();
    if (error) return { success: false, message: error.code === 'PGRST116' ? 'Charity not found' : 'Error fetching charity' };
    return { success: true, message: 'Charity fetched successfully', data: charity };
  } catch (error: any) {
    return { success: false, message: error.message || 'An unexpected error occurred' };
  }
}

export async function getUserCharityPreferences(): Promise<CharityPreferenceResponse> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { success: false, message: 'Not authenticated' };

    const { data: preferences, error: fetchError } = await supabase
      .from('user_charity_preferences')
      .select('*, charities(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) return { success: false, message: 'Error fetching preferences' };
    return { success: true, message: 'Preferences fetched', data: preferences || [] };
  } catch (error: any) {
    return { success: false, message: error.message || 'Unexpected error' };
  }
}

export async function saveCharityPreference(
  charityId: string,
  contributionPercentage: number
): Promise<{ success: boolean; message: string }> {
  try {
    const validatedData = CharityPreferenceSchema.parse({
      charity_id: charityId,
      contribution_percentage: contributionPercentage
    });

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { success: false, message: 'Auth required' };

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subscription?.status !== 'active') {
      return { success: false, message: 'Active subscription required to set impact partner.' };
    }

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error: upsertError } = await adminSupabase
      .from('user_charity_preferences')
      .upsert(
        {
          user_id: user.id,
          charity_id: validatedData.charity_id,
          contribution_percentage: validatedData.contribution_percentage,
          updated_at: new Date().toISOString(),
        },
        { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        }
      );

    if (upsertError) {
      console.error('[CHARITY_UPSERT_ERROR]', upsertError);
      return { success: false, message: upsertError.message };
    }

    return { success: true, message: 'Impact partner updated' };
  } catch (error: any) {
    console.error('[CHARITY_SAVE_CRITICAL]', error);
    return { success: false, message: error.message || 'Unexpected failure' };
  }
}

export async function deleteCharityPreference(charityId: string): Promise<{ success: boolean; message: string }> {
  try {
    const validatedId = CharityIdSchema.parse({ id: charityId });
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'Auth required' };

    const { error } = await supabase.from('user_charity_preferences').delete().eq('user_id', user.id).eq('charity_id', validatedId.id);
    if (error) return { success: false, message: 'Error deleting' };
    return { success: true, message: 'Deleted successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
