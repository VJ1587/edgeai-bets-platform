-- Create bookie licensing tiers enum
CREATE TYPE public.bookie_tier_type AS ENUM ('starter', 'pro', 'elite');

-- Create bookie status enum  
CREATE TYPE public.bookie_status AS ENUM ('pending', 'active', 'suspended', 'terminated');

-- Create bookie operators table
CREATE TABLE public.bookie_operators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  license_number TEXT UNIQUE,
  tier bookie_tier_type NOT NULL DEFAULT 'starter',
  status bookie_status NOT NULL DEFAULT 'pending',
  monthly_fee NUMERIC(10,2) NOT NULL,
  kyc_verified BOOLEAN NOT NULL DEFAULT false,
  kyc_verified_at TIMESTAMP WITH TIME ZONE,
  liquidity_validated BOOLEAN NOT NULL DEFAULT false,
  liquidity_validated_at TIMESTAMP WITH TIME ZONE,
  bank_account_verified BOOLEAN NOT NULL DEFAULT false,
  crypto_escrow_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id)
);

-- Create bookie lines table for custom odds
CREATE TABLE public.bookie_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bookie_id UUID NOT NULL REFERENCES public.bookie_operators(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  sport_key TEXT NOT NULL,
  match_name TEXT NOT NULL,
  market_type TEXT NOT NULL,
  selection TEXT NOT NULL,
  odds NUMERIC(8,3) NOT NULL,
  stake_limit NUMERIC(10,2) NOT NULL DEFAULT 1000.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_private BOOLEAN NOT NULL DEFAULT false,
  expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Create bookie syndicates table
CREATE TABLE public.bookie_syndicates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bookie_id UUID NOT NULL REFERENCES public.bookie_operators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  line_id UUID NOT NULL REFERENCES public.bookie_lines(id) ON DELETE CASCADE,
  target_amount NUMERIC(10,2) NOT NULL,
  current_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  max_participants INTEGER NOT NULL DEFAULT 50,
  min_participants INTEGER NOT NULL DEFAULT 2,
  is_private BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  closes_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create bookie syndicate participants table
CREATE TABLE public.bookie_syndicate_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  syndicate_id UUID NOT NULL REFERENCES public.bookie_syndicates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(syndicate_id, user_id)
);

-- Create bookie transactions table for fee tracking
CREATE TABLE public.bookie_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bookie_id UUID NOT NULL REFERENCES public.bookie_operators(id) ON DELETE CASCADE,
  bet_id UUID REFERENCES public.bets(id),
  syndicate_id UUID REFERENCES public.bookie_syndicates(id),
  transaction_type TEXT NOT NULL, -- 'platform_fee', 'escrow_fee', 'monthly_fee', 'payout'
  gross_amount NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00, -- 2.5%
  escrow_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00, -- 1% for >$5K
  net_amount NUMERIC(10,2) NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  metadata JSONB
);

-- Create bookie credit lines table
CREATE TABLE public.bookie_credit_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bookie_id UUID NOT NULL REFERENCES public.bookie_operators(id) ON DELETE CASCADE,
  credit_limit NUMERIC(12,2) NOT NULL,
  available_credit NUMERIC(12,2) NOT NULL,
  collateral_amount NUMERIC(12,2) NOT NULL,
  collateral_type TEXT NOT NULL, -- 'bank_account', 'crypto_escrow'
  interest_rate NUMERIC(5,4) NOT NULL DEFAULT 0.05, -- 5% annual
  risk_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'suspended'
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  next_review_date TIMESTAMP WITH TIME ZONE
);

-- Create bookie payouts table for detailed breakdown
CREATE TABLE public.bookie_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bookie_id UUID NOT NULL REFERENCES public.bookie_operators(id) ON DELETE CASCADE,
  bet_id UUID REFERENCES public.bets(id),
  syndicate_id UUID REFERENCES public.bookie_syndicates(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  gross_win NUMERIC(10,2) NOT NULL,
  vig_amount NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2) NOT NULL,
  escrow_fee NUMERIC(10,2) NOT NULL,
  net_payout NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'held'
  hold_reason TEXT,
  hold_until TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Create bookie audit log table
