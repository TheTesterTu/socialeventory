
import { useQuery } from "@tanstack/react-query";
import { Event } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { useToast } from '@/components/ui/use-toast'; // Kept for potential specific notifications

interface UseNearbyEventsParams {
  latitude: number | null;
  longitude: number | null;
  radiusKm?: number;
  enabled?: boolean; // To control when the query runs
}

export const useNearbyEvents = ({
  latitude,
  longitude,
  radiusKm = 5, // Default radius to 5km
  enabled = true, // Default to true, but usually controlled by lat/lng presence
}: UseNearbyEventsParams) => {
  const { toast } = useToast();

  return useQuery<Event[], Error>({
    queryKey: ['events', 'nearby', latitude, longitude, radiusKm],
    queryFn: async () => {
      if (!latitude || !longitude) {
        // This case should ideally be prevented by the `enabled` option.
        // If it still runs, returning an empty array or throwing an error are options.
        // Throwing an error will put react-query into an error state.
        // Returning [] will result in a success state with empty data.
        // Let's return empty array as `enabled` should gate this.
        return [];
      }

      const radiusMeters = radiusKm * 1000;
      console.log(`Fetching nearby events for lat: ${latitude}, lon: ${longitude}, radius: ${radiusKm}km`);

      const { data: rpcData, error: rpcError } = await supabase.rpc('find_nearby_events', {
        lat: latitude,
        lon: longitude,
        radius_meters: radiusMeters,
        // category_filter: null, // These can be added as params to the hook if needed later
        // max_price: null,
        // accessibility_filter: null
      });

      if (rpcError) {
        console.error('RPC error in useNearbyEvents:', rpcError);
        toast({ // Example of a specific toast, though react-query handles general error state
          title: "Network Error",
          description: `Failed to fetch nearby events: ${rpcError.message}`,
          variant: "destructive",
        });
        throw rpcError; // Propagate error for react-query to handle
      }

      if (!rpcData) {
        console.log('No events data returned from RPC.');
        return []; // Return empty array if RPC returns null/undefined data
      }

      console.log('Raw events data from RPC:', rpcData.length);

      const formattedEvents: Event[] = (rpcData as any[] || [])
        .map(event => mapDatabaseEventToEvent(event)) // mapDatabaseEventToEvent should handle potential nulls from DB
        .filter(event => {
          // Filter out events with invalid or placeholder coordinates
          if (!event.location || !event.location.coordinates) return false;
          const [coordLat, coordLng] = event.location.coordinates;
          // Check for NaN, null, undefined, and (0,0) which might be a placeholder
          const isValid = typeof coordLat === 'number' && !isNaN(coordLat) &&
                          typeof coordLng === 'number' && !isNaN(coordLng) &&
                          !(coordLat === 0 && coordLng === 0);
          if (!isValid) {
            console.warn(`Filtered out event "${event.title}" due to invalid coordinates: [${coordLat}, ${coordLng}]`);
          }
          return isValid;
        });

      console.log('Formatted nearby events:', formattedEvents.length);
      return formattedEvents;
    },
    enabled: enabled && !!latitude && !!longitude, // Query only runs if explicitly enabled AND lat/lng are present
    // staleTime: 1000 * 60 * 5, // Example: 5 minutes stale time
    // cacheTime: 1000 * 60 * 10, // Example: 10 minutes cache time
    // Consider adding retry options or onError for global toast notifications if needed
  });
};
