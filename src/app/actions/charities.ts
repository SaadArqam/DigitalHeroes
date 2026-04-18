'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Fetches the global registry of verified impact partners.
 */
export async function getCharities() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('charities')
    .select('*')
    .order('is_featured', { ascending: false });

  if (error) return { success: false, message: error.message };
  return { success: true, data };
}

/**
 * Fetches a single impact partner's protocol details.
 */
export async function getCharityById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('charities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { success: false, message: error.message };
  return { success: true, data };
}

/**
 * Retrieves the current user's impact configuration.
 */
export async function getUserCharityPreference() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: 'Unauthorized' };

  const { data, error } = await supabase
    .from('user_charity_preferences')
    .select('*, charities(*)')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return { success: false, message: error.message };
  return { success: true, data };
}

/**
 * Synchronizes the user's impact partner and contribution weight.
 */
export async function saveCharityPreference(charityId: string, percentage: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: 'Authentication required' };

  // Protocol Validation: Contribution weight must be between 10% and 100%
  if (percentage < 10 || percentage > 100) {
    return { success: false, message: 'Protocol Violation: Contribution weight must be between 10-100%' };
  }

  const { error } = await supabase
    .from('user_charity_preferences')
    .upsert({
      user_id: user.id,
      charity_id: charityId,
      contribution_percentage: percentage,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  if (error) return { success: false, message: error.message };

  // Revalidate critical routes to reflect impact changes
  revalidatePath('/dashboard');
  revalidatePath('/modify-impact');
  
  return { success: true };
}
