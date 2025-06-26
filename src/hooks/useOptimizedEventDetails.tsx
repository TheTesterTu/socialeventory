
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { Event } from '@/lib/types';
import { performance } from '@/utils/performance';

export const useOptimizedEventDetails = (eventId: string) => {
  const queryKey = useMemo(() => ['event-details', eventId], [eventId]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      performance.mark('event-details-fetch-start');
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            profiles!events_created_by_fkey(username, full_name, avatar_url)
          `)
          .eq('id', eventId)
          .single();

        if (error) throw error;
        if (!data) return null;

        const mappedEvent = mapDatabaseEventToEvent(data);
        
        performance.mark('event-details-fetch-end');
        performance.measure('event-details-fetch', 'event-details-fetch-start', 'event-details-fetch-end');
        
        return mappedEvent;
      } catch (error) {
        performance.mark('event-details-fetch-end');
        performance.measure('event-details-fetch', 'event-details-fetch-start', 'event-details-fetch-end');
        throw error;
      }
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};
