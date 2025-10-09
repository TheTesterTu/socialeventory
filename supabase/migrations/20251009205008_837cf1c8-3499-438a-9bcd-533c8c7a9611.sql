-- Fix security issues for production readiness

-- 1. Fix the conflicting comment policies - remove the overly permissive one
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;

-- Keep only the authenticated read policy
-- The "comments_authenticated_read" policy already exists and is more secure

-- 2. Add search_path to all functions that are missing it
-- Update calculate_distance function
CREATE OR REPLACE FUNCTION public.calculate_distance(lat1 double precision, lon1 double precision, lat2 double precision, lon2 double precision)
RETURNS double precision
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    R float := 6371000; -- Earth radius in meters
    phi1 float;
    phi2 float;
    delta_phi float;
    delta_lambda float;
    a float;
    c float;
BEGIN
    -- Convert degrees to radians
    phi1 := radians(lat1);
    phi2 := radians(lat2);
    delta_phi := radians(lat2 - lat1);
    delta_lambda := radians(lon2 - lon1);

    -- Haversine formula
    a := sin(delta_phi/2) * sin(delta_phi/2) +
        cos(phi1) * cos(phi2) *
        sin(delta_lambda/2) * sin(delta_lambda/2);
    c := 2 * atan2(sqrt(a), sqrt(1-a));

    RETURN R * c; -- Distance in meters
END;
$function$;

-- 3. Create triggers to automatically update event counts
CREATE OR REPLACE FUNCTION public.handle_event_like()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events SET likes = likes + 1 WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events SET likes = GREATEST(likes - 1, 0) WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_event_attendee()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events SET attendees = attendees + 1 WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events SET attendees = GREATEST(attendees - 1, 0) WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$function$;

-- Create triggers if they don't exist
DROP TRIGGER IF EXISTS update_event_likes_count ON public.event_likes;
CREATE TRIGGER update_event_likes_count
    AFTER INSERT OR DELETE ON public.event_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_event_like();

DROP TRIGGER IF EXISTS update_event_attendees_count ON public.event_attendees;
CREATE TRIGGER update_event_attendees_count
    AFTER INSERT OR DELETE ON public.event_attendees
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_event_attendee();

-- 4. Add encryption recommendation comment for facebook_integration
COMMENT ON COLUMN public.facebook_integration.access_token IS 'SECURITY: Consider encrypting this field at application layer before storage. Implement token rotation and expiration monitoring.';