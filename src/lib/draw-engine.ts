import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// --- Types ---

export type UserScore = {
  userId: string;
  scores: number[];
};

export type DrawResult = {
  userId: string;
  matchCount: 3 | 4 | 5;
  prizeAmount: number;
  status?: string;
};

export type DrawOutput = {
  drawNumbers: number[];
  winners: DrawResult[];
  totalPool: number;
  jackpotRollover: number;
};

// --- Engine Service ---

const TIER_ALLOCATIONS = {
  5: 0.40, // Jackpot
  4: 0.35, 
  3: 0.25
};

export class DrawEngine {
  /**
   * Generates 5 unique random numbers between 1-45.
   */
  static generateRandomNumbers(): number[] {
    const nums = new Set<number>();
    while (nums.size < 5) {
      nums.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(nums).sort((a, b) => a - b);
  }

  /**
   * Weight selection toward most frequent scores across the player base.
   */
  static generateAlgorithmicNumbers(allScores: UserScore[]): number[] {
    const frequencies: Record<number, number> = {};
    allScores.forEach(us => {
      us.scores.forEach(s => {
        frequencies[s] = (frequencies[s] || 0) + 1;
      });
    });

    const pool: number[] = [];
    for (let i = 1; i <= 45; i++) {
        const weight = (frequencies[i] || 0) + 1; // Base weight of 1
        for (let j = 0; j < weight; j++) pool.push(i);
    }

    const nums = new Set<number>();
    while (nums.size < 5) {
      const idx = Math.floor(Math.random() * pool.length);
      nums.add(pool[idx]);
    }
    return Array.from(nums).sort((a, b) => a - b);
  }

  /**
   * Calculates the number of matches between user scores and draw numbers.
   */
  static matchScores(userScores: number[], drawNumbers: number[]): number {
    const matches = userScores.filter(s => drawNumbers.includes(s)).length;
    return matches >= 3 ? matches : 0;
  }

  /**
   * Distributes the pool among winners according to prize tiers.
   */
  static calculatePrizes(winners: DrawResult[], totalPool: number, currentJackpot: number): { winners: DrawResult[], rollover: number } {
    const poolWithJackpot = totalPool + currentJackpot;
    
    // Group winners by tier
    const tiers: Record<number, DrawResult[]> = { 3: [], 4: [], 5: [] };
    winners.forEach(w => tiers[w.matchCount].push(w));

    let rollover = 0;
    const finalWinners: DrawResult[] = [];

    // Process Tiers
    [5, 4, 3].forEach(matchCount => {
      const tierWinners = tiers[matchCount];
      const allocation = (matchCount === 5) 
        ? poolWithJackpot * TIER_ALLOCATIONS[5] 
        : totalPool * TIER_ALLOCATIONS[matchCount as 3|4];

      if (tierWinners.length > 0) {
        const prizePerWinner = parseFloat((allocation / tierWinners.length).toFixed(2));
        tierWinners.forEach(tw => {
          finalWinners.push({ ...tw, prizeAmount: prizePerWinner });
        });
      } else if (matchCount === 5) {
        rollover = allocation;
      }
    });

    return { winners: finalWinners, rollover };
  }

  /**
   * Simulates a draw for validation without database writes.
   */
  static async simulateDraw(mode: 'random' | 'algorithmic'): Promise<DrawOutput> {
    const supabase = await createClient();
    
    // Fetch Data
    const { data: subs } = await supabase.from('subscriptions').select('user_id').eq('status', 'active');
    const { data: scores } = await supabase.from('scores').select('user_id, score').order('date', { ascending: false });

    // Aggregate User Scores (latest 5 per user)
    const userMap = new Map<string, number[]>();
    (scores || []).forEach(s => {
      if (!userMap.has(s.user_id)) userMap.set(s.user_id, []);
      const current = userMap.get(s.user_id)!;
      if (current.length < 5) current.push(s.score);
    });

    const activeUserScores: UserScore[] = (subs || []).map(sub => ({
      userId: sub.user_id,
      scores: userMap.get(sub.user_id) || []
    }));

    // Generate Numbers
    const numbers = mode === 'random' 
      ? this.generateRandomNumbers() 
      : this.generateAlgorithmicNumbers(activeUserScores);

    // Initial Matching
    const winners: DrawResult[] = activeUserScores.map(us => {
      const matchCount = this.matchScores(us.scores, numbers);
      return matchCount > 0 ? { userId: us.userId, matchCount: matchCount as any, prizeAmount: 0 } : null;
    }).filter(Boolean) as DrawResult[];

    // Calculate Prizes (Estimation based on latest active draw pool)
    const { data: latestDraw } = await supabase.from('draws')
      .select('total_pool, jackpot_rollover')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const pool = latestDraw?.total_pool || 1000;
    const jackpot = latestDraw?.jackpot_rollover || 0;

    const { winners: processedWinners, rollover } = this.calculatePrizes(winners, pool, jackpot);

    return {
      drawNumbers: numbers,
      winners: processedWinners,
      totalPool: pool,
      jackpotRollover: rollover
    };
  }

  /**
   * Executes the full draw sequence and commits results to the ledger.
   */
  static async runDraw(drawId: string, mode: 'random' | 'algorithmic'): Promise<DrawOutput> {
    // We use service role for bulk operations
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: currentDraw, error: drawFetchError } = await adminSupabase
      .from('draws')
      .select('*')
      .eq('id', drawId)
      .single();

    if (drawFetchError || !currentDraw) throw new Error('Draw Registry Error');

    const output = await this.simulateDraw(mode);

    // 1. Log Results
    const resultsToInsert = output.winners.map(w => ({
      draw_id: drawId,
      user_id: w.userId,
      match_count: w.matchCount,
      prize_amount: w.prizeAmount,
      status: 'pending'
    }));

    if (resultsToInsert.length > 0) {
      await adminSupabase.from('draw_results').insert(resultsToInsert);
    }

    // 2. Finalize Draw Record
    await adminSupabase.from('draws')
      .update({
        draw_numbers: output.drawNumbers,
        status: 'completed',
        jackpot_rollover: output.jackpotRollover,
        updated_at: new Date().toISOString()
      })
      .eq('id', drawId);

    return output;
  }
}
