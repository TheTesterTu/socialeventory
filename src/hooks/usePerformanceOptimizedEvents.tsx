
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { Event } from '@/lib/types';
import { cache } from '@/services/cache';
import { performance } from '@/utils/performance';
import { useMemo } from 'react';

interface UsePerformanceOptimizedEventsOptions {
  pageSize?: number;
  category?: string[];
  featured?: boolean;
  sortBy?: 'created_at' | 'start_date' | 'likes';
  sortOrder?: 'asc' | 'desc';
  enableInfiniteQuery?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

interface CachedData {
  events: Event[];
  count: number;
}

export const usePerformanceOptimizedEvents = (options: UsePerformanceOptimizedEventsOptions = {}) => {
  const {
    pageSize = 10,
    category,
    featured,
    sortBy = 'created_at',
    sortOrder = 'desc',
    enableInfiniteQuery = false,
    staleTime = 5 * 60 * 1000,
    cacheTime = 10 * 60 * 1000
  } = options;

  const queryKey = useMemo(() => [
    'events',
    'performance-optimized',
    { pageSize, category, featured, sortBy, sortOrder }
  ], [pageSize, category, featured, sortBy, sortOrder]);

  const cacheKey = JSON.stringify(queryKey);
  const cachedData = cache.get<CachedData>(cacheKey);

  const fetchEvents = async ({ pageParam = 0 }) => {
    performance.mark('events-fetch-start');
    
    try {
      let query = supabase
        .from('events')
        .select('*', { count: 'exact' });

      if (category && category.length > 0) {
        query = query.overlaps('category', category);
      }

      if (featured !== undefined) {
        query = query.eq('is_featured', featured);
      }

      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const from = pageParam * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      const events = data?.map(mapDatabaseEventToEvent) || [];
      
      cache.set(cacheKey, { events, count: count || 0 }, 5);

      performance.mark('events-fetch-end');
      performance.measure('events-fetch-duration', 'events-fetch-start', 'events-fetch-end');

      return {
        events,
        count: count || 0,
        nextPage: events.length === pageSize ? pageParam + 1 : undefined,
        hasNextPage: events.length === pageSize
      };
    } catch (error) {
      performance.mark('events-fetch-end');
      performance.measure('events-fetch-duration', 'events-fetch-start', 'events-fetch-end');
      throw error;
    }
  };

  const infiniteQuery = useInfiniteQuery({
    queryKey,
    queryFn: fetchEvents,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime,
    gcTime: cacheTime,
    enabled: enableInfiniteQuery,
  });

  const regularQuery = useQuery({
    queryKey,
    queryFn: () => fetchEvents({ pageParam: 0 }),
    staleTime,
    gcTime: cacheTime,
    enabled: !enableInfiniteQuery,
    placeholderData: cachedData ? { 
      events: cachedData.events, 
      count: cachedData.count,
      nextPage: undefined,
      hasNextPage: false
    } : undefined,
  });

  if (enableInfiniteQuery) {
    const allEvents = infiniteQuery.data?.pages.flatMap(page => page.events) || [];
    const totalCount = infiniteQuery.data?.pages[0]?.count || 0;

    return {
      events: allEvents,
      totalCount,
      isLoading: infiniteQuery.isLoading,
      isFetching: infiniteQuery.isFetching,
      error: infiniteQuery.error,
      fetchNextPage: infiniteQuery.fetchNextPage,
      hasNextPage: infiniteQuery.hasNextPage,
      isFetchingNextPage: infiniteQuery.isFetchingNextPage,
      refetch: infiniteQuery.refetch
    };
  }

  return {
    events: regularQuery.data?.events || [],
    totalCount: regularQuery.data?.count || 0,
    isLoading: regularQuery.isLoading,
    isFetching: regularQuery.isFetching,
    error: regularQuery.error,
    refetch: regularQuery.refetch
  };
};
