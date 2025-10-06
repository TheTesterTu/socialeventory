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

  // Fetch event stats (likes and attendees count)
  const { data: eventStats } = useQuery({
    queryKey: ['event-stats', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('likes, attendees')
        .eq('id', eventId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

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
        .maybeSingle();
      
      if (error) return false;
      return !!data;
    },
    enabled: !!user && !!eventId,
    staleTime: 1000 * 60 * 5 // 5 minutes
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
        .maybeSingle();
      
      if (error) return false;
      return !!data;
    },
    enabled: !!user && !!eventId,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // Update local states when data changes
  useEffect(() => {
    if (eventStats) {
      setLikesCount(eventStats.likes || 0);
      setAttendeesCount(eventStats.attendees || 0);
    }
  }, [eventStats]);

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

  // Like/Unlike mutation
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
      const newLikeStatus = !isLiked;
      const newCount = newLikeStatus ? likesCount + 1 : likesCount - 1;
      
      setIsLiked(newLikeStatus);
      setLikesCount(Math.max(0, newCount));
      
      return { previousLikeStatus: isLiked, previousCount: likesCount };
    },
    onError: (error, variables, context) => {
      if (context) {
        setIsLiked(context.previousLikeStatus);
        setLikesCount(context.previousCount);
      }
      toast.error('Failed to update like status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['event-like', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
    }
  });

  // Attend/Unattend mutation
  const attendMutation = useMutation({
    mutationFn: async (currentStatus: boolean) => {
      if (!user) throw new Error('Authentication required');
      
      // Use the passed currentStatus instead of state to avoid race condition
      if (currentStatus) {
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
      const newAttendingStatus = !isAttending;
      const newCount = newAttendingStatus ? attendeesCount + 1 : attendeesCount - 1;
      
      setIsAttending(newAttendingStatus);
      setAttendeesCount(Math.max(0, newCount));
      
      return { previousAttendingStatus: isAttending, previousCount: attendeesCount };
    },
    onSuccess: (data) => {
      // The data.attending reflects the NEW status after the mutation
      if (data.attending) {
        toast.success("You are now attending this event!");
      } else {
        toast.info("You are no longer attending this event");
      }
    },
    onError: (error, variables, context) => {
      if (context) {
        setIsAttending(context.previousAttendingStatus);
        setAttendeesCount(context.previousCount);
      }
      toast.error('Failed to update attendance status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['event-attending', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
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
    // Pass current attending status to avoid race condition with optimistic update
    attendMutation.mutate(isAttending);
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