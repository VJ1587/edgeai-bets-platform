-- Fix critical RLS policy gaps

-- Add missing INSERT policy for profiles table to allow user creation
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Add missing INSERT policy for user_wallets table
CREATE POLICY "Users can insert their own wallet" 
  ON public.user_wallets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add comprehensive RLS policies for bets table
CREATE POLICY "Users can insert their own bets" 
  ON public.bets 
  FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update bets they're involved in" 
  ON public.bets 
  FOR UPDATE 
  USING (auth.uid() = creator_id OR auth.uid() = opponent_id);

-- Add missing RLS policies for escrow_wallets
CREATE POLICY "Users can insert their own escrow" 
  ON public.escrow_wallets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own escrow" 
  ON public.escrow_wallets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own escrow" 
  ON public.escrow_wallets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Tighten group_bet_contributions policy by replacing overly permissive ALL policy
DROP POLICY IF EXISTS "group_bet_contrib_owner" ON public.group_bet_contributions;

CREATE POLICY "Users can view their own contributions" 
  ON public.group_bet_contributions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contributions" 
  ON public.group_bet_contributions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contributions" 
  ON public.group_bet_contributions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contributions" 
  ON public.group_bet_contributions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add database-level constraints for additional security
ALTER TABLE public.user_wallets ADD CONSTRAINT check_positive_balance CHECK (balance >= 0);
ALTER TABLE public.user_wallets ADD CONSTRAINT check_positive_escrow CHECK (escrow_held >= 0);
ALTER TABLE public.user_wallets ADD CONSTRAINT check_reasonable_daily_limit CHECK (daily_limit > 0 AND daily_limit <= 50000);
ALTER TABLE public.user_wallets ADD CONSTRAINT check_reasonable_weekly_limit CHECK (weekly_limit > 0 AND weekly_limit <= 200000);

ALTER TABLE public.bets ADD CONSTRAINT check_positive_amount CHECK (amount > 0);
ALTER TABLE public.bets ADD CONSTRAINT check_reasonable_vig CHECK (vig_percent >= 0 AND vig_percent <= 50);

ALTER TABLE public.group_bet_contributions ADD CONSTRAINT check_positive_contribution CHECK (amount > 0);