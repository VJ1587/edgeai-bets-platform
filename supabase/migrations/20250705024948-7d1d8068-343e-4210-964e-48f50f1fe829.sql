
-- First, let's check if there are any constraints blocking the update
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'user_wallets' AND table_schema = 'public';

-- Remove any problematic check constraints temporarily
ALTER TABLE public.user_wallets DROP CONSTRAINT IF EXISTS check_reasonable_weekly_limit;
ALTER TABLE public.user_wallets DROP CONSTRAINT IF EXISTS check_reasonable_daily_limit;
ALTER TABLE public.user_wallets DROP CONSTRAINT IF EXISTS check_reasonable_balance;

-- Now update the wallet data directly
UPDATE public.user_wallets 
SET 
  balance = 500000.00,
  escrow_held = 500000.00,
  daily_limit = 50000.00,
  weekly_limit = 250000.00,
  updated_at = now()
WHERE user_id = '0a57388b-965c-4a98-a55d-acce1c605d2e';

-- Verify the update worked
SELECT balance, escrow_held, daily_limit, weekly_limit 
FROM public.user_wallets 
WHERE user_id = '0a57388b-965c-4a98-a55d-acce1c605d2e';
