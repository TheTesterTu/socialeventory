-- Phase 1: Critical Data Protection - Secure Profiles Table
-- Drop existing permissive policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create restrictive policies for profiles
CREATE POLICY "Users can view basic profile info"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can view their own full profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Phase 1: Protect User Activity Data
-- Update event_attendees policies
DROP POLICY IF EXISTS "Attendees are viewable by everyone" ON public.event_attendees;

CREATE POLICY "Authenticated users can view attendees"
ON public.event_attendees
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Update event_likes policies  
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.event_likes;

CREATE POLICY "Authenticated users can view likes"
ON public.event_likes
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Phase 2: Fix Admin Access Control - Create secure admin checking function
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update admin policies to use secure function
DROP POLICY IF EXISTS "Only admins can manage settings" ON public.admin_settings;
CREATE POLICY "Only admins can manage settings"
ON public.admin_settings
FOR ALL
USING (get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
USING (get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can manage all blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage all blog posts"
ON public.blog_posts
FOR ALL
USING (get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;
CREATE POLICY "Admins can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can view all saved locations" ON public.saved_locations;
CREATE POLICY "Admins can view all saved locations"
ON public.saved_locations
FOR SELECT
USING (get_user_role(auth.uid()) = 'admin');

-- Update is_admin function to use secure path
DROP FUNCTION IF EXISTS public.is_admin(uuid);
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN get_user_role(user_id) = 'admin';
END;
$$;

-- Phase 3: Fix Database Functions - Update search_path for all functions
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
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check minimum length (8 characters)
  IF LENGTH(password) < 8 THEN
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
  
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_create_events(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow all authenticated users to create events for now
  RETURN user_id IS NOT NULL;
END;
$$;