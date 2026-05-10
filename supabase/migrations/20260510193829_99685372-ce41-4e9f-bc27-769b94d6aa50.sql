
-- Restore column-level grants (we'll enforce privacy purely via RLS now)
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT (id, username, full_name, avatar_url, created_at) ON public.profiles TO anon;

-- Drop the permissive "view all" policy added previously
DROP POLICY IF EXISTS "Authenticated users can read basic profile fields via view" ON public.profiles;

-- Owner and admin policies remain in place:
--   "Users can view own full profile"
--   "Admins can view all profiles"

-- Make sure the public view stays accessible
GRANT SELECT ON public.public_profiles TO authenticated, anon;
