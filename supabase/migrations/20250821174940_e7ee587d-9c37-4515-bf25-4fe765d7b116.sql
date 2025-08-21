-- Fix critical security issues with correct column references

-- 1. Secure API configurations table (admin only access)
ALTER TABLE public.api_configurations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "api_configurations_read_policy" ON public.api_configurations;
DROP POLICY IF EXISTS "api_configurations_admin_only" ON public.api_configurations;

CREATE POLICY "api_configurations_admin_only" 
ON public.api_configurations 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 2. Secure comments table (authenticated users only)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comments_read_policy" ON public.comments;
DROP POLICY IF EXISTS "comments_authenticated_read" ON public.comments;
DROP POLICY IF EXISTS "comments_owner_write" ON public.comments;

CREATE POLICY "comments_authenticated_read" 
ON public.comments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "comments_owner_manage" 
ON public.comments 
FOR ALL 
USING (auth.uid() = comments.user_id);

-- 3. Secure profiles table with granular access
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_read_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_basic_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_owner_full_access" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_full_access" ON public.profiles;

-- Everyone can see basic public profile info
CREATE POLICY "profiles_public_read" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Users can update their own profiles
CREATE POLICY "profiles_owner_update" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = profiles.user_id);

-- Users can insert their own profile
CREATE POLICY "profiles_owner_insert" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = profiles.user_id);

-- Only admins can delete profiles
CREATE POLICY "profiles_admin_delete" 
ON public.profiles 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_check
    WHERE admin_check.user_id = auth.uid() 
    AND admin_check.role = 'admin'
  )
);