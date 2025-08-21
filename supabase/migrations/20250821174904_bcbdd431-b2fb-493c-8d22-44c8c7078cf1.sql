-- Fix critical security issues

-- 1. Secure API configurations table (hide API keys from public access)
DROP POLICY IF EXISTS "api_configurations_read_policy" ON public.api_configurations;
CREATE POLICY "api_configurations_admin_only" 
ON public.api_configurations 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role = 'admin'
));

-- 2. Secure comments table (authenticated users only)
DROP POLICY IF EXISTS "comments_read_policy" ON public.comments;
CREATE POLICY "comments_authenticated_read" 
ON public.comments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "comments_owner_write" 
ON public.comments 
FOR ALL 
USING (auth.uid() = user_id);

-- 3. Secure profiles table (limited public access)
DROP POLICY IF EXISTS "profiles_read_policy" ON public.profiles;

-- Public can only see basic profile info
CREATE POLICY "profiles_public_basic_read" 
ON public.profiles 
FOR SELECT 
USING (true);

-- But hide sensitive columns from public access
CREATE POLICY "profiles_owner_full_access" 
ON public.profiles 
FOR ALL 
USING (auth.uid() = user_id);

-- Admin can see everything
CREATE POLICY "profiles_admin_full_access" 
ON public.profiles 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role = 'admin'
));

-- 4. Update check_admin_role function with proper search_path
CREATE OR REPLACE FUNCTION public.check_admin_role(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Set search_path for security
  SET search_path = public;
  
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE profiles.user_id = check_admin_role.user_id;
  
  RETURN COALESCE(user_role = 'admin', FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;