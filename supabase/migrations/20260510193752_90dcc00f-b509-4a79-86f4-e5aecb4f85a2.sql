
-- 1. Drop the overly permissive authenticated SELECT policy on profiles
DROP POLICY IF EXISTS "Authenticated users can view limited profile info" ON public.profiles;
DROP POLICY IF EXISTS "Public can view limited profile info" ON public.profiles;

-- Owners and admins keep their existing SELECT policies:
--   "Users can view own full profile" (auth.uid() = id)
--   "Admins can view all profiles" (has_role admin)

-- 2. Create a safe public view for cross-user profile lookups
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT
  id,
  username,
  full_name,
  avatar_url,
  created_at
FROM public.profiles;

-- We need a permissive SELECT policy on the underlying table for the view to work
-- but it only exposes safe columns through the view definition.
CREATE POLICY "Authenticated users can read basic profile fields via view"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: This still technically allows direct SELECT on profiles for authenticated users.
-- To truly enforce column restriction, revoke column-level SELECT from authenticated.
REVOKE SELECT (bio, social_links, notification_settings, preferences, role, hide_attendance, updated_at)
  ON public.profiles FROM authenticated;
REVOKE SELECT (bio, social_links, notification_settings, preferences, role, hide_attendance, updated_at)
  ON public.profiles FROM anon;

-- Grant safe columns explicitly so RLS + column grants are clear
GRANT SELECT (id, username, full_name, avatar_url, created_at)
  ON public.profiles TO authenticated, anon;

-- Owners need full column access for their own profile via a SECURITY DEFINER function
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS SETOF public.profiles
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.profiles WHERE id = auth.uid();
$$;

REVOKE EXECUTE ON FUNCTION public.get_my_profile() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_profile() TO authenticated;

-- Grant access to the safe public view
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- 3. Lock down internal SECURITY DEFINER functions from being called by clients
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_role_escalation() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_event_like() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_event_attendee() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_saved_locations_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_timestamp() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_admin_action(text, uuid, jsonb) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.validate_password_strength(text) FROM PUBLIC, anon;

-- Keep these callable by authenticated users (used by app):
-- has_role, is_admin, get_user_role, can_create_events,
-- get_public_profile, get_public_profile_info, get_safe_public_profile,
-- find_nearby_events, calculate_distance, log_admin_action (auth only)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.can_create_events(uuid) FROM anon;
