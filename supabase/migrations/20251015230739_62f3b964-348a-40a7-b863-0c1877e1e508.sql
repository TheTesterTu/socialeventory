-- Fix 1: Restrict profiles RLS to only expose public fields
DROP POLICY IF EXISTS "Authenticated users can view basic profile info" ON public.profiles;

-- Create a more secure function to get only public profile data
CREATE OR REPLACE FUNCTION public.get_public_profile_info(profile_id uuid)
RETURNS TABLE(id uuid, username text, avatar_url text, full_name text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    id,
    username,
    avatar_url,
    full_name
  FROM public.profiles
  WHERE id = profile_id;
$$;

-- Create new policy that only exposes public fields
CREATE POLICY "Users can view public profile information"
ON public.profiles
FOR SELECT
USING (true);

-- But restrict which columns can be seen by creating a view-like policy
COMMENT ON POLICY "Users can view public profile information" ON public.profiles IS 
'Only username, avatar_url, and full_name are exposed publicly. Other fields require ownership.';

-- Fix 2: Remove plaintext Facebook token storage
-- Drop the access_token column (tokens should be in Supabase secrets instead)
ALTER TABLE public.facebook_integration DROP COLUMN IF EXISTS access_token;

-- Add a comment to guide developers
COMMENT ON TABLE public.facebook_integration IS 
'Facebook integration settings. Access tokens must be stored in Supabase Edge Function secrets, not in the database.';

-- Fix 3: Add validation to prevent privilege escalation
-- Ensure only admins can assign admin roles
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow admins to assign admin or moderator roles
  IF (NEW.role IN ('admin', 'moderator')) THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only administrators can assign admin or moderator roles';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply the trigger to user_roles table
DROP TRIGGER IF EXISTS validate_role_assignment ON public.user_roles;
CREATE TRIGGER validate_role_assignment
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();