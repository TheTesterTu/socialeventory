-- Fix all remaining functions missing search_path for production security

-- Update find_nearby_events function
CREATE OR REPLACE FUNCTION public.find_nearby_events(
    lat double precision, 
    lon double precision, 
    radius_meters double precision DEFAULT 5000, 
    category_filter text[] DEFAULT NULL::text[], 
    max_price double precision DEFAULT NULL::double precision, 
    accessibility_filter jsonb DEFAULT NULL::jsonb
)
RETURNS TABLE(
    id uuid, 
    title text, 
    location text, 
    coordinates point, 
    distance double precision, 
    category text[], 
    pricing jsonb, 
    accessibility jsonb, 
    venue_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Update can_create_events function
CREATE OR REPLACE FUNCTION public.can_create_events(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Allow all authenticated users to create events for now
  RETURN user_id IS NOT NULL;
END;
$function$;

-- Update update_saved_locations_updated_at function
CREATE OR REPLACE FUNCTION public.update_saved_locations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$function$;

-- Update update_timestamp function
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$function$;