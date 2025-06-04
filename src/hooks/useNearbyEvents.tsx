
import { useState } from 'react';
import { Event } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { useToast } from '@/components/ui/use-toast';

export const useNearbyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNearbyEvents = async (lat: number, lng: number, radius: number = 5, selectedDate?: Date) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching nearby events with params:', { lat, lng, radius, selectedDate });
      
      const radiusMeters = radius * 1000; // Convert km to meters
      
      // First, let's try to get all events to debug
      const { data: allEvents, error: allEventsError } = await supabase
        .from('events')
        .select('*');
      
      console.log('All events in database:', allEvents);
      
      // Then try the RPC function
      const { data: eventsData, error } = await supabase
        .rpc('find_nearby_events', {
          lat: lat,
          lon: lng,
          radius_meters: radiusMeters,
          category_filter: null,
          max_price: null,
          accessibility_filter: null
        });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }

      console.log('Raw events data from RPC:', eventsData);

      // If RPC returns no results, fall back to all events and filter manually
      let finalEventsData = eventsData;
      if (!eventsData || eventsData.length === 0) {
        console.log('No events from RPC, falling back to manual filtering');
        finalEventsData = allEvents?.filter(event => {
          if (!event.coordinates) return false;
          // Basic distance check (simplified)
          const eventLat = typeof event.coordinates === 'object' && 'x' in event.coordinates 
            ? event.coordinates.x 
            : Array.isArray(event.coordinates) ? event.coordinates[0] : 0;
          const eventLng = typeof event.coordinates === 'object' && 'x' in event.coordinates 
            ? event.coordinates.y 
            : Array.isArray(event.coordinates) ? event.coordinates[1] : 0;
          
          // Simple distance check (within reasonable bounds)
          const latDiff = Math.abs(lat - eventLat);
          const lngDiff = Math.abs(lng - eventLng);
          return latDiff < 1 && lngDiff < 1; // Rough 100km radius
        }) || [];
      }

      console.log('Final events data to process:', finalEventsData);

      // Map the events using the proper mapper
      const formattedEvents: Event[] = (finalEventsData as any[] || []).map(event => {
        console.log('Processing event:', event);
        return mapDatabaseEventToEvent(event);
      }).filter(event => {
        // Filter out events with invalid coordinates
        const [lat, lng] = event.location.coordinates;
        const isValid = !isNaN(lat) && !isNaN(lng) && !(lat === 0 && lng === 0);
        console.log(`Event "${event.title}" coordinates [${lat}, ${lng}] valid: ${isValid}`);
        return isValid;
      });

      console.log('Final formatted events:', formattedEvents);
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      const errorMessage = 'Failed to fetch nearby events. Please try again later.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    events,
    isLoading,
    error,
    fetchNearbyEvents,
  };
};
