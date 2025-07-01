
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'elite')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create picks table for AI betting picks
CREATE TABLE public.picks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  explanation TEXT NOT NULL,
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  bet_type TEXT NOT NULL,
  sport TEXT NOT NULL,
  odds TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_picks table to track which picks users have access to
CREATE TABLE public.user_picks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  pick_id UUID REFERENCES public.picks NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pick_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_picks ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create policies for picks (public read for all picks)
CREATE POLICY "Anyone can view picks" 
  ON public.picks 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create policies for user_picks
CREATE POLICY "Users can view their own pick access" 
  ON public.user_picks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pick access" 
  ON public.user_picks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample picks
INSERT INTO public.picks (title, explanation, confidence, bet_type, sport, odds, is_premium) VALUES
('Lakers vs Warriors - Lakers +5.5', 'Strong defensive matchup favors Lakers covering the spread. LeBron historically performs well against Warriors.', 87, 'Spread', 'NBA', '+110', false),
('Chiefs vs Bills Over 52.5', 'High-powered offenses with weak secondaries. Weather conditions favor passing game.', 73, 'Total', 'NFL', '-105', true),
('3-Team Parlay Special', 'Carefully selected combination of safe bets with high payout potential.', 65, 'Parlay', 'Multi', '+485', true),
('Cowboys -3.5 vs Eagles', 'Home field advantage and key injury to Eagles secondary makes this a strong play.', 79, 'Spread', 'NFL', '-110', true),
('Warriors vs Celtics Under 220.5', 'Both teams playing back-to-back games with tired legs. Expect slower pace.', 82, 'Total', 'NBA', '+105', false);
