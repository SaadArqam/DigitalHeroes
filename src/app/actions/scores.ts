'use server';

import { createClient } from '@/lib/supabase/server';
import { ScoreSchema, ScoreIdSchema } from '@/lib/validations';
import { ScoreActionResponse } from '@/lib/types';

export async function addScore(score: number, date: string): Promise<ScoreActionResponse> {
  try {
    // Validate input
    const validatedData = ScoreSchema.parse({ score, date });

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in to add a score'
      };
    }

    // Check if score already exists for this date
    const { data: existingScore, error: checkError } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', validatedData.date)
      .single();

    if (existingScore) {
      return {
        success: false,
        message: 'A score for this date already exists'
      };
    }

    // Get current scores count
    const { data: currentScores, error: countError } = await supabase
      .from('scores')
      .select('id, date')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (countError) {
      return {
        success: false,
        message: 'Error checking existing scores'
      };
    }

    // If user already has 5 scores, delete the oldest
    if (currentScores && currentScores.length >= 5) {
      const oldestScore = currentScores[currentScores.length - 1];
      const { error: deleteError } = await supabase
        .from('scores')
        .delete()
        .eq('id', oldestScore.id);

      if (deleteError) {
        return {
          success: false,
          message: 'Error removing oldest score'
        };
      }
    }

    // Add the new score
    const { data: newScore, error: insertError } = await supabase
      .from('scores')
      .insert({
        user_id: user.id,
        score: validatedData.score,
        date: validatedData.date
      })
      .select()
      .single();

    if (insertError) {
      return {
        success: false,
        message: 'Error adding score'
      };
    }

    return {
      success: true,
      message: currentScores && currentScores.length >= 5 
        ? 'Score added successfully. Oldest score removed to maintain limit of 5 scores.'
        : 'Score added successfully',
      data: newScore
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

export async function editScore(id: string, score: number, date: string): Promise<ScoreActionResponse> {
  try {
    // Validate input
    const validatedId = ScoreIdSchema.parse({ id });
    const validatedData = ScoreSchema.parse({ score, date });

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in to edit a score'
      };
    }

    // Check if score exists and belongs to user
    const { data: existingScore, error: fetchError } = await supabase
      .from('scores')
      .select('*')
      .eq('id', validatedId.id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingScore) {
      return {
        success: false,
        message: 'Score not found or you do not have permission to edit it'
      };
    }

    // Check if another score exists for this date (excluding current score)
    const { data: duplicateScore, error: duplicateError } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', validatedData.date)
      .neq('id', validatedId.id)
      .single();

    if (duplicateScore) {
      return {
        success: false,
        message: 'A score for this date already exists'
      };
    }

    // Update the score
    const { data: updatedScore, error: updateError } = await supabase
      .from('scores')
      .update({
        score: validatedData.score,
        date: validatedData.date
      })
      .eq('id', validatedId.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        message: 'Error updating score'
      };
    }

    return {
      success: true,
      message: 'Score updated successfully',
      data: updatedScore
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

export async function deleteScore(id: string): Promise<ScoreActionResponse> {
  try {
    // Validate input
    const validatedId = ScoreIdSchema.parse({ id });

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in to delete a score'
      };
    }

    // Check if score exists and belongs to user
    const { data: existingScore, error: fetchError } = await supabase
      .from('scores')
      .select('*')
      .eq('id', validatedId.id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingScore) {
      return {
        success: false,
        message: 'Score not found or you do not have permission to delete it'
      };
    }

    // Delete the score
    const { error: deleteError } = await supabase
      .from('scores')
      .delete()
      .eq('id', validatedId.id)
      .eq('user_id', user.id);

    if (deleteError) {
      return {
        success: false,
        message: 'Error deleting score'
      };
    }

    return {
      success: true,
      message: 'Score deleted successfully'
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

export async function getUserScores(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in to view scores'
      };
    }

    const { data: scores, error: fetchError } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (fetchError) {
      return {
        success: false,
        message: 'Error fetching scores'
      };
    }

    return {
      success: true,
      message: 'Scores fetched successfully',
      data: scores || []
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
