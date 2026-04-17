'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const TIER_PERCENTAGES = {
  jackpot: 0.40, // 5 match
  mid: 0.35,     // 4 match
  low: 0.25      // 3 match
};

const PLAN_PRICES = {
  monthly: 50,
  yearly: 500
};

export async function runDraw() {
  try {
    const supabaseSession = await createClient();
    const { data: { user } } = await supabaseSession.auth.getUser();

    if (!user) return { success: false, message: 'Authentication required' };

    const { data: profile } = await supabaseSession
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile || profile.role !== 'admin') return { success: false, message: 'Unauthorized. Admin privileges required.' };

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    console.log('[DRAW_ENGINE] Starting monthly draw calculation...');

    // 1. Calculate Prize Pool
    const { data: subs, error: subsError } = await adminSupabase
      .from('subscriptions')
      .select('plan')
      .eq('status', 'active');

    if (subsError) throw new Error('Failed to fetch active subscriptions');

    let totalPool = 0;
    (subs || []).forEach(sub => {
      totalPool += PLAN_PRICES[sub.plan as keyof typeof PLAN_PRICES] || 0;
    });

    if (totalPool === 0) {
      return { success: false, message: 'No active subscriptions found. Prize pool is zero.' };
    }

    const allocations = {
      jackpot: totalPool * TIER_PERCENTAGES.jackpot,
      mid: totalPool * TIER_PERCENTAGES.mid,
      low: totalPool * TIER_PERCENTAGES.low
    };

    // 2. Draw Mechanics
    const winningNumbers = new Set<number>();
    while (winningNumbers.size < 5) winningNumbers.add(Math.floor(Math.random() * 45) + 1);
    const finalNumbers = Array.from(winningNumbers).sort((a, b) => a - b);

    const { data: draw, error: drawError } = await adminSupabase
      .from('draws')
      .insert({ winning_numbers: finalNumbers, status: 'completed' })
      .select()
      .single();

    if (drawError || !draw) throw new Error(`Draw initialization failed: ${drawError?.message}`);

    // 3. Process Scores
    const { data: scores, error: scoresError } = await adminSupabase
      .from('scores')
      .select('user_id, score')
      .order('date', { ascending: false });

    if (scoresError) throw new Error('Failed to retrieve performance data');

    const userScoresMap = new Map<string, number[]>();
    (scores || []).forEach(s => {
      const existing = userScoresMap.get(s.user_id) || [];
      if (existing.length < 5) {
        existing.push(s.score);
        userScoresMap.set(s.user_id, existing);
      }
    });

    // 4. Find Winners by Tier
    const tierCounts = { jackpot: 0, mid: 0, low: 0 };
    const rawWinners: any[] = [];

    userScoresMap.forEach((userScores, userId) => {
      const matchCount = userScores.filter(score => finalNumbers.includes(score)).length;
      let tier: keyof typeof tierCounts | null = null;
      
      if (matchCount === 5) tier = 'jackpot';
      else if (matchCount === 4) tier = 'mid';
      else if (matchCount === 3) tier = 'low';

      if (tier) {
        tierCounts[tier]++;
        rawWinners.push({ userId, tier, matchCount });
      }
    });

    // 5. Finalize Payouts
    const winnersToInsert = rawWinners.map(winner => {
      const tierTotal = allocations[winner.tier as keyof typeof allocations];
      const winnersInTier = tierCounts[winner.tier as keyof typeof tierCounts];
      const userWinnings = winnersInTier > 0 ? (tierTotal / winnersInTier) : 0;

      return {
        draw_id: draw.id,
        user_id: winner.userId,
        match_count: winner.matchCount,
        prize_tier: winner.tier,
        winnings: parseFloat(userWinnings.toFixed(2)),
        status: 'pending'
      };
    });

    if (winnersToInsert.length > 0) {
      const { error: insertError } = await adminSupabase.from('draw_results').insert(winnersToInsert);
      if (insertError) throw new Error(`Failed to commit victory results: ${insertError.message}`);
    }

    console.log(`[DRAW_ENGINE] Draw completed. Found ${winnersToInsert.length} victors.`);

    return { 
      success: true, 
      message: `Draw #${draw.id.slice(0,8)} completed successfully.`,
      winning_numbers: finalNumbers, 
      payout_metrics: allocations,
      winners_found: winnersToInsert.length
    };
  } catch (error: any) {
    console.error('[DRAW_ENGINE_ERROR]', error);
    return { success: false, message: error.message || 'Critical system failure during draw execution' };
  }
}
