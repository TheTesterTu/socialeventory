-- Fix remaining functions with proper search_path settings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_saved_locations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_event_like()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events SET likes = likes + 1 WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events SET likes = likes - 1 WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_event_attendee()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events SET attendees = attendees + 1 WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events SET attendees = attendees - 1 WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_distance(lat1 double precision, lon1 double precision, lat2 double precision, lon2 double precision)
RETURNS double precision
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.find_nearby_events(lat double precision, lon double precision, radius_meters double precision DEFAULT 5000, category_filter text[] DEFAULT NULL::text[], max_price double precision DEFAULT NULL::double precision, accessibility_filter jsonb DEFAULT NULL::jsonb)
RETURNS TABLE(id uuid, title text, location text, coordinates point, distance double precision, category text[], pricing jsonb, accessibility jsonb, venue_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.location,
        e.coordinates,
        calculate_distance(lat, lon, e.coordinates[0], e.coordinates[1]) as distance,
        e.category,
        e.pricing,
        e.accessibility,
        e.venue_name
    FROM events e
    WHERE (
        category_filter IS NULL 
        OR e.category && category_filter
    )
    AND (
        max_price IS NULL 
        OR (e.pricing->>'isFree')::boolean = true 
        OR COALESCE((e.pricing->'priceRange'->1)::text::float, 0) <= max_price
    )
    AND (
        accessibility_filter IS NULL
        OR e.accessibility @> accessibility_filter
    )
    AND calculate_distance(lat, lon, e.coordinates[0], e.coordinates[1]) <= radius_meters
    ORDER BY distance;
END;
$$;