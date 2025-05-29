
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { Event } from '@/lib/types';

interface UseOptimizedEventsOptions {
  limit?: number;
  category?: string[];
  featured?: boolean;
  sortBy?: 'created_at' | 'start_date' | 'likes';
  sortOrder?: 'asc' | 'desc';
}

export const useOptimizedEvents = (options: UseOptimizedEventsOptions = {}) => {
  const {
    limit = 20,
    category,
    featured,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options;

  const queryKey = useMemo(() => [
    'events',
    'optimized',
    { limit, category, featured, sortBy, sortOrder }
  ], [limit, category, featured, sortBy, sortOrder]);

  const {
    data: events = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*');

      // Apply filters
      if (category && category.length > 0) {
        query = query.overlaps('category', category);
      }

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

      if (error) throw error;
      
      return data?.map(mapDatabaseEventToEvent) || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Memoized derived data
  const eventsByCategory = useMemo(() => {
    const grouped: Record<string, Event[]> = {};
    events.forEach(event => {
      event.category.forEach(cat => {
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(event);
      });
    });
    return grouped;
  }, [events]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events.filter(event => new Date(event.startDate) > now);
  }, [events]);

  return {
    events,
    eventsByCategory,
    upcomingEvents,
    isLoading,
    error,
    refetch
  };
};
