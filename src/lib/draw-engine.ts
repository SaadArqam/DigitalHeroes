import { createClient } from '@/lib/supabase/server';
import { Draw, DrawConfig, DrawExecution, DrawResult, UserScore, ScoreFrequency, DrawNumber } from '@/lib/types';

export class DrawEngine {
  private async getSupabase() {
    return await createClient();
  }

  /**
   * Run a complete draw with specified configuration
   */
  async runDraw(drawId: string, config: DrawConfig): Promise<DrawExecution> {
    try {
      // Validate draw configuration
      const validatedConfig = this.validateConfig(config);
      
      // Fetch all active subscribers with their scores
      const userScores = await this.fetchActiveUserScores();
      
      // Generate draw numbers based on mode
      const drawNumbers = this.generateDrawNumbers(validatedConfig.mode, userScores);
      
      // Calculate score frequencies for algorithmic mode
      const scoreFrequencies = this.calculateScoreFrequencies(userScores);
      
      // Match scores against draw numbers
      const results = this.matchScores(userScores, drawNumbers);
      
      // Calculate prizes and handle jackpot
      const { totalPrizePool, jackpotRollover } = this.calculatePrizes(results, validatedConfig);
      
      // Create draw record
      const draw = await this.createDrawRecord(drawId, drawNumbers, validatedConfig, totalPrizePool, jackpotRollover);
      
      // Insert draw results
      const savedResults = await this.insertDrawResults(draw.id, results);
      
      // Calculate statistics
      const statistics = this.calculateStatistics(userScores, results, totalPrizePool, jackpotRollover);
      
      // Update draw status to completed
      if (!validatedConfig.simulation) {
        await this.updateDrawStatus(draw.id, 'completed');
      }
      
      return {
        draw,
        results: savedResults,
        statistics
      };

    } catch (error) {
      console.error('Draw execution error:', error);
      throw new Error(`Draw execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate draw configuration
   */
  private validateConfig(config: DrawConfig): DrawConfig {
    return {
      mode: config.mode,
      simulation: config.simulation || false,
      jackpot_percentage: config.jackpot_percentage || 40,
      three_match_percentage: config.three_match_percentage || 25,
      four_match_percentage: config.four_match_percentage || 35,
      five_match_percentage: config.five_match_percentage || 40
    };
  }

  /**
   * Fetch all active subscribers with their 5 latest scores
   */
  private async fetchActiveUserScores(): Promise<UserScore[]> {
    const supabase = await this.getSupabase();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authData) {
      throw new Error('Authentication required');
    }

    // Get all active subscribers
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('status', 'active');

    if (subError) {
      throw new Error('Failed to fetch active subscribers');
    }

    if (!subscriptions || subscriptions.length === 0) {
      return [];
    }

    const userIds = subscriptions.map(sub => sub.user_id);

    // Fetch 5 latest scores for each user
    const allScores: UserScore[] = [];
    
    for (const userId of userIds) {
      const { data: scores, error: scoreError } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(5);

      if (scoreError) {
        console.error(`Failed to fetch scores for user ${userId}:`, scoreError);
        continue;
      }

      if (scores) {
        allScores.push(...scores.map(score => ({
          id: score.id,
          user_id: score.user_id,
          score: score.score,
          date: score.date,
          created_at: score.created_at
        })));
      }
    }

    return allScores;
  }

  /**
   * Generate 5 draw numbers based on mode
   */
  private generateDrawNumbers(mode: 'random' | 'algorithmic', userScores: UserScore[]): number[] {
    const drawNumbers: number[] = [];
    
    if (mode === 'random') {
      // Pure random generation (1-45)
      const availableNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
      
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const selectedNumber = availableNumbers.splice(randomIndex, 1)[0];
        drawNumbers.push(selectedNumber);
      }
      
      return drawNumbers.sort((a, b) => a - b);
    } else {
      // Algorithmic mode - weighted by score frequency
      const scoreFrequencies = this.calculateScoreFrequencies(userScores);
      const weightedNumbers: DrawNumber[] = [];
      
      // Create weighted pool based on frequency
      for (const [score, frequency] of Object.entries(scoreFrequencies)) {
        for (let i = 0; i < frequency; i++) {
          weightedNumbers.push({
            number: parseInt(score),
            frequency
          });
        }
      }
      
      // Sort by frequency (less frequent = higher weight)
      weightedNumbers.sort((a, b) => a.frequency - b.frequency);
      
      // Select 5 numbers from weighted pool
      const selectedNumbers: number[] = [];
      const usedNumbers = new Set<number>();
      
      for (let i = 0; i < 5; i++) {
        // Find the highest weighted number not yet used
        let bestNumber: DrawNumber | null = null;
        
        for (const weightedNum of weightedNumbers) {
          if (!usedNumbers.has(weightedNum.number)) {
            if (!bestNumber || weightedNum.frequency < bestNumber.frequency) {
              bestNumber = weightedNum;
            }
          }
        }
        
        if (bestNumber) {
          selectedNumbers.push(bestNumber.number);
          usedNumbers.add(bestNumber.number);
        }
      }
      
      return selectedNumbers.sort((a, b) => a - b);
    }
  }

  /**
   * Calculate score frequencies across all users
   */
  private calculateScoreFrequencies(userScores: UserScore[]): ScoreFrequency {
    const frequencies: ScoreFrequency = {};
    
    for (const userScore of userScores) {
      const score = userScore.score;
      frequencies[score] = (frequencies[score] || 0) + 1;
    }
    
    return frequencies;
  }

  /**
   * Match user scores against draw numbers
   */
  private matchScores(userScores: UserScore[], drawNumbers: number[]): DrawResult[] {
    const results: DrawResult[] = [];
    
    for (const userScore of userScores) {
      let matchCount = 0;
      
      // Check each user score against draw numbers
      for (const score of userScores.filter(s => s.user_id === userScore.user_id)) {
        if (drawNumbers.includes(score.score)) {
          matchCount++;
        }
      }
      
      // Only users with 3, 4, or 5 matches qualify
      if (matchCount >= 3 && matchCount <= 5) {
        results.push({
          id: crypto.randomUUID(),
          draw_id: '', // Will be set after draw creation
          user_id: userScore.user_id,
          match_count: matchCount as 3 | 4 | 5,
          prize_amount: 0, // Will be calculated based on prize pool
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    
    return results;
  }

  /**
   * Calculate prize amounts and handle jackpot rollover
   */
  private calculatePrizes(results: DrawResult[], config: DrawConfig): { totalPrizePool: number; jackpotRollover: number } {
    const winnersByTier = {
      3: results.filter(r => r.match_count === 3),
      4: results.filter(r => r.match_count === 4),
      5: results.filter(r => r.match_count === 5)
    };

    const totalWinners = results.length;
    const jackpotPercentage = config.jackpot_percentage || 40;
    const threeMatchPercentage = config.three_match_percentage || 25;
    const fourMatchPercentage = config.four_match_percentage || 35;
    const fiveMatchPercentage = config.five_match_percentage || 40;

    // Calculate remaining pool after jackpot allocation
    const jackpotAmount = 100 * jackpotPercentage / 100;
    const remainingPool = 100 - jackpotAmount;

    // Calculate prize amounts for each tier
    const prizes = {
      3: remainingPool * threeMatchPercentage / 100,
      4: remainingPool * fourMatchPercentage / 100,
      5: remainingPool * fiveMatchPercentage / 100
    };

    // Split prizes equally among winners in each tier
    const totalPrizePool = Object.values(prizes).reduce((sum, prize) => sum + prize, 0);
    
    // Calculate rollover (40% of jackpot if no 5-match winners)
    const hasFiveMatchWinner = winnersByTier[5].length > 0;
    const jackpotRollover = hasFiveMatchWinner ? 0 : jackpotAmount;

    // Update prize amounts in results
    for (const result of results) {
      const tierPrize = prizes[result.match_count];
      const winnersInTier = winnersByTier[result.match_count];
      
      if (winnersInTier.length > 0) {
        result.prize_amount = tierPrize / winnersInTier.length;
      }
    }

    return {
      totalPrizePool,
      jackpotRollover
    };
  }

  /**
   * Create draw record in database
   */
  private async createDrawRecord(
    drawId: string, 
    drawNumbers: number[], 
    config: DrawConfig, 
    totalPrizePool: number, 
    jackpotRollover: number
  ): Promise<Draw> {
    
    // Get previous rollover amount
    const supabase = await this.getSupabase();
    const { data: lastDraw, error: lastDrawError } = await supabase
      .from('draws')
      .select('jackpot_rollover')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const previousRollover = lastDrawError ? 0 : (lastDraw?.jackpot_rollover || 0);
    const newRollover = previousRollover + jackpotRollover;

    const { data: draw, error } = await supabase
      .from('draws')
      .insert({
        id: drawId,
        month: new Date().toISOString().slice(0, 7), // YYYY-MM format
        draw_numbers: drawNumbers,
        mode: config.mode,
        status: 'active',
        jackpot_rollover: newRollover,
        total_pool: totalPrizePool,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create draw record: ${error.message}`);
    }

    return draw!;
  }

