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
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid';
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
