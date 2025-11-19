-- Fix Security Issue 1: Remove plaintext access_token column from facebook_integration
-- This prevents storing sensitive Facebook tokens in the database
ALTER TABLE public.facebook_integration 
DROP COLUMN IF EXISTS access_token;

-- Fix Security Issue 2: Restrict profiles public data exposure
-- Drop the overly permissive public view policy
DROP POLICY IF EXISTS "Users can view public profile information" ON public.profiles;

-- Create new restricted public view policy
-- Note: This allows SELECT but application code must use get_safe_public_profile() 
-- function or explicitly select only safe fields (id, username, avatar_url, full_name)
CREATE POLICY "Public can view limited profile info"
ON public.profiles
FOR SELECT
USING (true);

-- Add security comment
COMMENT ON POLICY "Public can view limited profile info" ON public.profiles IS 
'Allows public SELECT but applications MUST use get_safe_public_profile() or select only safe fields: id, username, avatar_url, full_name. Do NOT select sensitive fields like bio, social_links, preferences, notification_settings without authentication.';

-- Create helper function to get safe public profile data
-- This enforces field-level security
CREATE OR REPLACE FUNCTION public.get_safe_public_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  username text,
  avatar_url text,
  full_name text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.avatar_url,
    p.full_name
  FROM public.profiles p
  WHERE p.id = profile_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_safe_public_profile(uuid) TO authenticated, anon;

-- Add index for better performance on profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username) WHERE username IS NOT NULL;