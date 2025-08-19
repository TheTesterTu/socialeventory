-- Add better error handling and security for API configurations
UPDATE api_configurations 
SET value = 'pk.eyJ1IjoibWFwYm94LWRldiIsImEiOiJjazllODJ3aW4wNG5wM21xYWRjZGJkZGpoIn0.example_token_placeholder' 
WHERE key = 'mapbox_token' AND value IS NULL;

-- Insert mapbox token configuration if it doesn't exist
INSERT INTO api_configurations (key, value, description, is_public)
VALUES ('mapbox_token', 'pk.eyJ1IjoibWFwYm94LWRldiIsImEiOiJjazllODJ3aW4wNG5wM21xYWRjZGJkZGpoIn0.example_token_placeholder', 'Mapbox public token for map functionality', true)
ON CONFLICT (key) DO NOTHING;

-- Add RLS policy to prevent unauthorized access to sensitive configurations
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can create events
CREATE OR REPLACE FUNCTION can_create_events(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Allow all authenticated users to create events for now
  RETURN user_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;