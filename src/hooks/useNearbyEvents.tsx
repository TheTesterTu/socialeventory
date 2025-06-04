
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
      
      const radiusMeters = radius * 1000; // Convert km to meters
      
      const { data: eventsData, error } = await supabase
        .rpc('find_nearby_events', {
          lat: lat,
          lon: lng,
          radius_meters: radiusMeters,
          category_filter: null,
          max_price: null,
          accessibility_filter: null
        });

      if (error) throw error;

      console.log('Raw events data from RPC:', eventsData);

      // Use the mapDatabaseEventToEvent utility to properly format the data
      const formattedEvents: Event[] = (eventsData as any[] || []).map(event => {
        console.log('Processing event:', event);
        
        // Create a proper database event object structure
        const dbEvent = {
          id: event.id,
          title: event.title,
          description: event.description || '',
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
          location: event.location || 'No address provided',
          venue_name: event.venue_name || '',
          coordinates: event.coordinates,
          category: event.category || [],
          tags: event.tags || [],
          accessibility: event.accessibility,
          pricing: event.pricing,
          created_by: '',
          verification_status: 'pending',
          image_url: '',
          likes: 0,
          attendees: 0
        };
        
        return mapDatabaseEventToEvent(dbEvent);
      }).filter(event => {
        // Filter out events with invalid coordinates
        const [lat, lng] = event.location.coordinates;
        return !isNaN(lat) && !isNaN(lng) && !(lat === 0 && lng === 0);
      });

      console.log('Formatted events:', formattedEvents);
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