  /**
   * Insert draw results into database
   */
  private async insertDrawResults(drawId: string, results: DrawResult[]): Promise<DrawResult[]> {
    const savedResults: DrawResult[] = [];
    
    for (const result of results) {
      result.draw_id = drawId;
      
      const supabase = await this.getSupabase();
      const { data: savedResult, error } = await supabase
        .from('draw_results')
        .insert(result)
        .select()
        .single();

      if (error) {
        console.error(`Failed to save draw result for user ${result.user_id}:`, error);
        continue;
      }

      if (savedResult) {
        savedResults.push(savedResult);
      }
    }
    
    return savedResults;
  }

  /**
   * Calculate draw statistics
   */
  private calculateStatistics(
    userScores: UserScore[], 
    results: DrawResult[], 
    totalPrizePool: number, 
    jackpotRollover: number
  ) {
    const totalParticipants = new Set(userScores.map(us => us.user_id)).size;
    
    const winnersByTier = {
      3: results.filter(r => r.match_count === 3),
      4: results.filter(r => r.match_count === 4),
      5: results.filter(r => r.match_count === 5)
    };

    return {
      total_participants: totalParticipants,
      total_winners: {
        three_match: winnersByTier[3].length,
        four_match: winnersByTier[4].length,
        five_match: winnersByTier[5].length
      },
      prize_pool: totalPrizePool,
      rollover_amount: jackpotRollover
    };
  }

  /**
   * Update draw status to completed
   */
  private async updateDrawStatus(drawId: string, status: 'active' | 'completed'): Promise<void> {
    const supabase = await this.getSupabase();
    const { error } = await supabase
      .from('draws')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', drawId);

    if (error) {
      console.error(`Failed to update draw status: ${error.message}`);
    }
  }

  /**
   * Get current jackpot rollover amount
   */
  async getCurrentJackpotRollover(): Promise<number> {
    const supabase = await this.getSupabase();
    const { data: lastDraw, error } = await supabase
      .from('draws')
      .select('jackpot_rollover')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return error ? 0 : (lastDraw?.jackpot_rollover || 0);
  }
}