CREATE TABLE public.bookie_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bookie_id UUID NOT NULL REFERENCES public.bookie_operators(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'line_created', 'line_modified', 'payout_override', 'credit_approved'
  actor_id UUID NOT NULL REFERENCES auth.users(id),
  target_id UUID, -- ID of the affected record
  old_values JSONB,
  new_values JSONB,
  reason TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Enable RLS on all tables
ALTER TABLE public.bookie_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookie_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookie_syndicates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookie_syndicate_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookie_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookie_credit_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookie_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookie_audit_log ENABLE ROW LEVEL SECURITY;

-- Create security definer functions for admin checks
CREATE OR REPLACE FUNCTION public.is_bookie_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (plan_type = 'admin' OR plan_type = 'elite')
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_bookie_operator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bookie_operators 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for bookie_operators
CREATE POLICY "Admins can view all bookie operators" 
  ON public.bookie_operators FOR SELECT 
  USING (public.is_bookie_admin());

CREATE POLICY "Users can view their own bookie profile" 
  ON public.bookie_operators FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookie profile" 
  ON public.bookie_operators FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update bookie operators" 
  ON public.bookie_operators FOR UPDATE 
  USING (public.is_bookie_admin());

CREATE POLICY "Bookie operators can update their own profile" 
  ON public.bookie_operators FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for bookie_lines
CREATE POLICY "Anyone can view active public lines" 
  ON public.bookie_lines FOR SELECT 
  USING (is_active = true AND is_private = false);

CREATE POLICY "Bookie operators can view their own lines" 
  ON public.bookie_lines FOR SELECT 
  USING (bookie_id IN (SELECT id FROM public.bookie_operators WHERE user_id = auth.uid()));

CREATE POLICY "Bookie operators can create lines" 
  ON public.bookie_lines FOR INSERT 
  WITH CHECK (bookie_id IN (SELECT id FROM public.bookie_operators WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Bookie operators can update their own lines" 
  ON public.bookie_lines FOR UPDATE 
  USING (bookie_id IN (SELECT id FROM public.bookie_operators WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all lines" 
  ON public.bookie_lines FOR ALL 
  USING (public.is_bookie_admin());

-- RLS Policies for bookie_syndicates
CREATE POLICY "Anyone can view active public syndicates" 
  ON public.bookie_syndicates FOR SELECT 
  USING (status = 'open' AND is_private = false);

CREATE POLICY "Bookie operators can view their own syndicates" 
  ON public.bookie_syndicates FOR SELECT 
  USING (bookie_id IN (SELECT id FROM public.bookie_operators WHERE user_id = auth.uid()));

CREATE POLICY "Bookie operators can create syndicates" 
  ON public.bookie_syndicates FOR INSERT 
  WITH CHECK (bookie_id IN (SELECT id FROM public.bookie_operators WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Bookie operators can update their own syndicates" 
  ON public.bookie_syndicates FOR UPDATE 
  USING (bookie_id IN (SELECT id FROM public.bookie_operators WHERE user_id = auth.uid()));

-- RLS Policies for syndicate participants
CREATE POLICY "Users can view syndicate participants for public syndicates" 
  ON public.bookie_syndicate_participants FOR SELECT 
  USING (syndicate_id IN (SELECT id FROM public.bookie_syndicates WHERE is_private = false));

CREATE POLICY "Users can join syndicates" 
  ON public.bookie_syndicate_participants FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own participation" 
  ON public.bookie_syndicate_participants FOR SELECT 
  USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Bookie operators can view their own transactions" 
  ON public.bookie_transactions FOR SELECT 
  USING (bookie_id IN (SELECT id FROM public.bookie_operators WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all transactions" 
  ON public.bookie_transactions FOR SELECT 
  USING (public.is_bookie_admin());

CREATE POLICY "System can insert transactions" 
  ON public.bookie_transactions FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for credit lines
CREATE POLICY "Bookie operators can view their own credit lines" 
  ON public.bookie_credit_lines FOR SELECT 
  USING (bookie_id IN (SELECT id FROM public.bookie_operators WHERE user_id = auth.uid()));

CREATE POLICY "Bookie operators can apply for credit lines" 
  ON public.bookie_credit_lines FOR INSERT 
  WITH CHECK (bookie_id IN (SELECT id FROM public.bookie_operators WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all credit lines" 
  ON public.bookie_credit_lines FOR ALL 
  USING (public.is_bookie_admin());

-- RLS Policies for payouts
CREATE POLICY "Users can view their own payouts" 
  ON public.bookie_payouts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Bookie operators can view payouts from their syndicates" 
  ON public.bookie_payouts FOR SELECT 
  USING (bookie_id IN (SELECT id FROM public.bookie_operators WHERE user_id = auth.uid()));

CREATE POLICY "System can insert payouts" 
  ON public.bookie_payouts FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can manage all payouts" 
  ON public.bookie_payouts FOR ALL 
  USING (public.is_bookie_admin());

-- RLS Policies for audit log
CREATE POLICY "Admins can view all audit logs" 
  ON public.bookie_audit_log FOR SELECT 
  USING (public.is_bookie_admin());

CREATE POLICY "System can insert audit logs" 
  ON public.bookie_audit_log FOR INSERT 
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_bookie_operators_user_id ON public.bookie_operators(user_id);
CREATE INDEX idx_bookie_operators_status ON public.bookie_operators(status);
CREATE INDEX idx_bookie_lines_bookie_id ON public.bookie_lines(bookie_id);
CREATE INDEX idx_bookie_lines_active ON public.bookie_lines(is_active, is_private);
CREATE INDEX idx_bookie_syndicates_bookie_id ON public.bookie_syndicates(bookie_id);
CREATE INDEX idx_bookie_syndicates_status ON public.bookie_syndicates(status);
CREATE INDEX idx_bookie_transactions_bookie_id ON public.bookie_transactions(bookie_id);
CREATE INDEX idx_bookie_credit_lines_bookie_id ON public.bookie_credit_lines(bookie_id);
CREATE INDEX idx_bookie_payouts_user_id ON public.bookie_payouts(user_id);
CREATE INDEX idx_bookie_payouts_bookie_id ON public.bookie_payouts(bookie_id);

-- Add constraints for data integrity
ALTER TABLE public.bookie_operators ADD CONSTRAINT check_monthly_fee_positive CHECK (monthly_fee >= 0);
ALTER TABLE public.bookie_lines ADD CONSTRAINT check_odds_positive CHECK (odds > 0);
ALTER TABLE public.bookie_lines ADD CONSTRAINT check_stake_limit_positive CHECK (stake_limit > 0);
ALTER TABLE public.bookie_syndicates ADD CONSTRAINT check_target_amount_positive CHECK (target_amount > 0);
ALTER TABLE public.bookie_syndicates ADD CONSTRAINT check_current_amount_non_negative CHECK (current_amount >= 0);
ALTER TABLE public.bookie_syndicate_participants ADD CONSTRAINT check_participant_amount_positive CHECK (amount > 0);
ALTER TABLE public.bookie_credit_lines ADD CONSTRAINT check_credit_limit_positive CHECK (credit_limit > 0);
ALTER TABLE public.bookie_credit_lines ADD CONSTRAINT check_available_credit_valid CHECK (available_credit >= 0 AND available_credit <= credit_limit);
ALTER TABLE public.bookie_payouts ADD CONSTRAINT check_net_payout_non_negative CHECK (net_payout >= 0);

-- Create trigger for updated_at timestamps
CREATE TRIGGER update_bookie_operators_updated_at
  BEFORE UPDATE ON public.bookie_operators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookie_lines_updated_at
  BEFORE UPDATE ON public.bookie_lines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookie_syndicates_updated_at
  BEFORE UPDATE ON public.bookie_syndicates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookie_credit_lines_updated_at
  BEFORE UPDATE ON public.bookie_credit_lines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();