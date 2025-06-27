
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { Event } from '@/lib/types';

export const useOptimizedEventDetails = (eventId: string) => {
  const queryKey = useMemo(() => ['event-details', eventId], [eventId]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      console.log('Fetching event details for ID:', eventId);
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            profiles!events_created_by_fkey(username, full_name, avatar_url)
          `)
          .eq('id', eventId)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        if (!data) {
          console.warn('No event data found for ID:', eventId);
          return null;
        }

        console.log('Raw event data from Supabase:', data);
        
        const mappedEvent = mapDatabaseEventToEvent(data);
        console.log('Successfully mapped event:', mappedEvent);
        
        return mappedEvent;
      } catch (error) {
        console.error('Error in useOptimizedEventDetails:', error);
        throw error;
      }
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      console.log('Retry attempt:', failureCount, 'Error:', error);
      return failureCount < 2;
    },
  });
};
