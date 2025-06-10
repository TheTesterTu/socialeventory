
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { mapDatabaseEventToEvent } from "@/lib/utils/mappers";
import { addDays, formatISO } from 'date-fns'; // For date calculations

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(mapDatabaseEventToEvent) || [];
    },
  });
};

export const useFeaturedEvents = () => {
  return useQuery({
    queryKey: ['events', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      
      return data?.map(mapDatabaseEventToEvent) || [];
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (eventData: Partial<Event>) => {
      if (!user) throw new Error("Must be logged in to create events");

      // Map the Event interface fields to database column names with proper type casting
      const dbEventData = {
        title: eventData.title,
        description: eventData.description,
        location: eventData.location?.address,
        venue_name: eventData.location?.venue_name,
        start_date: eventData.startDate,
        end_date: eventData.endDate,
        category: eventData.category,
        tags: eventData.tags,
        image_url: eventData.imageUrl,
        created_by: user.id,
        coordinates: eventData.location?.coordinates ? 
          `(${eventData.location.coordinates[0]}, ${eventData.location.coordinates[1]})` : null,
        accessibility: eventData.accessibility as any, // Cast to Json type
        pricing: eventData.pricing as any, // Cast to Json type
        verification_status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('events')
        .insert(dbEventData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Event created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create event: " + error.message);
    },
  });
};

export const useEventInteraction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const likeEvent = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error("Must be logged in");

      const { data: existing } = await supabase
        .from('event_likes')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('event_likes')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return 'unliked';
      } else {
        const { error } = await supabase
          .from('event_likes')
          .insert({ event_id: eventId, user_id: user.id });
        if (error) throw error;
        return 'liked';
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const attendEvent = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error("Must be logged in");

      const { data: existing } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('event_attendees')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return 'left';
      } else {
        const { error } = await supabase
          .from('event_attendees')
          .insert({ event_id: eventId, user_id: user.id });
        if (error) throw error;
        return 'joined';
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return { likeEvent, attendEvent };
};

export const useUpcomingEvents = (daysAhead: number = 7, limit: number = 4) => {
  return useQuery<Event[], Error>({
    queryKey: ['events', 'upcoming', daysAhead, limit],
    queryFn: async () => {
      const now = new Date();
      const futureDate = addDays(now, daysAhead);

      // Format dates for Supabase query. Using formatISO for ISO 8601 string.
      const startDateFilter = formatISO(now);
      const endDateFilter = formatISO(futureDate);

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', startDateFilter) // Greater than or equal to now
        .lte('start_date', endDateFilter)   // Less than or equal to futureDate
        .order('start_date', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching upcoming events:', error);
        throw error;
      }

      return data?.map(mapDatabaseEventToEvent) || [];
    },
    // staleTime: 1000 * 60 * 5, // Optional: 5 minutes stale time
  });
};

export const usePersonalizedEvents = (limit: number = 2) => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery<Event[], Error>({
    queryKey: ['events', 'personalized', userId, limit],
    queryFn: async () => {
      // Fetch user preferences if userId is available
      if (userId) {
        let preferredCategories: string[] = [];
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('preferences')
            .eq('id', userId)
            .single();

          if (profileError) {
            // Log error but don't throw, fallback to general events instead
            console.error('Error fetching user profile for personalized events:', profileError);
          }

          if (profileData?.preferences &&
              typeof profileData.preferences === 'object' &&
              profileData.preferences !== null &&
              Array.isArray((profileData.preferences as any).categories)) {
            preferredCategories = (profileData.preferences as any).categories;
          }
        } catch (e) {
           // Catch any other error during preference fetching
           console.error('Exception fetching user preferences:', e);
        }


        if (preferredCategories.length > 0) {
          console.log(`Fetching personalized events for user ${userId} based on categories: ${preferredCategories.join(', ')}`);
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .overlaps('category', preferredCategories)
             // Show upcoming events from preferred categories first
            .order('start_date', { ascending: true })
            // Fallback to recent if no upcoming preferred
            .order('created_at', { ascending: false })
            .limit(limit);

          if (error) {
            console.error('Error fetching events based on preferred categories:', error);
            // Fall through to general fallback if personalized fetch fails
          } else if (data && data.length > 0) {
            return data.map(mapDatabaseEventToEvent);
          }
        }
      }

      // Fallback: No user, no preferences, or error in fetching preferred events
      // Fetch general popular or recent events
      console.log('Fetching fallback general events for personalized section.');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('likes', { ascending: false, nullsFirst: false }) // Popular first
        .order('created_at', { ascending: false }) // Then recent
        .limit(limit);

      if (error) {
        console.error('Error fetching fallback general events:', error);
        throw error; // If fallback also fails, then throw
      }
      return data?.map(mapDatabaseEventToEvent) || [];
    },
    enabled: true, // Query is always enabled; logic within queryFn handles user/no-user cases.
    // staleTime: 1000 * 60 * 15, // Personalized data might not change extremely frequently
  });
};
