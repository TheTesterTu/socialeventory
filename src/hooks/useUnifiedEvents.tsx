
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { Event } from '@/lib/types';

interface UseUnifiedEventsParams {
  searchQuery?: string;
  category?: string[];
  featured?: boolean;
  limit?: number;
}

export const useUnifiedEvents = ({
  searchQuery,
  category,
  featured = false,
  limit
}: UseUnifiedEventsParams = {}) => {
  return useQuery({
    queryKey: ['unified-events', { searchQuery, category, featured, limit }],
    queryFn: async (): Promise<Event[]> => {
      console.log('Fetching unified events with params:', { searchQuery, category, featured, limit });
      
      try {
        let query = supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        // Apply filters
        if (featured) {
          query = query.eq('is_featured', true);
        }

        if (category && category.length > 0) {
          query = query.overlaps('category', category);
        }

        if (searchQuery && searchQuery.trim()) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log('No events found in database');
          return [];
        }

        console.log(`Found ${data.length} events from database`);
        
        const mappedEvents = data.map(mapDatabaseEventToEvent);
        console.log('Successfully mapped events:', mappedEvents.length);
        
        return mappedEvents;
      } catch (error) {
        console.error('Error in useUnifiedEvents:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: (failureCount, error) => {
      console.log('Retry attempt:', failureCount, 'Error:', error);
      return failureCount < 2;
    },
  });
};
