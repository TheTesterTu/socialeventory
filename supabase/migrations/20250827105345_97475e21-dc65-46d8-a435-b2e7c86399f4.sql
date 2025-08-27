-- CRITICAL SECURITY FIXES (Fixed Version)
-- Phase 1: Fix API Configuration Security

-- Remove existing policies for api_configurations
DROP POLICY IF EXISTS "Public configurations are viewable by everyone" ON public.api_configurations;
DROP POLICY IF EXISTS "Admins can view all configurations" ON public.api_configurations;
DROP POLICY IF EXISTS "api_configurations_admin_only" ON public.api_configurations;

-- Create new secure policy for API configurations (admin only)
CREATE POLICY "Admin only access to api configurations"
ON public.api_configurations
FOR ALL
TO authenticated
USING (get_user_role(auth.uid()) = 'admin')
WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- Phase 2: Fix Admin Role Protection
-- Remove existing profile update policies
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_owner_update" ON public.profiles;

-- Create secure profile update policy that allows updates but prevents role changes
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Create a trigger function to prevent unauthorized role changes
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Allow role changes only if user is admin
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF get_user_role(auth.uid()) != 'admin' THEN
      RAISE EXCEPTION 'Only administrators can change user roles';
    END IF;
    
    -- Prevent last admin from removing their own admin role
    IF NEW.id = auth.uid() AND NEW.role != 'admin' AND OLD.role = 'admin' THEN
      IF (SELECT COUNT(*) FROM profiles WHERE role = 'admin' AND id != NEW.id) = 0 THEN
        RAISE EXCEPTION 'Cannot remove admin role from last administrator';
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce role change restrictions
DROP TRIGGER IF EXISTS prevent_unauthorized_role_changes ON public.profiles;
CREATE TRIGGER prevent_unauthorized_role_changes
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_change();

-- Phase 3: Enhance Password Security
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check minimum length (8 characters)
  IF LENGTH(password) < 8 THEN
    RETURN false;
  END IF;
  
  -- Check maximum length to prevent DoS
  IF LENGTH(password) > 128 THEN
    RETURN false;
  END IF;
  
  -- Check for at least one uppercase letter
  IF password !~ '[A-Z]' THEN
    RETURN false;
  END IF;
  
  -- Check for at least one lowercase letter  
  IF password !~ '[a-z]' THEN
    RETURN false;
  END IF;
  
  -- Check for at least one number
  IF password !~ '[0-9]' THEN
    RETURN false;
  END IF;
  
  -- Check for at least one special character
  IF password !~ '[^a-zA-Z0-9]' THEN
    RETURN false;
  END IF;
  
  -- Prevent common patterns
  IF password ~* '(password|123456|qwerty|admin)' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Phase 4: Create Admin Audit Log
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  action text NOT NULL,
  target_user_id uuid,
  details jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_log
FOR SELECT
TO authenticated
USING (get_user_role(auth.uid()) = 'admin');

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.admin_audit_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_name text,
  target_user uuid DEFAULT NULL,
  action_details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO admin_audit_log (admin_user_id, action, target_user_id, details)
  VALUES (auth.uid(), action_name, target_user, action_details);
END;
$$;