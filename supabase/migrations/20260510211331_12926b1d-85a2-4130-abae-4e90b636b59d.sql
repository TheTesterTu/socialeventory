-- Allow public (anonymous) users to view events
-- This is needed for a public event discovery platform

CREATE POLICY "Public can view events"
ON public.events
FOR SELECT
TO anon
USING (true);

-- Also allow public to view categories needed for event browsing
-- (categories already has a public policy, so this is just for confirmation)