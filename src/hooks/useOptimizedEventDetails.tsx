
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
      
      return mapDatabaseEventToEvent(data);
    },
    enabled: !!eventId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};
