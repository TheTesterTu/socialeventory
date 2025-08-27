-- CRITICAL SECURITY FIXES
-- Phase 1: Fix API Configuration Security

-- First, update the api_configurations table to be more secure
-- Remove public access and add proper role-based access
DROP POLICY IF EXISTS "Public configurations are viewable by everyone" ON public.api_configurations;
DROP POLICY IF EXISTS "Admins can view all configurations" ON public.api_configurations;
DROP POLICY IF EXISTS "api_configurations_admin_only" ON public.api_configurations;

-- Create new secure policies for API configurations
CREATE POLICY "Admin only access to api configurations"
ON public.api_configurations
FOR ALL
TO authenticated
USING (get_user_role(auth.uid()) = 'admin')
WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- Phase 2: Fix Admin Role Protection
-- Remove the ability for users to change their own role
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_owner_update" ON public.profiles;

-- Create secure profile update policy that prevents role changes
CREATE POLICY "Users can update their own profile except role"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  -- Prevent users from changing their own role
  (OLD.role IS NOT DISTINCT FROM NEW.role OR get_user_role(auth.uid()) = 'admin')
);

-- Create admin-only role management function
CREATE OR REPLACE FUNCTION public.update_user_role(target_user_id uuid, new_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only admins can change roles
  IF get_user_role(auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'Only administrators can change user roles';
  END IF;
  
  -- Prevent last admin from removing their own admin role
  IF target_user_id = auth.uid() AND new_role != 'admin' THEN
    IF (SELECT COUNT(*) FROM profiles WHERE role = 'admin') <= 1 THEN
      RAISE EXCEPTION 'Cannot remove admin role from last administrator';
    END IF;
  END IF;
  
  UPDATE profiles 
  SET role = new_role, updated_at = now()
  WHERE id = target_user_id;
  
  RETURN FOUND;
END;
$$;

-- Phase 3: Enhance Password Security
-- Update password validation function to be more robust
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

-- Phase 4: Fix Database Function Security
-- Update all functions to have proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    user_role text;
BEGIN
    SELECT role INTO user_role
    FROM profiles
    WHERE id = user_id;
    
    RETURN COALESCE(user_role, 'user');
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN get_user_role(user_id) = 'admin';
END;
$$;

-- Create audit log for admin actions
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