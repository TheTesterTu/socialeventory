
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { Event } from '@/lib/types';

const fetchEvent = async (eventId: string): Promise<Event | null> => {
  if (!eventId) return null;

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error) {
    console.error(`Error fetching event ${eventId}:`, error);
    throw error;
  }

  return data ? mapDatabaseEventToEvent(data) : null;
};

export const useEvent = (eventId: string) => {
  return useQuery<Event | null, Error>({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId),
    enabled: !!eventId, // Esegui la query solo se eventId è disponibile
    staleTime: 1000 * 60 * 5, // 5 minuti
    gcTime: 1000 * 60 * 15, // 15 minuti
  });
};
