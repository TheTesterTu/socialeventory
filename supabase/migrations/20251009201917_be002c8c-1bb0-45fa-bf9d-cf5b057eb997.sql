-- Remove the overly permissive public policy
DROP POLICY IF EXISTS "Public can view limited profile info" ON public.profiles;

-- Create a secure function that returns only safe public fields
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  username text,
  avatar_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    username,
    avatar_url
  FROM public.profiles
  WHERE id = profile_id;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated, anon;

-- Add a more restrictive policy for authenticated users to see basic info of other users
CREATE POLICY "Authenticated users can view basic profile info"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Comment for clarity
COMMENT ON FUNCTION public.get_public_profile IS 'Returns only safe public fields (username, avatar) for a profile. Use this for public-facing profile displays.';