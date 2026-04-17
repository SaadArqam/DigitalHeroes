export interface Score {
  id: string;
  user_id: string;
  score: number;
  date: string;
  created_at: string;
}

export interface ScoreFormData {
  score: number;
  date: string;
}

export interface ScoreActionResponse {
  success: boolean;
  message: string;
  data?: Score;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'lapsed';
  stripe_customer_id: string;
  stripe_subscription_id: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: 'monthly' | 'yearly';
  name: string;
  price: number;
  interval: 'month' | 'year';
  stripe_price_id: string;
  features: string[];
}

export interface CheckoutSessionResponse {
  success: boolean;
  message: string;
  sessionId?: string;
  url?: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCharityPreference {
  id: string;
  user_id: string;
  charity_id: string;
  contribution_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface CharityPreferenceResponse {
  success: boolean;
  message: string;
  data?: UserCharityPreference[];
}

export interface Draw {
  id: string;
  month: string;
  draw_numbers: number[];
  mode: 'random' | 'algorithmic';
  status: 'active' | 'completed';
  jackpot_rollover: number;
  total_pool: number;
  created_at: string;
  updated_at: string;
}

export interface DrawResult {
  id: string;
  draw_id: string;
  user_id: string;
  match_count: 3 | 4 | 5;
  prize_amount: number;
  status: 'pending' | 'paid' | 'verified' | 'rejected';
  proof_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DrawConfig {
  mode: 'random' | 'algorithmic';
  simulation?: boolean;
  jackpot_percentage?: number;
  three_match_percentage?: number;
  four_match_percentage?: number;
  five_match_percentage?: number;
}

export interface DrawExecution {
  draw: Draw;
  results: DrawResult[];
  statistics: {
    total_participants: number;
    total_winners: {
      three_match: number;
      four_match: number;
      five_match: number;
    };
    prize_pool: number;
    rollover_amount: number;
  };
}

export interface UserScore {
  id: string;
  user_id: string;
  score: number;
  date: string;
  created_at: string;
}

export interface ScoreFrequency {
  [score: number]: number; // Maps score value to frequency count
}

export interface DrawNumber {
  number: number;
  frequency: number;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalPrizePool: number;
  charityTotals: Array<{
    charity_id: string;
    charity_name: string;
    total_contributions: number;
  }>;
}

export interface AdminUser {
  id: string;
  email: string;
  is_admin: boolean;
  subscription_status?: string;
  subscription_plan?: 'monthly' | 'yearly';
  total_scores: number;
  created_at: string;
}

export interface AdminDraw {
  id: string;
  month: string;
  draw_numbers: number[];
  mode: 'random' | 'algorithmic';
  status: 'active' | 'completed';
  total_pool: number;
  jackpot_rollover: number;
  created_at: string;
}

export interface AdminWinner {
  id: string;
  draw_id: string;
  user_id: string;
  user_email: string;
  match_count: 3 | 4 | 5;
  prize_amount: number;
  status: 'pending' | 'paid' | 'verified' | 'rejected';
  proof_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalScores: number;
  activeSubscription: boolean;
  subscriptionPlan?: 'monthly' | 'yearly';
  subscriptionStatus?: string;
  nextDrawDate?: string;
  scoresEntered: number;
  totalWinnings: number;
  recentWinnings: Array<{
    id: string;
    amount: number;
    match_count: 3 | 4 | 5;
    date: string;
    status: 'pending' | 'paid' | 'verified';
  }>;
}
