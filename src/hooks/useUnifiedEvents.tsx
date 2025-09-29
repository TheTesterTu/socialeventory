
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
    queryKey: ['unified-events-v2', { searchQuery, category, featured, limit, sortBy, sortOrder }],
    queryFn: async (): Promise<Event[]> => {
      let query = supabase
        .from('events')
        .select('*');

      // Filter out past events (older than 1 day ago) for better performance
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      query = query.gte('start_date', yesterday.toISOString());

      if (featured) {
        query = query.eq('is_featured', true);
      }

      if (category && category.length > 0) {
        query = query.overlaps('category', category);
      }

      if (searchQuery && searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }

      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data || data.length === 0) return [];
      
      return data.map(dbEvent => {
        try {
          return mapDatabaseEventToEvent(dbEvent);
        } catch {
          return {
            id: dbEvent.id || Math.random().toString(),
            title: dbEvent.title || 'Untitled Event',
            description: dbEvent.description || '',
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
            pricing: { isFree: true, currency: 'USD' },
            creator: { id: dbEvent.created_by || 'unknown', type: 'user' as const },
            verification: { status: 'pending' as const },
            imageUrl: dbEvent.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
            likes: dbEvent.likes || 0,
            attendees: dbEvent.attendees || 0
          };
        }
      });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  });
};
