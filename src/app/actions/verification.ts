'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Retrieves the current user's draw results that require victory verification.
 */
export async function getPendingVerifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('draw_results')
    .select('*, draws(month)')
    .eq('user_id', user.id)
    .or('status.eq.pending,proof_url.is.null')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

/**
 * Uploads victory proof image to storage and synchronizes the ledger.
 */
export async function uploadProof(drawResultId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: 'Unauthorized' };

  const file = formData.get('file') as File;
  if (!file) return { success: false, message: 'Proof matrix required' };

  // Protocol Check: Maximum 5MB
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, message: 'File density too high (Max 5MB)' };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${drawResultId}.${fileExt}`;

    // 1. Upload to winner-proofs bucket
    const { error: uploadError } = await supabase.storage
      .from('winner-proofs')
      .upload(filePath, file, { 
        upsert: true,
        contentType: file.type 
      });

    if (uploadError) throw uploadError;

    // 2. Synchronize Ledger
    const { error: dbError } = await supabase
      .from('draw_results')
      .update({
        proof_url: filePath,
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', drawResultId)
      .eq('user_id', user.id);

    if (dbError) throw dbError;

    revalidatePath('/dashboard/verify');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || 'Verification Sync Failure' };
  }
}
