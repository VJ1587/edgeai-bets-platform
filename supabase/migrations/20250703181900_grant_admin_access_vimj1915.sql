
-- Grant master/god access to vimj1915@gmail.com
UPDATE public.profiles 
SET 
  plan_type = 'elite',
  subscription_status = 'active'
WHERE email = 'vimj1915@gmail.com';

-- If the profile doesn't exist yet, let's also prepare for it
INSERT INTO public.profiles (id, email, full_name, plan_type, subscription_status, created_at, updated_at)
SELECT 
  auth.users.id,
  'vimj1915@gmail.com',
  COALESCE(auth.users.raw_user_meta_data ->> 'full_name', 'Admin User'),
  'elite',
  'active',
  now(),
  now()
FROM auth.users 
WHERE auth.users.email = 'vimj1915@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  plan_type = 'elite',
  subscription_status = 'active',
  updated_at = now();
