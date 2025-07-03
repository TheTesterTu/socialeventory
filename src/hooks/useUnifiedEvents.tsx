
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { Event } from '@/lib/types';

interface UseUnifiedEventsParams {
  searchQuery?: string;
  category?: string[];
  featured?: boolean;
  limit?: number;
  sortBy?: 'created_at' | 'start_date' | 'likes';
  sortOrder?: 'asc' | 'desc';
}

export const useUnifiedEvents = ({
  searchQuery,
  category,
  featured = false,
  limit,
  sortBy = 'start_date',
  sortOrder = 'desc'
}: UseUnifiedEventsParams = {}) => {
  return useQuery({
    queryKey: ['unified-events', { searchQuery, category, featured, limit, sortBy, sortOrder }],
    queryFn: async (): Promise<Event[]> => {
      console.log('🔄 Fetching unified events with params:', { searchQuery, category, featured, limit, sortBy, sortOrder });
      
      try {
        let query = supabase
          .from('events')
          .select('*');

        // Apply featured filter
        if (featured) {
          query = query.eq('is_featured', true);
        }

        // Apply category filter
        if (category && category.length > 0) {
          query = query.overlaps('category', category);
        }

        // Apply search filter
        if (searchQuery && searchQuery.trim()) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
        }

        // Apply sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Apply limit
        if (limit) {
          query = query.limit(limit);
        }

        console.log('🔍 Executing Supabase query...');
        const { data, error } = await query;

        if (error) {
          console.error('❌ Supabase query error:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log('⚠️ No events found in database');
          return [];
        }

        console.log(`✅ Found ${data.length} events from database:`, data);
        
        // Map database events to Event interface
        const mappedEvents = data.map((dbEvent, index) => {
          try {
            console.log(`🔄 Mapping event ${index + 1}:`, dbEvent);
            return mapDatabaseEventToEvent(dbEvent);
          } catch (mappingError) {
            console.error(`❌ Error mapping event ${dbEvent.id}:`, mappingError);
            // Return a safe fallback event
            return {
              id: dbEvent.id || `fallback-${index}`,
              title: dbEvent.title || 'Untitled Event',
              description: dbEvent.description || 'No description available',
              startDate: dbEvent.start_date || new Date().toISOString(),
              endDate: dbEvent.end_date || new Date().toISOString(),
              location: {
                coordinates: [37.7749, -122.4194] as [number, number],
                address: dbEvent.location || 'Location not specified',
                venue_name: dbEvent.venue_name || ''
              },
              category: Array.isArray(dbEvent.category) ? dbEvent.category : ['Other'],
              tags: Array.isArray(dbEvent.tags) ? dbEvent.tags : [],
              accessibility: {
                languages: ['en'],
                wheelchairAccessible: false,
                familyFriendly: true
              },
              pricing: {
                isFree: true,
                currency: 'USD'
              },
              creator: {
                id: dbEvent.created_by || 'unknown',
                type: 'user' as const
              },
              verification: {
                status: 'pending' as const
              },
              imageUrl: dbEvent.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
              likes: dbEvent.likes || 0,
              attendees: dbEvent.attendees || 0
            };
          }
        });
        
        console.log('✅ Successfully mapped events:', mappedEvents.length);
        return mappedEvents;
      } catch (error) {
        console.error('❌ Error in useUnifiedEvents:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error) => {
      console.log('🔄 Retry attempt:', failureCount, 'Error:', error);
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  });
};
