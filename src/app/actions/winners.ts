'use server';

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getWinnerDrawResults() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in to view draw results'
      };
    }

    const { data: results, error } = await supabase
      .from('draw_results')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      return {
        success: false,
        message: 'Error fetching draw results'
      };
    }

    return {
      success: true,
      message: 'Draw results fetched successfully',
      data: results
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}

export async function uploadWinnerProof(drawResultId: string, file: File) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in to upload proof'
      };
    }

    const { data: existingResult, error: resultError } = await supabase
      .from('draw_results')
      .select('*')
      .eq('id', drawResultId)
      .eq('user_id', user.id)
      .single();

    if (resultError || !existingResult) {
      return {
        success: false,
        message: 'Draw result not found'
      };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${drawResultId}-${Date.now()}.${fileExt}`;
    const filePath = `proofs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('winner-proofs')
      .upload(filePath, file);

    if (uploadError) {
      return {
        success: false,
        message: 'Error uploading file'
      };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('winner-proofs')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('draw_results')
      .update({
        proof_url: publicUrl,
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', drawResultId);

    if (updateError) {
      return {
        success: false,
        message: 'Error updating draw result'
      };
    }

    return {
      success: true,
      message: 'Proof uploaded successfully'
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}

export async function getAllWinnersForAdmin() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in'
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError || profile?.role !== 'admin') {
      return {
        success: false,
        message: 'Unauthorized'
      };
    }

    const { data: winners, error } = await supabase
      .from('draw_results')
      .select(`
        *,
        profiles:user_id(email)
      `);

    if (error) {
      return {
        success: false,
        message: 'Error fetching winners'
      };
    }

    const formattedWinners = (winners as any[]).map(winner => ({
      ...winner,
      user_email: winner.profiles?.email
    }));

    return {
      success: true,
      message: 'Winners fetched successfully',
      data: formattedWinners
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}

export async function approveWinner(winnerId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in'
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError || profile?.role !== 'admin') {
      return {
        success: false,
        message: 'Unauthorized'
      };
    }

    const { data: winner, error: winnerError } = await supabase
      .from('draw_results')
      .select('*')
      .eq('id', winnerId)
      .single();

    if (winnerError || !winner) {
      return {
        success: false,
        message: 'Winner not found'
      };
    }

    const { error: updateError } = await supabase
      .from('draw_results')
      .update({
        status: 'verified',
        updated_at: new Date().toISOString()
      })
      .eq('id', winnerId);

    if (updateError) {
      return {
        success: false,
        message: 'Error updating winner'
      };
    }

    const { data: userData } = await supabase.auth.admin.getUserById(winner.user_id);
    const userEmail = userData.user?.email;

    if (userEmail) {
      await resend.emails.send({
        from: 'no-reply@golfplatform.com',
        to: userEmail,
        subject: 'Congratulations! Your prize has been verified!',
        html: `
          <p>Dear Winner,</p>
          <p>Congratulations! Your prize has been verified and will be processed soon.</p>
          <p>Thank you for participating!</p>
          <p>Best regards,<br/>The Golf Platform Team</p>
        `
      });
    }

    return {
      success: true,
      message: 'Winner approved successfully'
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}

export async function rejectWinner(winnerId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in'
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError || profile?.role !== 'admin') {
      return {
        success: false,
        message: 'Unauthorized'
      };
    }

    const { data: winner, error: winnerError } = await supabase
      .from('draw_results')
      .select('*')
      .eq('id', winnerId)
      .single();

    if (winnerError || !winner) {
      return {
        success: false,
        message: 'Winner not found'
      };
    }

    const { error: updateError } = await supabase
      .from('draw_results')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', winnerId);

    if (updateError) {
      return {
        success: false,
        message: 'Error updating winner'
      };
    }

    const { data: userData } = await supabase.auth.admin.getUserById(winner.user_id);
    const userEmail = userData.user?.email;

    if (userEmail) {
      await resend.emails.send({
        from: 'no-reply@golfplatform.com',
        to: userEmail,
        subject: 'Regarding your prize claim',
        html: `
          <p>Dear Winner,</p>
          <p>We regret to inform you that your prize claim has been rejected.</p>
          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br/>The Golf Platform Team</p>
        `
      });
    }

    return {
      success: true,
      message: 'Winner rejected successfully'
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}
