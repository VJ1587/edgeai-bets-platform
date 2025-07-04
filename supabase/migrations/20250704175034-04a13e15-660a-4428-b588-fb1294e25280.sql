
-- Create enum for bookie operator tiers
CREATE TYPE bookie_tier_type AS ENUM ('starter', 'pro', 'elite', 'institutional');

-- Create enum for bookie status
CREATE TYPE bookie_status AS ENUM ('pending', 'active', 'suspended', 'cancelled');

-- Create bookie operators table
CREATE TABLE public.bookie_operators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  tier bookie_tier_type NOT NULL DEFAULT 'starter',
  status bookie_status NOT NULL DEFAULT 'pending',
  monthly_fee NUMERIC NOT NULL,
  kyc_verified BOOLEAN NOT NULL DEFAULT false,
  kyc_verified_at TIMESTAMP WITH TIME ZONE,
  liquidity_validated BOOLEAN NOT NULL DEFAULT false,
  liquidity_validated_at TIMESTAMP WITH TIME ZONE,
  bank_account_verified BOOLEAN NOT NULL DEFAULT false,
  crypto_escrow_verified BOOLEAN NOT NULL DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Create bookie lines table for operator-hosted events
CREATE TABLE public.bookie_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bookie_id UUID NOT NULL REFERENCES public.bookie_operators(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  sport_key TEXT NOT NULL,
  match_name TEXT NOT NULL,
  market_type TEXT NOT NULL,
  selection TEXT NOT NULL,
  odds NUMERIC NOT NULL,
  stake_limit NUMERIC NOT NULL DEFAULT 1000.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_private BOOLEAN NOT NULL DEFAULT false,
  expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Create bookie syndicates table for group betting
CREATE TABLE public.bookie_syndicates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bookie_id UUID NOT NULL REFERENCES public.bookie_operators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  line_id UUID NOT NULL REFERENCES public.bookie_lines(id) ON DELETE CASCADE,
  target_amount NUMERIC NOT NULL,
  current_amount NUMERIC NOT NULL DEFAULT 0.00,
  max_participants INTEGER NOT NULL DEFAULT 50,
  min_participants INTEGER NOT NULL DEFAULT 2,
  is_private BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'open',
  closes_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Create syndicate participants table
CREATE TABLE public.bookie_syndicate_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  syndicate_id UUID NOT NULL REFERENCES public.bookie_syndicates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Create bookie transactions table for tracking
CREATE TABLE public.bookie_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bookie_id UUID NOT NULL REFERENCES public.bookie_operators(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL,
  gross_amount NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL DEFAULT 0.00,
  escrow_fee NUMERIC NOT NULL DEFAULT 0.00,
  net_amount NUMERIC NOT NULL,
  bet_id UUID,
  syndicate_id UUID REFERENCES public.bookie_syndicates(id),
  metadata JSONB,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Create bookie payouts table
CREATE TABLE public.bookie_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bookie_id UUID NOT NULL REFERENCES public.bookie_operators(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bet_id UUID,
  syndicate_id UUID REFERENCES public.bookie_syndicates(id),
  gross_win NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL,
  escrow_fee NUMERIC NOT NULL,
  vig_amount NUMERIC NOT NULL,
  net_payout NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  hold_reason TEXT,
  hold_until TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Create bookie credit lines table for margin trading
CREATE TABLE public.bookie_credit_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bookie_id UUID NOT NULL REFERENCES public.bookie_operators(id) ON DELETE CASCADE,
  credit_limit NUMERIC NOT NULL,
  available_credit NUMERIC NOT NULL,
  collateral_type TEXT NOT NULL,
  collateral_amount NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL DEFAULT 0.05,
  risk_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  next_review_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Create bookie audit log table
CREATE TABLE public.bookie_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bookie_id UUID NOT NULL REFERENCES public.bookie_operators(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_id UUID,
  old_values JSONB,
  new_values JSONB,
  reason TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Add RLS policies for bookie operators
ALTER TABLE public.bookie_operators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own bookie profile" ON public.bookie_operators
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own bookie profile" ON public.bookie_operators
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Bookie operators can update their own profile" ON public.bookie_operators
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookie operators" ON public.bookie_operators
  FOR SELECT USING (is_bookie_admin());

CREATE POLICY "Admins can update bookie operators" ON public.bookie_operators
  FOR UPDATE USING (is_bookie_admin());

-- Add RLS policies for bookie lines
ALTER TABLE public.bookie_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookie operators can create lines" ON public.bookie_lines
  FOR INSERT WITH CHECK (
    bookie_id IN (
      SELECT id FROM public.bookie_operators 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Bookie operators can view their own lines" ON public.bookie_lines
  FOR SELECT USING (
    bookie_id IN (
      SELECT id FROM public.bookie_operators 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Bookie operators can update their own lines" ON public.bookie_lines
  FOR UPDATE USING (
    bookie_id IN (
      SELECT id FROM public.bookie_operators 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view active public lines" ON public.bookie_lines
  FOR SELECT USING (is_active = true AND is_private = false);

CREATE POLICY "Admins can manage all lines" ON public.bookie_lines
  FOR ALL USING (is_bookie_admin());

-- Add RLS policies for bookie syndicates
ALTER TABLE public.bookie_syndicates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookie operators can create syndicates" ON public.bookie_syndicates
  FOR INSERT WITH CHECK (
    bookie_id IN (
      SELECT id FROM public.bookie_operators 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Bookie operators can view their own syndicates" ON public.bookie_syndicates
  FOR SELECT USING (
    bookie_id IN (
      SELECT id FROM public.bookie_operators 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Bookie operators can update their own syndicates" ON public.bookie_syndicates
  FOR UPDATE USING (
    bookie_id IN (
      SELECT id FROM public.bookie_operators 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view active public syndicates" ON public.bookie_syndicates
  FOR SELECT USING (status = 'open' AND is_private = false);

-- Add RLS policies for syndicate participants
ALTER TABLE public.bookie_syndicate_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can join syndicates" ON public.bookie_syndicate_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own participation" ON public.bookie_syndicate_participants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view syndicate participants for public syndicates" ON public.bookie_syndicate_participants
  FOR SELECT USING (
    syndicate_id IN (
      SELECT id FROM public.bookie_syndicates 
      WHERE is_private = false
    )
  );

-- Add RLS policies for other tables
ALTER TABLE public.bookie_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookie operators can view their own transactions" ON public.bookie_transactions
  FOR SELECT USING (
    bookie_id IN (
      SELECT id FROM public.bookie_operators 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert transactions" ON public.bookie_transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all transactions" ON public.bookie_transactions
  FOR SELECT USING (is_bookie_admin());

-- Add RLS policies for payouts
ALTER TABLE public.bookie_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payouts" ON public.bookie_payouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Bookie operators can view payouts from their syndicates" ON public.bookie_payouts
  FOR SELECT USING (
    bookie_id IN (
      SELECT id FROM public.bookie_operators 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert payouts" ON public.bookie_payouts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all payouts" ON public.bookie_payouts
  FOR ALL USING (is_bookie_admin());

-- Add RLS policies for credit lines
ALTER TABLE public.bookie_credit_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookie operators can view their own credit lines" ON public.bookie_credit_lines
  FOR SELECT USING (
    bookie_id IN (
      SELECT id FROM public.bookie_operators 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Bookie operators can apply for credit lines" ON public.bookie_credit_lines
  FOR INSERT WITH CHECK (
    bookie_id IN (
      SELECT id FROM public.bookie_operators 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all credit lines" ON public.bookie_credit_lines
  FOR ALL USING (is_bookie_admin());

-- Add RLS policies for audit log
ALTER TABLE public.bookie_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can insert audit logs" ON public.bookie_audit_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all audit logs" ON public.bookie_audit_log
  FOR SELECT USING (is_bookie_admin());

-- Create helper functions
CREATE OR REPLACE FUNCTION public.is_bookie_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (plan_type = 'admin' OR plan_type = 'elite')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_bookie_operator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bookie_operators 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  );
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_bookie_operators_updated_at
  BEFORE UPDATE ON public.bookie_operators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookie_lines_updated_at
  BEFORE UPDATE ON public.bookie_lines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookie_syndicates_updated_at
  BEFORE UPDATE ON public.bookie_syndicates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookie_credit_lines_updated_at
  BEFORE UPDATE ON public.bookie_credit_lines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
