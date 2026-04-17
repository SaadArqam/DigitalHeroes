'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const TIER_PERCENTAGES = {
  jackpot: 0.40, // 5 match
  midTier: 0.35,  // 4 match
  lowTier: 0.25   // 3 match
};

const PLAN_PRICES = {
  monthly: 50,
  yearly: 500
};

/**
 * Core Draw Engine
 * Handles prize pool calculation, number generation (Random vs Algorithmic),
 * and winner distribution.
 */
export async function runDraw(mode: 'random' | 'algorithmic' = 'random') {
  try {
    const supabaseSession = await createClient();
    const { data: { user } } = await supabaseSession.auth.getUser();

    if (!user) return { success: false, message: 'Authentication required' };

    const { data: profile } = await supabaseSession
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile?.role !== 'admin') {
       // Fallback for dev
       if (user.email !== 'admin@gmail.com' && user.email !== 'your@email.com') {
         return { success: false, message: 'Unauthorized.' };
       }
    }

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    console.log(`[DRAW_ENGINE] Initializing ${mode} drawing protocol...`);

    // 1. Calculate Prize Pool
    const { data: subs } = await adminSupabase
      .from('subscriptions')
      .select('plan')
      .eq('status', 'active');

    let revenue = 0;
    (subs || []).forEach(sub => {
      revenue += PLAN_PRICES[sub.plan as keyof typeof PLAN_PRICES] || 0;
    });

    // Strategy: 70% of revenue goes to Prize Pool, 10% to Charity, 20% to Platform
    const totalPrizePool = revenue * 0.7;
    
    // 2. Fetch User Scores for Match Checking
    const { data: allScores } = await adminSupabase
      .from('scores')
      .select('user_id, score')
      .order('date', { ascending: false });

    const userScoreSets = new Map<string, Set<number>>();
    (allScores || []).forEach(s => {
      if (!userScoreSets.has(s.user_id)) userScoreSets.set(s.user_id, new Set());
      const set = userScoreSets.get(s.user_id)!;
      if (set.size < 5) set.add(s.score);
    });

    // 3. Generate Winning Numbers
    let finalNumbers: number[] = [];
    
    const generateRandomNumbers = () => {
      const nums = new Set<number>();
      while (nums.size < 5) nums.add(Math.floor(Math.random() * 45) + 1);
      return Array.from(nums).sort((a, b) => a - b);
    };

    if (mode === 'random') {
      finalNumbers = generateRandomNumbers();
    } else {
      // Algorithmic Mode: Try to find a set that "saves" the jackpot
      // We'll run simulations and pick one where match count < 5 for everyone
      let attempts = 0;
      let bestSet: number[] = [];
      let minWinners = Infinity;

      while (attempts < 100) {
        const candidate = generateRandomNumbers();
        let jackpotWinners = 0;
        
        userScoreSets.forEach((scores) => {
          const matches = candidate.filter(n => scores.has(n)).length;
          if (matches === 5) jackpotWinners++;
        });

        if (jackpotWinners === 0) {
          finalNumbers = candidate;
          break;
        }

        if (jackpotWinners < minWinners) {
          minWinners = jackpotWinners;
          bestSet = candidate;
        }
        attempts++;
      }
      
      if (finalNumbers.length === 0) finalNumbers = bestSet; // Fallback to best found
    }

    // 4. Create Draw Record
    const { data: draw, error: drawError } = await adminSupabase
      .from('draws')
      .insert({ 
        month: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        winning_numbers: finalNumbers, 
        mode,
        status: 'completed',
        total_pool: totalPrizePool
      })
      .select()
      .single();

    if (drawError) throw drawError;

    // 5. Calculate Winners & Payouts
    const results: any[] = [];
    const tierWinners = { jackpot: 0, mid: 0, low: 0 };

    userScoreSets.forEach((scores, userId) => {
      const matchCount = finalNumbers.filter(n => scores.has(n)).length;
      let tier: null | 'jackpot' | 'mid' | 'low' = null;
      
      if (matchCount === 5) tier = 'jackpot';
      else if (matchCount === 4) tier = 'mid';
      else if (matchCount === 3) tier = 'low';

      if (tier) {
        tierWinners[tier]++;
        results.push({ userId, tier, matchCount });
      }
    });

    // Allocate prize pool per tier
    const allocations = {
      jackpot: totalPrizePool * TIER_PERCENTAGES.jackpot,
      mid: totalPrizePool * TIER_PERCENTAGES.midTier,
      low: totalPrizePool * TIER_PERCENTAGES.lowTier
    };

    const winnersToInsert = results.map(r => {
      const share = tierWinners[r.tier as keyof typeof tierWinners];
      const prize = share > 0 ? (allocations[r.tier as keyof typeof allocations] / share) : 0;
      
      return {
        draw_id: draw.id,
        user_id: r.userId,
        match_count: r.matchCount,
        prize_tier: r.tier,
        winnings: parseFloat(prize.toFixed(2)),
        status: 'pending'
      };
    });

    if (winnersToInsert.length > 0) {
      await adminSupabase.from('draw_results').insert(winnersToInsert);
    }

    return { 
      success: true, 
      message: `Draw #${draw.id.slice(0,8)} complete.`,
      data: {
        numbers: finalNumbers,
        winners: winnersToInsert.length,
        pool: totalPrizePool
      }
    };

  } catch (error: any) {
    console.error('[DRAW_ENGINE_CRASH]', error);
    return { success: false, message: error.message };
  }
}
