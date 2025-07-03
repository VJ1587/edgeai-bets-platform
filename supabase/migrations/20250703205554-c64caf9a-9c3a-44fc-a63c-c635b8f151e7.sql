
-- Update wallet escrow to $100,000 and grant elite access
UPDATE public.user_wallets 
SET 
  escrow_held = 100000.00,
  updated_at = now()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'vimj1915@gmail.com'
);

-- Grant elite plan access for AI picks and bookie features
UPDATE public.profiles 
SET 
  plan_type = 'elite',
  subscription_status = 'active',
  updated_at = now()
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'vimj1915@gmail.com'
);

-- Create bookie operator profile with elite tier if it doesn't exist
INSERT INTO public.bookie_operators (
  user_id, 
  business_name, 
  tier, 
  status, 
  monthly_fee,
  kyc_verified,
  liquidity_validated,
  bank_account_verified,
  crypto_escrow_verified,
  approved_at
)
SELECT 
  id,
  'Demo Elite Bookie',
  'elite'::bookie_tier_type,
  'active'::bookie_status,
  997.00,
  true,
  true,
  true,
  true,
  now()
FROM auth.users 
WHERE email = 'vimj1915@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET
  tier = 'elite'::bookie_tier_type,
  status = 'active'::bookie_status,
  monthly_fee = 997.00,
  kyc_verified = true,
  liquidity_validated = true,
  bank_account_verified = true,
  crypto_escrow_verified = true,
  approved_at = now(),
  updated_at = now();
