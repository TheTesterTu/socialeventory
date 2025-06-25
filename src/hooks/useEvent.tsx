
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { Event } from '@/lib/types';

const fetchEvent = async (eventId: string): Promise<Event | null> => {
  if (!eventId) {
    console.warn('No eventId provided to fetchEvent');
    return null;
  }

  console.log('Fetching event with ID:', eventId);

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      console.error(`Error fetching event ${eventId}:`, error);
      throw new Error(`Failed to fetch event: ${error.message}`);
    }

    if (!data) {
      console.warn(`No event found with ID: ${eventId}`);
      return null;
    }

    console.log('Raw event data from database:', data);
    
    // Map the database event to our Event interface with proper validation
    const mappedEvent = mapDatabaseEventToEvent(data);
    console.log('Mapped event:', mappedEvent);
    
    return mappedEvent;
  } catch (error) {
    console.error('Error in fetchEvent:', error);
    throw error;
  }
};

export const useEvent = (eventId: string) => {
  return useQuery<Event | null, Error>({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId),
    enabled: !!eventId, // Only run query if eventId is available and truthy
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a "not found" error
      if (error.message.includes('Failed to fetch event')) {
        return failureCount < 2;
      }
      return false;
    },
    retryDelay: 1000,
  });
};
