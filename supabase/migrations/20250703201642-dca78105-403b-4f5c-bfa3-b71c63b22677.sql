
-- Grant admin access to vimj1915@gmail.com and create 2 additional admin accounts
UPDATE public.profiles 
SET plan_type = 'admin' 
WHERE email = 'vimj1915@gmail.com';

-- Create 2 additional admin accounts (they'll need to sign up first, but we'll set them as admin when they do)
-- We'll also create some demo admin accounts for testing
INSERT INTO public.profiles (id, email, full_name, plan_type) 
VALUES 
  (gen_random_uuid(), 'admin1@edgestake.ai', 'Admin User 1', 'admin'),
  (gen_random_uuid(), 'admin2@edgestake.ai', 'Admin User 2', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Create bet matching system table
CREATE TABLE public.bet_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_bet_id UUID NOT NULL REFERENCES public.bets(id) ON DELETE CASCADE,
  opponent_bet_id UUID NOT NULL REFERENCES public.bets(id) ON DELETE CASCADE,
  matched_amount NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  escrow_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  total_escrow NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'disputed', 'cancelled'
  winner_id UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  resolution_method TEXT, -- 'automatic', 'manual_admin', 'dispute_resolution'
  admin_notes TEXT
);

-- Create bet escrow tracking table
CREATE TABLE public.bet_escrow (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bet_match_id UUID NOT NULL REFERENCES public.bet_matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2) NOT NULL,
  escrow_fee NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'held', -- 'held', 'released', 'disputed'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  released_at TIMESTAMP WITH TIME ZONE
);

-- Create payout throttles table
CREATE TABLE public.payout_throttles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_limit NUMERIC(10,2) NOT NULL DEFAULT 10000.00,
  weekly_limit NUMERIC(10,2) NOT NULL DEFAULT 50000.00,
  monthly_limit NUMERIC(10,2) NOT NULL DEFAULT 200000.00,
  current_daily_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  current_weekly_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  current_monthly_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  last_reset_daily TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  last_reset_weekly TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  last_reset_monthly TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(user_id)
);

-- Create transaction fees breakdown table
CREATE TABLE public.transaction_fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bet_match_id UUID REFERENCES public.bet_matches(id) ON DELETE CASCADE,
  syndicate_id UUID REFERENCES public.bookie_syndicates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'bet_creation', 'bet_resolution', 'syndicate_join', 'credit_line'
  gross_amount NUMERIC(10,2) NOT NULL,
  platform_fee_rate NUMERIC(5,4) NOT NULL DEFAULT 0.025, -- 2.5%
  platform_fee_amount NUMERIC(10,2) NOT NULL,
  escrow_fee_rate NUMERIC(5,4) NOT NULL DEFAULT 0.01, -- 1%
  escrow_fee_amount NUMERIC(10,2) NOT NULL,
  net_amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  metadata JSONB
);

-- Create admin activity log
CREATE TABLE public.admin_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'bet_resolution', 'payout_override', 'user_suspension', 'escrow_release'
  target_id UUID, -- ID of affected record
  target_type TEXT, -- 'bet', 'user', 'syndicate', 'escrow'
  description TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Enable RLS on new tables
ALTER TABLE public.bet_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bet_escrow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_throttles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bet_matches
CREATE POLICY "Users can view their own bet matches" 
  ON public.bet_matches FOR SELECT 
  USING (
    creator_bet_id IN (SELECT id FROM public.bets WHERE creator_id = auth.uid()) OR
    opponent_bet_id IN (SELECT id FROM public.bets WHERE opponent_id = auth.uid())
  );

CREATE POLICY "Admins can view all bet matches" 
  ON public.bet_matches FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND plan_type = 'admin'));

-- RLS Policies for bet_escrow
CREATE POLICY "Users can view their own escrow" 
  ON public.bet_escrow FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all escrow" 
  ON public.bet_escrow FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND plan_type = 'admin'));

-- RLS Policies for payout_throttles
CREATE POLICY "Users can view their own throttles" 
  ON public.payout_throttles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage throttles" 
  ON public.payout_throttles FOR ALL 
  USING (true);

-- RLS Policies for transaction_fees
CREATE POLICY "Users can view their own transaction fees" 
  ON public.transaction_fees FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transaction fees" 
  ON public.transaction_fees FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND plan_type = 'admin'));

-- RLS Policies for admin_activity_log
CREATE POLICY "Admins can view admin activity log" 
  ON public.admin_activity_log FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND plan_type = 'admin'));

CREATE POLICY "Admins can insert admin activity log" 
  ON public.admin_activity_log FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND plan_type = 'admin'));

-- Create function to calculate platform fees
CREATE OR REPLACE FUNCTION public.calculate_platform_fees(
  gross_amount NUMERIC,
  bet_amount NUMERIC DEFAULT NULL
) RETURNS TABLE (
  platform_fee NUMERIC,
  escrow_fee NUMERIC,
  net_amount NUMERIC
) AS $$
BEGIN
  -- Platform fee: 2.5% of gross amount
  platform_fee := ROUND(gross_amount * 0.025, 2);
  
  -- Escrow fee: 1% of bet amount (only for bets > $5000)
  IF bet_amount IS NOT NULL AND bet_amount > 5000 THEN
    escrow_fee := ROUND(bet_amount * 0.01, 2);
  ELSE
    escrow_fee := 0.00;
  END IF;
  
  -- Net amount after fees
  net_amount := gross_amount - platform_fee - escrow_fee;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check admin access
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND plan_type = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create indexes for performance
CREATE INDEX idx_bet_matches_creator_bet_id ON public.bet_matches(creator_bet_id);
CREATE INDEX idx_bet_matches_opponent_bet_id ON public.bet_matches(opponent_bet_id);
CREATE INDEX idx_bet_matches_status ON public.bet_matches(status);
CREATE INDEX idx_bet_escrow_user_id ON public.bet_escrow(user_id);
CREATE INDEX idx_bet_escrow_status ON public.bet_escrow(status);
CREATE INDEX idx_payout_throttles_user_id ON public.payout_throttles(user_id);
CREATE INDEX idx_transaction_fees_user_id ON public.transaction_fees(user_id);
CREATE INDEX idx_admin_activity_log_admin_id ON public.admin_activity_log(admin_id);
CREATE INDEX idx_admin_activity_log_created_at ON public.admin_activity_log(created_at);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_bet_matches_updated_at
  BEFORE UPDATE ON public.bet_matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payout_throttles_updated_at
  BEFORE UPDATE ON public.payout_throttles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
