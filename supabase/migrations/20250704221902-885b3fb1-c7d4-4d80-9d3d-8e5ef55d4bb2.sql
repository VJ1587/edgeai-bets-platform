
-- Update wallet to $500,000 balance and $500,000 escrow
UPDATE public.user_wallets 
SET 
  balance = 500000.00,
  escrow_held = 500000.00,
  daily_limit = 50000.00,
  weekly_limit = 250000.00,
  updated_at = now()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'vimj1915@gmail.com'
);

-- If no wallet exists, create one with the updated amounts
INSERT INTO public.user_wallets (user_id, balance, escrow_held, daily_limit, weekly_limit)
SELECT 
  id, 
  500000.00, 
  500000.00, 
  50000.00, 
  250000.00
FROM auth.users 
WHERE email = 'vimj1915@gmail.com'
  AND id NOT IN (SELECT user_id FROM public.user_wallets WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;
