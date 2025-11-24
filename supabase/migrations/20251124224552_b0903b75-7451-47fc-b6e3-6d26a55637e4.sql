-- Fix Security: Restrict profiles table public access
-- Only allow limited profile info for authenticated users
DROP POLICY IF EXISTS "Public can view limited profile info" ON profiles;

CREATE POLICY "Authenticated users can view limited profile info"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- Fix Security: Restrict events public access  
-- Only authenticated users can view events
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;

CREATE POLICY "Authenticated users can view events"
ON events FOR SELECT
TO authenticated
USING (true);

-- Add privacy setting to profiles for attendee visibility
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS hide_attendance boolean DEFAULT false;

-- Update event_attendees policy to respect privacy
DROP POLICY IF EXISTS "Authenticated users can view attendees" ON event_attendees;

CREATE POLICY "Event attendees visible based on privacy"
ON event_attendees FOR SELECT
TO authenticated
USING (
  -- Event creator can always see attendees
  EXISTS (SELECT 1 FROM events WHERE events.id = event_attendees.event_id AND events.created_by = auth.uid())
  OR
  -- Users can see their own attendance
  event_attendees.user_id = auth.uid()
  OR
  -- Others can see if user hasn't hidden attendance
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = event_attendees.user_id AND profiles.hide_attendance = false)
);

-- Update event_likes policy for privacy
DROP POLICY IF EXISTS "Authenticated users can view likes" ON event_likes;

CREATE POLICY "Event likes visible with privacy"
ON event_likes FOR SELECT
TO authenticated
USING (
  -- Event creator can see likes
  EXISTS (SELECT 1 FROM events WHERE events.id = event_likes.event_id AND events.created_by = auth.uid())
  OR
  -- Users can see their own likes
  event_likes.user_id = auth.uid()
);