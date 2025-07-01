
-- Extend profiles table with additional user information
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0;

-- Create user consent log table for GDPR/CCPA compliance
CREATE TABLE public.user_consent_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL, -- 'gdpr', 'ccpa', 'terms', 'privacy'
  consent_given BOOLEAN NOT NULL,
  consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  version TEXT -- version of terms/privacy policy
);

-- Update bets table to match EdgeStake requirements
ALTER TABLE public.bets ADD COLUMN IF NOT EXISTS bet_type TEXT DEFAULT 'straight'; -- 'straight', 'parlay', 'futures'
ALTER TABLE public.bets ADD COLUMN IF NOT EXISTS bet_selection TEXT;
ALTER TABLE public.bets ADD COLUMN IF NOT EXISTS odds TEXT;
ALTER TABLE public.bets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Create user events table for tracking user interactions
CREATE TABLE public.user_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'click', 'wager', 'challenge', 'login', 'logout'
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user bet audit table for immutable ledger
CREATE TABLE public.user_bet_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bet_id UUID REFERENCES public.bets(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'created', 'accepted', 'cancelled', 'settled'
  amount_before DECIMAL(10,2),
  amount_after DECIMAL(10,2),
  escrow_amount DECIMAL(10,2),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create group challenges table for matrix-style betting
CREATE TABLE public.group_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_id TEXT NOT NULL,
  bet_type TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0.00,
  max_participants INTEGER DEFAULT 10,
  min_participants INTEGER DEFAULT 2,
  entry_fee DECIMAL(10,2) NOT NULL,
  vig_percent DECIMAL(5,2) DEFAULT 10.00,
  status TEXT DEFAULT 'open', -- 'open', 'closed', 'active', 'completed', 'cancelled'
  expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create match odds table for real-time odds data
CREATE TABLE public.match_odds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  sport_key TEXT NOT NULL,
  match_name TEXT NOT NULL,
  home_team TEXT,
  away_team TEXT,
  commence_time TIMESTAMP WITH TIME ZONE,
  bookmaker TEXT NOT NULL,
  market TEXT NOT NULL, -- 'h2h', 'spreads', 'totals'
  odds_data JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Update user_wallets to match the enhanced schema
ALTER TABLE public.user_wallets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.user_wallets ADD COLUMN IF NOT EXISTS last_transaction_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.user_wallets ADD COLUMN IF NOT EXISTS daily_limit DECIMAL(10,2) DEFAULT 1000.00;
ALTER TABLE public.user_wallets ADD COLUMN IF NOT EXISTS weekly_limit DECIMAL(10,2) DEFAULT 5000.00;

-- Enable RLS on new tables
ALTER TABLE public.user_consent_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bet_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_odds ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_consent_log
CREATE POLICY "Users can view their own consent log" ON public.user_consent_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consent" ON public.user_consent_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_events
CREATE POLICY "Users can view their own events" ON public.user_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert user events" ON public.user_events
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for user_bet_audit
CREATE POLICY "Users can view their own bet audit" ON public.user_bet_audit
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert bet audit records" ON public.user_bet_audit
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for group_challenges
CREATE POLICY "Anyone can view group challenges" ON public.group_challenges
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create group challenges" ON public.group_challenges
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their challenges" ON public.group_challenges
  FOR UPDATE USING (auth.uid() = creator_id);

-- Create RLS policies for match_odds (public read access)
CREATE POLICY "Anyone can view match odds" ON public.match_odds
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for user_wallets
CREATE POLICY "Users can view their own wallet" ON public.user_wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" ON public.user_wallets
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_bets_updated_at
  BEFORE UPDATE ON public.bets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_group_challenges_updated_at
  BEFORE UPDATE ON public.group_challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_wallets_updated_at
  BEFORE UPDATE ON public.user_wallets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to log user events
CREATE OR REPLACE FUNCTION public.log_user_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_event_data JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.user_events (user_id, event_type, event_data, ip_address, user_agent)
  VALUES (p_user_id, p_event_type, p_event_data, p_ip_address, p_user_agent)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log bet audit records
CREATE OR REPLACE FUNCTION public.log_bet_audit(
  p_user_id UUID,
  p_bet_id UUID,
  p_action_type TEXT,
  p_amount_before DECIMAL DEFAULT NULL,
  p_amount_after DECIMAL DEFAULT NULL,
  p_escrow_amount DECIMAL DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.user_bet_audit (user_id, bet_id, action_type, amount_before, amount_after, escrow_amount, metadata)
  VALUES (p_user_id, p_bet_id, p_action_type, p_amount_before, p_amount_after, p_escrow_amount, p_metadata)
  RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX idx_user_events_event_type ON public.user_events(event_type);
CREATE INDEX idx_user_events_created_at ON public.user_events(created_at);
CREATE INDEX idx_user_bet_audit_user_id ON public.user_bet_audit(user_id);
CREATE INDEX idx_user_bet_audit_bet_id ON public.user_bet_audit(bet_id);
CREATE INDEX idx_match_odds_event_id ON public.match_odds(event_id);
CREATE INDEX idx_match_odds_sport_key ON public.match_odds(sport_key);
CREATE INDEX idx_match_odds_last_updated ON public.match_odds(last_updated);
CREATE INDEX idx_group_challenges_status ON public.group_challenges(status);
CREATE INDEX idx_group_challenges_expiry_time ON public.group_challenges(expiry_time);
