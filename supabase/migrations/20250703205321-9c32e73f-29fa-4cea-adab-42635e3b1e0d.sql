
-- Ensure the demo user has $50,000 in their wallet
UPDATE public.user_wallets 
SET 
  balance = 50000.00,
  escrow_held = 0.00,
  daily_limit = 10000.00,
  weekly_limit = 50000.00,
  updated_at = now()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'vimj1915@gmail.com'
);

-- If no wallet exists, create one
INSERT INTO public.user_wallets (user_id, balance, escrow_held, daily_limit, weekly_limit)
SELECT 
  id, 
  50000.00, 
  0.00, 
  10000.00, 
  50000.00
FROM auth.users 
WHERE email = 'vimj1915@gmail.com'
  AND id NOT IN (SELECT user_id FROM public.user_wallets WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;
