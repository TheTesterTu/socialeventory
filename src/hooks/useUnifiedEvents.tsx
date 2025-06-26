
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { Event } from '@/lib/types';

interface UseUnifiedEventsOptions {
  limit?: number;
  category?: string[];
  featured?: boolean;
  sortBy?: 'created_at' | 'start_date' | 'likes';
  sortOrder?: 'asc' | 'desc';
  searchQuery?: string;
}

export const useUnifiedEvents = (options: UseUnifiedEventsOptions = {}) => {
  const {
    limit,
    category,
    featured,
    sortBy = 'created_at',
    sortOrder = 'desc',
    searchQuery
  } = options;

  return useQuery({
    queryKey: ['unified-events', options],
    queryFn: async () => {
      console.log('Fetching unified events with options:', options);
      
      let query = supabase
        .from('events')
        .select('*');

      // Apply search filter if provided
      if (searchQuery && searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }

      // Apply category filter
      if (category && category.length > 0) {
        query = query.overlaps('category', category);
      }

      // Apply featured filter
      if (featured !== undefined) {
        query = query.eq('is_featured', featured);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      console.log('Raw events from database:', data);
      
      const mappedEvents = data?.map(event => {
        try {
          return mapDatabaseEventToEvent(event);
        } catch (mappingError) {
          console.error('Error mapping event:', event, mappingError);
          return null;
        }
      }).filter(Boolean) || [];

      console.log('Successfully mapped events:', mappedEvents.length);
      return mappedEvents as Event[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
