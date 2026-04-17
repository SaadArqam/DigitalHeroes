'use server';

import { createClient } from '@/lib/supabase/server';
import { CharityPreferenceSchema, CharityIdSchema } from '@/lib/validations';
import { CharityPreferenceResponse, Charity, UserCharityPreference } from '@/lib/types';

export async function getCharities(): Promise<{ success: boolean; message: string; data?: Charity[] }> {
  try {
    const supabase = await createClient();
    
    const { data: charities, error } = await supabase
      .from('charities')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      return {
        success: false,
        message: 'Error fetching charities'
      };
    }

    return {
      success: true,
      message: 'Charities fetched successfully',
      data: charities || []
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

export async function getCharityById(id: string): Promise<{ success: boolean; message: string; data?: Charity }> {
  try {
    // Validate input
    const validatedId = CharityIdSchema.parse({ id });

    const supabase = await createClient();
    
    const { data: charity, error } = await supabase
      .from('charities')
      .select('*')
      .eq('id', validatedId.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          success: false,
          message: 'Charity not found'
        };
      }
      return {
        success: false,
        message: 'Error fetching charity'
      };
    }

    return {
      success: true,
      message: 'Charity fetched successfully',
      data: charity
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

export async function getUserCharityPreferences(): Promise<CharityPreferenceResponse> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in to view charity preferences'
      };
    }

    const { data: preferences, error: fetchError } = await supabase
      .from('user_charity_preferences')
      .select(`
        *,
        charities (
          id,
          name,
          description,
          image_url,
          is_featured
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      return {
        success: false,
        message: 'Error fetching charity preferences'
      };
    }

    return {
      success: true,
      message: 'Charity preferences fetched successfully',
      data: preferences || []
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

export async function saveCharityPreference(
  charityId: string,
  contributionPercentage: number
): Promise<{ success: boolean; message: string }> {
  try {
    // Validate input
    const validatedData = CharityPreferenceSchema.parse({
      charity_id: charityId,
      contribution_percentage: contributionPercentage
    });

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in to save charity preferences'
      };
    }

    // Check if charity exists
    const { data: charity, error: charityError } = await supabase
      .from('charities')
      .select('id')
      .eq('id', validatedData.charity_id)
      .single();

    if (charityError || !charity) {
      return {
        success: false,
        message: 'Charity not found'
      };
    }

    // Check if user already has a preference for this charity
    const { data: existingPreference, error: checkError } = await supabase
      .from('user_charity_preferences')
      .select('*')
      .eq('user_id', user.id)
      .eq('charity_id', validatedData.charity_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return {
        success: false,
        message: 'Error checking existing preferences'
      };
    }

    if (existingPreference) {
      // Update existing preference
      const { error: updateError } = await supabase
        .from('user_charity_preferences')
        .update({
          contribution_percentage: validatedData.contribution_percentage,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPreference.id);

      if (updateError) {
        return {
          success: false,
          message: 'Error updating charity preference'
        };
      }

      return {
        success: true,
        message: 'Charity preference updated successfully'
      };
    } else {
      // Create new preference
      const { error: insertError } = await supabase
        .from('user_charity_preferences')
        .insert({
          user_id: user.id,
          charity_id: validatedData.charity_id,
          contribution_percentage: validatedData.contribution_percentage,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        return {
          success: false,
          message: 'Error saving charity preference'
        };
      }

      return {
        success: true,
        message: 'Charity preference saved successfully'
      };
    }

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

export async function deleteCharityPreference(charityId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Validate input
    const validatedId = CharityIdSchema.parse({ id: charityId });

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'You must be logged in to delete charity preferences'
      };
    }

    const { error: deleteError } = await supabase
      .from('user_charity_preferences')
      .delete()
      .eq('user_id', user.id)
      .eq('charity_id', validatedId.id);

    if (deleteError) {
      return {
        success: false,
        message: 'Error deleting charity preference'
      };
    }

    return {
      success: true,
      message: 'Charity preference deleted successfully'
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

export async function searchCharities(query: string): Promise<{ success: boolean; message: string; data?: Charity[] }> {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: false,
        message: 'Search query must be at least 2 characters long'
      };
    }

    const supabase = await createClient();
    
    const { data: charities, error } = await supabase
      .from('charities')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('is_featured', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      return {
        success: false,
        message: 'Error searching charities'
      };
    }

    return {
      success: true,
      message: 'Charities searched successfully',
      data: charities || []
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
