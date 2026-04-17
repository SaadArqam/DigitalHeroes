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
  try {
    const supabaseSession = await createClient();
    const { data: { user } } = await supabaseSession.auth.getUser();

    // Verify Admin
    const { data: profile } = await supabaseSession
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      return { success: false, message: 'Unauthorized' };
    }

    const adminSupabase = getAdminSupabase();
    
    // 1. Draw the numbers
    const winningNumbers = generateWinningNumbers();

    // 2. Insert the draw record
    const { data: draw, error: drawError } = await adminSupabase
      .from('draws')
      .insert({ winning_numbers: winningNumbers, status: 'completed' })
      .select()
      .single();

    if (drawError || !draw) throw new Error('Failed to create draw record: ' + drawError?.message);

    // 3. Fetch ALL user scores
    const { data: allScores, error: scoreError } = await adminSupabase
      .from('scores')
      .select('user_id, score');

    if (scoreError) throw new Error('Failed to fetch user scores: ' + scoreError.message);

    // Group scores by user
    const userScoresMap = new Map<string, number[]>();
    allScores.forEach(s => {
      const existing = userScoresMap.get(s.user_id) || [];
      existing.push(s.score);
      userScoresMap.set(s.user_id, existing);
    });

    // 4. Calculate Matches
    const winnersToInsert: any[] = [];

    userScoresMap.forEach((userScores, userId) => {
      // Find how many of the user's scores exist in the winning numbers array
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

    // 5. Insert Winners into DB
    if (winnersToInsert.length > 0) {
      const { error: insertError } = await adminSupabase
        .from('draw_results')
        .insert(winnersToInsert);

      if (insertError) throw new Error('Failed to save winners: ' + insertError.message);
    }

    return {
      success: true,
      message: `Draw Complete! Winning logic deployed.`,
      data: {
        winningNumbers,
        winnerCount: winnersToInsert.length
      }
    };

  } catch (error) {
    console.error('Draw execution failed:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}
