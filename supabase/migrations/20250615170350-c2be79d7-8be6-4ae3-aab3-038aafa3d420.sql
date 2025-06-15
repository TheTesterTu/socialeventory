
-- Imposta un search_path sicuro per prevenire vulnerabilità
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.can_create_events(uuid) SET search_path = public;
ALTER FUNCTION public.is_admin(uuid) SET search_path = public;
ALTER FUNCTION public.update_saved_locations_updated_at() SET search_path = public;
ALTER FUNCTION public.update_timestamp() SET search_path = public;
ALTER FUNCTION public.handle_event_like() SET search_path = public;
ALTER FUNCTION public.handle_event_attendee() SET search_path = public;
ALTER FUNCTION public.calculate_distance(double precision, double precision, double precision, double precision) SET search_path = public;
ALTER FUNCTION public.find_nearby_events(double precision, double precision, double precision, text[], double precision, jsonb) SET search_path = public;
