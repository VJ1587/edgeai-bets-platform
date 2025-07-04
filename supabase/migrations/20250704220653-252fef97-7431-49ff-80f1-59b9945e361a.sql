
-- Create share_links table for tracking shared bet invitations
CREATE TABLE public.share_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bet_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('duel', 'syndicate', 'gaming', 'bookie_line')),
  source_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  last_clicked_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create referral_activity table for tracking referral bonuses and stats
CREATE TABLE public.referral_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bet_id TEXT NOT NULL,
  share_link_id UUID REFERENCES public.share_links(id) ON DELETE SET NULL,
  bonus_amount NUMERIC NOT NULL DEFAULT 5.00,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for share_links
CREATE POLICY "Users can create their own share links" 
  ON public.share_links 
  FOR INSERT 
  WITH CHECK (auth.uid() = source_user_id);

CREATE POLICY "Users can view their own share links" 
  ON public.share_links 
  FOR SELECT 
  USING (auth.uid() = source_user_id);

CREATE POLICY "Anyone can view share links for joining" 
  ON public.share_links 
  FOR SELECT 
  USING (expires_at > now());

CREATE POLICY "System can update share link stats" 
  ON public.share_links 
  FOR UPDATE 
  USING (true);

-- RLS Policies for referral_activity
CREATE POLICY "Users can view their own referral activity" 
  ON public.referral_activity 
  FOR SELECT 
  USING (auth.uid() = source_user_id OR auth.uid() = target_user_id);

CREATE POLICY "System can insert referral activity" 
  ON public.referral_activity 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update referral activity" 
  ON public.referral_activity 
  FOR UPDATE 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_share_links_source_user ON public.share_links(source_user_id);
CREATE INDEX idx_share_links_bet_id ON public.share_links(bet_id);
CREATE INDEX idx_referral_activity_source_user ON public.referral_activity(source_user_id);
CREATE INDEX idx_referral_activity_status ON public.referral_activity(status);
