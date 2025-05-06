
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useEventInteractions = (eventId: string) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isAttending, setIsAttending] = useState(false);
  const [attendeesCount, setAttendeesCount] = useState(0);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch initial event data
  const { data: eventData } = useQuery({
    queryKey: ['event-details', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('likes, attendees')
        .eq('id', eventId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!eventId
  });

  // Set initial counts from event data
  useEffect(() => {
    if (eventData) {
      setLikesCount(eventData.likes || 0);
      setAttendeesCount(eventData.attendees || 0);
    }
  }, [eventData]);

  // Check if user has liked this event
  const { data: likeStatus } = useQuery({
    queryKey: ['event-like', eventId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('event_likes')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking like status:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user && !!eventId,
  });

  // Check if user is attending this event
  const { data: attendingStatus } = useQuery({
    queryKey: ['event-attending', eventId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking attending status:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user && !!eventId,
  });
  
  // Update states when query results change
  useEffect(() => {
    if (likeStatus !== undefined) {
      setIsLiked(likeStatus);
    }
  }, [likeStatus]);

  useEffect(() => {
    if (attendingStatus !== undefined) {
      setIsAttending(attendingStatus);
    }
  }, [attendingStatus]);

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Authentication required');

      if (isLiked) {
        const { error } = await supabase
          .from('event_likes')
          .delete()
          .match({ event_id: eventId, user_id: user.id });
          
        if (error) throw error;
        return { liked: false };
      } else {
        const { error } = await supabase
          .from('event_likes')
          .insert({ event_id: eventId, user_id: user.id });
          
        if (error) throw error;
        return { liked: true };
      }
    },
    onMutate: async () => {
      // Optimistic update
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    },
    onError: (error) => {
      // Revert optimistic update on error
      console.error('Like error:', error);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
      toast.error('Failed to update like status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['event-like', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
    }
  });

  // Attend mutation
  const attendMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Authentication required');
      
      if (isAttending) {
        const { error } = await supabase
          .from('event_attendees')
          .delete()
          .match({ event_id: eventId, user_id: user.id });
          
        if (error) throw error;
        return { attending: false };
      } else {
        const { error } = await supabase
          .from('event_attendees')
          .insert({ event_id: eventId, user_id: user.id, status: 'going' });
          
        if (error) throw error;
        return { attending: true };
      }
    },
    onMutate: async () => {
      // Optimistic update
      setIsAttending(!isAttending);
      setAttendeesCount(prev => isAttending ? prev - 1 : prev + 1);
    },
    onSuccess: (data) => {
      if (data.attending) {
        toast.success("You are now attending this event!");
      } else {
        toast.info("You are no longer attending this event");
      }
    },
    onError: (error) => {
      // Revert optimistic update on error
      console.error('Attendance error:', error);
      setIsAttending(!isAttending);
      setAttendeesCount(prev => isAttending ? prev + 1 : prev - 1);
      toast.error('Failed to update attendance status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['event-attending', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
    }
  });

  const handleLike = () => {
    if (!user) {
      toast.error('Please sign in to like events');
      return;
    }
    
    likeMutation.mutate();
  };

  const handleAttendance = () => {
    if (!user) {
      toast.error('Please sign in to attend events');
      return;
    }
    
    attendMutation.mutate();
  };

  return {
    isLiked,
    likesCount,
    isAttending,
    attendeesCount,
    handleLike,
    handleAttendance,
    likeMutation,
    attendMutation
  };
};
