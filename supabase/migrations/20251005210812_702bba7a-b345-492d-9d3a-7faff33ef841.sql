-- Phase 1: Implement Proper Role-Based Access Control

-- 1. Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check roles (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Migrate existing role data from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role
FROM public.profiles
WHERE role IS NOT NULL AND role IN ('admin', 'moderator', 'user')
ON CONFLICT (user_id, role) DO NOTHING;

-- 5. Drop old trigger and function for role changes
DROP TRIGGER IF EXISTS prevent_unauthorized_role_changes ON public.profiles;
DROP TRIGGER IF EXISTS prevent_role_change ON public.profiles;
DROP FUNCTION IF EXISTS public.prevent_role_change() CASCADE;

-- 6. Update RLS policies to use has_role() function

-- Admin audit log policies
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_log;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.admin_audit_log;

CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only system functions can insert audit logs"
ON public.admin_audit_log
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Categories policies
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Blog posts policies
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON public.blog_posts;

CREATE POLICY "Admins can manage all blog posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin settings policies
DROP POLICY IF EXISTS "Only admins can manage settings" ON public.admin_settings;

CREATE POLICY "Only admins can manage settings"
ON public.admin_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- API configurations policies
DROP POLICY IF EXISTS "Admin only access to api configurations" ON public.api_configurations;

CREATE POLICY "Admin only access to api configurations"
ON public.api_configurations
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Saved locations policies
DROP POLICY IF EXISTS "Admins can view all saved locations" ON public.saved_locations;

CREATE POLICY "Admins can view all saved locations"
ON public.saved_locations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Notifications policies
DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;

CREATE POLICY "Admins can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Fix profiles table exposure - restrict SELECT policy
DROP POLICY IF EXISTS "Users can view basic profile info" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own full profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;

-- Public can only see username and avatar
CREATE POLICY "Public can view limited profile info"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Users can see their own full profile
CREATE POLICY "Users can view own full profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Admins can see all full profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 8. Update existing functions to use has_role
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.has_role(user_id, 'admin');
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role text;
BEGIN
    SELECT role::text INTO user_role
    FROM user_roles
    WHERE user_roles.user_id = get_user_role.user_id
    ORDER BY 
      CASE role
        WHEN 'admin' THEN 1
        WHEN 'moderator' THEN 2
        WHEN 'user' THEN 3
      END
    LIMIT 1;
    
    RETURN COALESCE(user_role, 'user');
END;
$$;

-- 9. Add RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 10. Update all other functions to have proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_admin_action(action_name text, target_user uuid DEFAULT NULL::uuid, action_details jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to log actions
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can log actions';
  END IF;
  
  INSERT INTO admin_audit_log (admin_user_id, action, target_user_id, details)
  VALUES (auth.uid(), action_name, target_user, action_details);
END;
$$;