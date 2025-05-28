
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/lib/types";
import { mapDatabaseEventToEvent } from "@/lib/utils/mappers";

interface SearchParams {
  query?: string;
  categories?: string[];
  location?: [number, number];
  radius?: number;
  dateRange?: [string, string];
}

export const useSearchEvents = (params: SearchParams) => {
  return useQuery({
    queryKey: ['events', 'search', params],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*');

      // Text search
      if (params.query) {
        query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%,location.ilike.%${params.query}%`);
      }

      // Category filter
      if (params.categories && params.categories.length > 0) {
        query = query.overlaps('category', params.categories);
      }

      // Date range filter
      if (params.dateRange) {
        query = query
          .gte('start_date', params.dateRange[0])
          .lte('start_date', params.dateRange[1]);
      }

      // Location-based search (if supported)
      if (params.location && params.radius) {
        // Use the find_nearby_events function for location-based search
        const { data, error } = await supabase.rpc('find_nearby_events', {
          lat: params.location[0],
          lon: params.location[1],
          radius_meters: params.radius * 1000, // Convert km to meters
          category_filter: params.categories?.length ? params.categories : null,
        });

        if (error) throw error;
        return data?.map((event: any) => mapDatabaseEventToEvent({
          ...event,
          start_date: new Date().toISOString(), // Default date
          end_date: new Date().toISOString(),
        })) || [];
      }

      query = query.order('start_date', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;
      
      return data?.map(mapDatabaseEventToEvent) || [];
    },
    enabled: !!(params.query || params.categories?.length || params.location),
  });
};
