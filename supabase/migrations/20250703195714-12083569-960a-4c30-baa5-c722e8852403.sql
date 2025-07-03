
-- Update email template configuration
UPDATE auth.config
SET email_template_forgot_password_otp_expiry_seconds = 1800
WHERE id = 1;

-- Fix the is_bookie_admin function with proper security settings
CREATE OR REPLACE FUNCTION public.is_bookie_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (plan_type = 'admin' OR plan_type = 'elite')
  );
$$;

-- Fix the is_bookie_operator function with proper security settings
CREATE OR REPLACE FUNCTION public.is_bookie_operator()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bookie_operators 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  );
$$;

-- Fix the log_user_event function with proper security settings
CREATE OR REPLACE FUNCTION public.log_user_event(p_user_id uuid, p_event_type text, p_event_data jsonb DEFAULT NULL::jsonb, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.user_events (user_id, event_type, event_data, ip_address, user_agent)
  VALUES (p_user_id, p_event_type, p_event_data, p_ip_address, p_user_agent)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Fix the log_bet_audit function with proper security settings
CREATE OR REPLACE FUNCTION public.log_bet_audit(p_user_id uuid, p_bet_id uuid, p_action_type text, p_amount_before numeric DEFAULT NULL::numeric, p_amount_after numeric DEFAULT NULL::numeric, p_escrow_amount numeric DEFAULT NULL::numeric, p_metadata jsonb DEFAULT NULL::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.user_bet_audit (user_id, bet_id, action_type, amount_before, amount_after, escrow_amount, metadata)
  VALUES (p_user_id, p_bet_id, p_action_type, p_amount_before, p_amount_after, p_escrow_amount, p_metadata)
  RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Fix the update_updated_at_column function with proper security settings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
