
-- Add $50,000 to the wallet for the demo user
INSERT INTO public.user_wallets (user_id, balance, escrow_held, daily_limit, weekly_limit)
SELECT 
  id, 
  50000.00, 
  0.00, 
  10000.00, 
  50000.00
FROM auth.users 
WHERE email = 'vimj1915@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  balance = 50000.00,
  daily_limit = 10000.00,
  weekly_limit = 50000.00;

-- Also ensure the user has a profile with elite plan for demo purposes
INSERT INTO public.profiles (id, email, full_name, plan_type)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data ->> 'full_name', email),
  'elite'
FROM auth.users 
WHERE email = 'vimj1915@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
  plan_type = 'elite';
