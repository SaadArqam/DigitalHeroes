'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Helper to reliably bypass RLS for background draw processing
function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Generate 5 unique random numbers between 1 and 45
function generateWinningNumbers(): number[] {
  const numbers = new Set<number>();
  while (numbers.size < 5) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNum);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

export async function executeMonthlyDraw() {
  const runId = Math.random().toString(36).substring(7);
  console.info(`[DRAW_ENGINE_${runId}] Initiating monthly draw protocol...`);

  try {
    const supabaseSession = await createClient();
    const { data: { user }, error: authError } = await supabaseSession.auth.getUser();

    if (authError || !user) {
      console.warn(`[DRAW_ENGINE_${runId}] Unauthorized execution attempt (No user).`);
      return { success: false, message: 'Unauthorized: Session missing' };
    }

    // Verify Admin
    const { data: profile, error: profileError } = await supabaseSession
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError || !profile?.is_admin) {
      console.warn(`[DRAW_ENGINE_${runId}] Unauthorized execution attempt by user ${user.id}. Not an admin.`);
      return { success: false, message: 'Unauthorized: Invalid permissions' };
    }

    console.info(`[DRAW_ENGINE_${runId}] Admin verification passed for ${user.id}. Procuring Service Role Client.`);
    const adminSupabase = getAdminSupabase();
    
    // 1. Draw the numbers
    const winningNumbers = generateWinningNumbers();
    console.info(`[DRAW_ENGINE_${runId}] Numbers securely generated: [${winningNumbers.join(', ')}]`);

    // 2. Insert the draw record
    const { data: draw, error: drawError } = await adminSupabase
      .from('draws')
      .insert({ winning_numbers: winningNumbers, status: 'completed' })
      .select()
      .single();

    if (drawError || !draw) {
      console.error(`[DRAW_ENGINE_${runId}] CRITICAL: Failed to create core draw record.`, drawError);
      throw new Error('Failed to create draw record: ' + (drawError?.message || 'Unknown DB error'));
    }

    console.info(`[DRAW_ENGINE_${runId}] Core draw record mapped. Draw ID: ${draw.id}`);

    // 3. Fetch ALL user scores
    const { data: allScores, error: scoreError } = await adminSupabase
      .from('scores')
      .select('user_id, score');

    if (scoreError) {
      console.error(`[DRAW_ENGINE_${runId}] CRITICAL: Failed to fetch population scores.`, scoreError);
      throw new Error('Failed to fetch user scores: ' + scoreError.message);
    }

    console.info(`[DRAW_ENGINE_${runId}] Ingested ${allScores?.length || 0} scores for evaluation.`);

    // Group scores by user
    const userScoresMap = new Map<string, number[]>();
    (allScores || []).forEach(s => {
      const existing = userScoresMap.get(s.user_id) || [];
      existing.push(s.score);
      userScoresMap.set(s.user_id, existing);
    });

    console.info(`[DRAW_ENGINE_${runId}] Aggregated active population pool: ${userScoresMap.size} users.`);

    // 4. Calculate Matches
    const winnersToInsert: any[] = [];

    userScoresMap.forEach((userScores, userId) => {
      const matchCount = userScores.filter(score => winningNumbers.includes(score)).length;

      if (matchCount >= 3) {
        let prizeTier = 'low';
        if (matchCount === 4) prizeTier = 'mid';
        if (matchCount === 5) prizeTier = 'jackpot';

        winnersToInsert.push({
          draw_id: draw.id,
          user_id: userId,
          match_count: matchCount,
          prize_tier: prizeTier,
          status: 'unclaimed'
        });
      }
    });

    console.info(`[DRAW_ENGINE_${runId}] Match evaluation complete. Validating ${winnersToInsert.length} winner payouts.`);

    // 5. Insert Winners into DB
    if (winnersToInsert.length > 0) {
      const { error: insertError } = await adminSupabase
        .from('draw_results')
        .insert(winnersToInsert);

      if (insertError) {
        console.error(`[DRAW_ENGINE_${runId}] CRITICAL: Failed to save winners matrix into database.`, insertError);
        throw new Error('Failed to save winners: ' + insertError.message);
      }
    }

    console.info(`[DRAW_ENGINE_${runId}] Protocol finished successfully. Live dispatch returning to admin client.`);

    return {
      success: true,
      message: `Draw Complete! Winning logic deployed.`,
      data: {
        winningNumbers,
        winnerCount: winnersToInsert.length
      }
    };

  } catch (error) {
    console.error(`[DRAW_ENGINE_ERROR] Absolute failure during execution block.`, error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown systems error' };
  }
}

