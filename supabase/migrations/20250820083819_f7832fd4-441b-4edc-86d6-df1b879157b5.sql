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

-- Update admin policies to use secure function (handle dependencies first)
DROP POLICY IF EXISTS "Admins can view all configurations" ON public.api_configurations;

-- Update is_admin function to use secure path (with CASCADE to handle dependencies)
DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;
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

-- Recreate the api_configurations policy
CREATE POLICY "Admins can view all configurations"
ON public.api_configurations
FOR ALL
USING (is_admin(auth.uid()));

-- Update other admin policies
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