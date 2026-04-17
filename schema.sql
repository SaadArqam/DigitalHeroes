-- DigitalHeroes Full Database Schema
-- Run this in Supabase SQL Editor to create all tables and RLS policies

-- ============================================
-- 1. Profiles Table (with is_admin protection)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile (except is_admin)" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND is_admin = (SELECT is_admin FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Service role can manage all profiles" 
  ON profiles FOR ALL 
  USING (true);

-- Create index on is_admin
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- ============================================
-- 2. Trigger to auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 3. Subscriptions Table
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'lapsed')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS for subscriptions
CREATE POLICY "Users can view their own subscription" 
  ON subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions" 
  ON subscriptions FOR ALL 
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- ============================================
-- 4. Scores Table
-- ============================================
CREATE TABLE IF NOT EXISTS scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 45),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- RLS for scores
CREATE POLICY "Users can manage their own scores" 
  ON scores FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scores_user_id ON scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_date ON scores(date);

-- ============================================
-- 5. Charities Table
-- ============================================
CREATE TABLE IF NOT EXISTS charities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;

-- RLS for charities
CREATE POLICY "Everyone can view charities" 
  ON charities FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage charities" 
  ON charities FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND is_admin = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_charities_is_featured ON charities(is_featured);

-- ============================================
-- 6. User Charity Preferences Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_charity_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  contribution_percentage INTEGER NOT NULL CHECK (contribution_percentage BETWEEN 10 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, charity_id)
);

-- Enable RLS
ALTER TABLE user_charity_preferences ENABLE ROW LEVEL SECURITY;

-- RLS for preferences
CREATE POLICY "Users can manage their own charity preferences" 
  ON user_charity_preferences FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_charity_prefs_user_id ON user_charity_preferences(user_id);

-- ============================================
-- 7. Draws Table
-- ============================================
CREATE TABLE IF NOT EXISTS draws (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  draw_numbers INTEGER[] NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('random', 'algorithmic')),
  status TEXT NOT NULL CHECK (status IN ('active', 'completed')),
  jackpot_rollover NUMERIC DEFAULT 0 NOT NULL,
  total_pool NUMERIC DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;

-- RLS for draws
CREATE POLICY "Everyone can view draws" 
  ON draws FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage draws" 
  ON draws FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND is_admin = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_draws_month ON draws(month);
CREATE INDEX IF NOT EXISTS idx_draws_status ON draws(status);

-- ============================================
-- 8. Draw Results Table
-- ============================================
CREATE TABLE IF NOT EXISTS draw_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  match_count INTEGER NOT NULL CHECK (match_count IN (3, 4, 5)),
  prize_amount NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'verified', 'rejected')),
  proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE draw_results ENABLE ROW LEVEL SECURITY;

-- RLS for draw results
CREATE POLICY "Users can view their own draw results" 
  ON draw_results FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all draw results" 
  ON draw_results FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND is_admin = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_draw_results_draw_id ON draw_results(draw_id);
CREATE INDEX IF NOT EXISTS idx_draw_results_user_id ON draw_results(user_id);
CREATE INDEX IF NOT EXISTS idx_draw_results_status ON draw_results(status);

-- ============================================
-- 9. Webhook Events Table (for idempotency)
-- ============================================
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id TEXT NOT NULL UNIQUE,
  processed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only can manage webhook events" 
  ON webhook_events FOR ALL 
  USING (true);

-- Create index
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_id ON webhook_events(stripe_event_id);

-- ============================================
-- 10. Function to auto-update updated_at timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables that have updated_at
DO $$ 
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles', 'subscriptions', 'charities', 'user_charity_preferences', 'draws', 'draw_results'] LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
      CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END $$;
