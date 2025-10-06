import { useState } from 'react';
import { Event } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { useToast } from '@/components/ui/use-toast';
import { startOfDay, endOfDay, isBefore, isAfter } from 'date-fns';

export const useNearbyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNearbyEvents = async (
    lat: number, 
    lng: number, 
    radius: number = 5, 
    selectedDate?: Date,
    showPastEvents: boolean = false
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const radiusMeters = radius * 1000; // Convert km to meters
      const now = new Date();
      
      console.log('🗺️ [NearbyEvents] Fetching with params:', {
        lat,
        lng,
        radius,
        radiusMeters,
        selectedDate: selectedDate?.toISOString(),
        showPastEvents,
        now: now.toISOString()
      });
      
      // First, let's get all events with proper date filtering
      let query = supabase
        .from('events')
        .select('*')
        .not('coordinates', 'is', null);
      
      if (selectedDate) {
        const dayStart = startOfDay(selectedDate);
        const dayEnd = endOfDay(selectedDate);
        query = query
          .gte('start_date', dayStart.toISOString())
          .lte('start_date', dayEnd.toISOString());
      } else if (!showPastEvents) {
        // Only show events that haven't ended yet
        query = query.gte('end_date', now.toISOString());
      } else {
        // For past events, also include recent ones (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.gte('end_date', thirtyDaysAgo.toISOString());
      }
      
      const { data: allEvents, error: allEventsError } = await query;
      
      if (allEventsError) {
        console.error('[NearbyEvents] Error fetching events:', allEventsError);
        throw allEventsError;
      }

      console.log('📊 [NearbyEvents] Fetched events from DB:', allEvents?.length || 0);
      if (allEvents && allEvents.length > 0) {
        console.log('📍 Sample event coordinates:', allEvents.slice(0, 3).map(e => ({
          title: e.title,
          coordinates: e.coordinates,
          location: e.location
        })));
      }
      
      // Try the RPC function first for precise distance calculation
      const { data: rpcEvents, error: rpcError } = await supabase
        .rpc('find_nearby_events', {
          lat: lat,
          lon: lng,
          radius_meters: radiusMeters,
          category_filter: null,
          max_price: null,
          accessibility_filter: null
        });

      let finalEventsData;
      
      if (rpcError || !rpcEvents || rpcEvents.length === 0) {
        console.log('[NearbyEvents] RPC failed or empty, using manual filtering. RPC error:', rpcError?.message);
        
        // Manual distance filtering
        finalEventsData = allEvents?.filter(event => {
          if (!event.coordinates) return false;
          
          let eventLat: number;
          let eventLng: number;
          
          // PostGIS point format is (lng, lat) but we need (lat, lng) for calculations
          if (typeof event.coordinates === 'string') {
            const match = event.coordinates.match(/\(([^,]+),([^)]+)\)/);
            if (match) {
              eventLng = parseFloat(match[1]); // First value is longitude
              eventLat = parseFloat(match[2]); // Second value is latitude
            } else {
              return false;
            }
          } else if (typeof event.coordinates === 'object' && event.coordinates !== null) {
            const coords = event.coordinates as any;
            if ('x' in coords && 'y' in coords) {
              // PostGIS point: x = longitude, y = latitude
              eventLng = coords.x;
              eventLat = coords.y;
            } else if (Array.isArray(coords) && coords.length >= 2) {
              // Array format: [lng, lat]
              eventLng = coords[0];
              eventLat = coords[1];
            } else {
              return false;
            }
          } else {
            return false;
          }
          
          // Haversine distance calculation for more accurate filtering
          const R = 6371; // Earth's radius in km
          const dLat = (eventLat - lat) * Math.PI / 180;
          const dLng = (eventLng - lng) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat * Math.PI / 180) * Math.cos(eventLat * Math.PI / 180) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = R * c;
          
          return distance <= radius;
        }) || [];
        
        console.log('[NearbyEvents] Manual filtering resulted in:', finalEventsData.length, 'events');
      } else {
        console.log('[NearbyEvents] Using RPC results:', rpcEvents.length);
        
        // Use RPC results but still apply date filtering
        finalEventsData = rpcEvents.filter((event: any) => {
          if (selectedDate) {
            // Handle different possible date field names from RPC
            const startDate = event.start_date || event.startDate;
            if (!startDate) return false;
            
            const eventDate = new Date(startDate);
            const dayStart = startOfDay(selectedDate);
            const dayEnd = endOfDay(selectedDate);
            return eventDate >= dayStart && eventDate <= dayEnd;
          } else if (!showPastEvents) {
            // Handle different possible date field names from RPC
            const endDate = event.end_date || event.endDate;
            if (!endDate) return true; // Include if no end date
            
            const eventEndDate = new Date(endDate);
            return eventEndDate >= now;
          }
          return true;
        });
        
        console.log('[NearbyEvents] After date filtering:', finalEventsData.length, 'events');
      }

      // Map the events and add past/future status
      const formattedEvents: Event[] = (finalEventsData as any[] || []).map(event => {
        const mappedEvent = mapDatabaseEventToEvent(event);
        
        // Add past event indicator
        const eventEndDate = new Date(mappedEvent.endDate);
        if (isBefore(eventEndDate, now)) {
          (mappedEvent as any).isPast = true;
        }
        
        return mappedEvent;
      }).filter(event => {
        // Filter out events with invalid coordinates
        const [lat, lng] = event.location.coordinates;
        const isValid = !isNaN(lat) && !isNaN(lng) && !(lat === 0 && lng === 0);
        
        return isValid;
      });

      console.log('✅ [NearbyEvents] Final formatted events:', formattedEvents.length);
      if (formattedEvents.length > 0) {
        console.log('📍 Final events with coordinates:', formattedEvents.map(e => ({
          title: e.title,
          coords: e.location.coordinates,
          isPast: (e as any).isPast
        })));
      } else {
        console.warn('⚠️ No events passed final formatting - check coordinate validation');
      }

      setEvents(formattedEvents);
    } catch (error) {
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