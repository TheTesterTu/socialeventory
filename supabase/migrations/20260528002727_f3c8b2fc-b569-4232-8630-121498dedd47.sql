
-- 1) Replace insecure admin delete policy on profiles
DROP POLICY IF EXISTS profiles_admin_delete ON public.profiles;
CREATE POLICY profiles_admin_delete
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) Scope event-images uploads to the user's own folder
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
CREATE POLICY "Authenticated users can upload event images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'event-images'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- 3) Allow public read of api_configurations rows flagged is_public
CREATE POLICY "Public can read public api configurations"
  ON public.api_configurations
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true);
