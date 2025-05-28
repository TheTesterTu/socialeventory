
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { mapDatabaseEventToEvent } from "@/lib/utils/mappers";

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
