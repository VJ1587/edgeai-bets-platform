
-- Create wallets table for user balances
CREATE TABLE public.wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create challenges table for 1v1 betting
CREATE TABLE public.challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenger_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenged_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  bet_type TEXT NOT NULL, -- 'moneyline', 'spread', 'total'
  bet_selection TEXT NOT NULL,
  stake_amount DECIMAL(10,2) NOT NULL,
  odds INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'completed', 'cancelled'
  winner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create group_bets table for syndicate betting
CREATE TABLE public.group_bets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  game_id TEXT NOT NULL,
  bet_type TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0.00,
  max_participants INTEGER DEFAULT 10,
  status TEXT DEFAULT 'open', -- 'open', 'closed', 'completed'
  outcome TEXT, -- 'win', 'loss', 'push'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  closes_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create group_bet_participants table
CREATE TABLE public.group_bet_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_bet_id UUID REFERENCES public.group_bets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stake_amount DECIMAL(10,2) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(group_bet_id, user_id)
);

-- Create squares table for grid betting
CREATE TABLE public.squares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_title TEXT NOT NULL,
  game_date TIMESTAMP WITH TIME ZONE NOT NULL,
  price_per_square DECIMAL(10,2) NOT NULL,
  total_squares INTEGER DEFAULT 100,
  sold_squares INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open', -- 'open', 'closed', 'completed'
  winning_numbers JSONB, -- store winning combinations
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create square_purchases table
CREATE TABLE public.square_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  square_id UUID REFERENCES public.squares(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  square_number INTEGER NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(square_id, square_number)
);

-- Enable RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_bet_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.square_purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own wallet" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view challenges they're involved in" ON public.challenges
  FOR SELECT USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

CREATE POLICY "Users can create challenges" ON public.challenges
  FOR INSERT WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "Users can view all group bets" ON public.group_bets
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create group bets if they have pro/elite plan" ON public.group_bets
  FOR INSERT WITH CHECK (
    auth.uid() = creator_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND plan_type IN ('pro', 'elite')
    )
  );

CREATE POLICY "Users can view group bet participants" ON public.group_bet_participants
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can join group bets" ON public.group_bet_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all squares" ON public.squares
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view all square purchases" ON public.square_purchases
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can purchase squares" ON public.square_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);
