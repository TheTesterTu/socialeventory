
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
      console.log('🔄 Fetching event stats for:', eventId);
      const { data, error } = await supabase
        .from('events')
        .select('likes, attendees')
        .eq('id', eventId)
        .single();
      
      if (error) {
        console.error('❌ Error fetching event stats:', error);
        throw error;
      }
      
      console.log('✅ Event stats:', data);
      return data;
    },
    enabled: !!eventId,
    staleTime: 1000 * 30 // 30 seconds
  });

  // Check if user has liked this event
  const { data: likeStatus } = useQuery({
    queryKey: ['event-like', eventId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      console.log('🔄 Checking like status for event:', eventId, 'user:', user.id);
      const { data, error } = await supabase
        .from('event_likes')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error checking like status:', error);
        return false;
      }
      
      const liked = !!data;
      console.log('✅ Like status:', liked);
      return liked;
    },
    enabled: !!user && !!eventId,
    staleTime: 1000 * 30 // 30 seconds
  });

  // Check if user is attending this event
  const { data: attendingStatus } = useQuery({
    queryKey: ['event-attending', eventId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      console.log('🔄 Checking attendance status for event:', eventId, 'user:', user.id);
      const { data, error } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error checking attendance status:', error);
        return false;
      }
      
      const attending = !!data;
      console.log('✅ Attendance status:', attending);
      return attending;
    },
    enabled: !!user && !!eventId,
    staleTime: 1000 * 30 // 30 seconds
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
      
      console.log('🔄 Toggling like for event:', eventId, 'current status:', isLiked);

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('event_likes')
          .delete()
          .match({ event_id: eventId, user_id: user.id });
          
        if (error) throw error;
        console.log('✅ Event unliked');
        return { liked: false };
      } else {
        // Like
        const { error } = await supabase
          .from('event_likes')
          .insert({ event_id: eventId, user_id: user.id });
          
        if (error) throw error;
        console.log('✅ Event liked');
        return { liked: true };
      }
    },
    onMutate: async () => {
      // Optimistic update
      const newLikeStatus = !isLiked;
      const newCount = newLikeStatus ? likesCount + 1 : likesCount - 1;
      
      setIsLiked(newLikeStatus);
      setLikesCount(Math.max(0, newCount));
      
      return { previousLikeStatus: isLiked, previousCount: likesCount };
    },
    onError: (error, variables, context) => {
      // Revert optimistic update
      if (context) {
        setIsLiked(context.previousLikeStatus);
        setLikesCount(context.previousCount);
      }
      console.error('❌ Like error:', error);
      toast.error('Failed to update like status');
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['event-like', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
      queryClient.invalidateQueries({ queryKey: ['unified-events'] });
    }
  });

  // Attend/Unattend mutation
  const attendMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Authentication required');
      
      console.log('🔄 Toggling attendance for event:', eventId, 'current status:', isAttending);
      
      if (isAttending) {
        // Stop attending
        const { error } = await supabase
          .from('event_attendees')
          .delete()
          .match({ event_id: eventId, user_id: user.id });
          
        if (error) throw error;
        console.log('✅ Stopped attending event');
        return { attending: false };
      } else {
        // Start attending
        const { error } = await supabase
          .from('event_attendees')
          .insert({ event_id: eventId, user_id: user.id, status: 'going' });
          
        if (error) throw error;
        console.log('✅ Now attending event');
        return { attending: true };
      }
    },
    onMutate: async () => {
      // Optimistic update
      const newAttendingStatus = !isAttending;
      const newCount = newAttendingStatus ? attendeesCount + 1 : attendeesCount - 1;
      
      setIsAttending(newAttendingStatus);
      setAttendeesCount(Math.max(0, newCount));
      
      return { previousAttendingStatus: isAttending, previousCount: attendeesCount };
    },
    onSuccess: (data) => {
      if (data.attending) {
        toast.success("You are now attending this event!");
      } else {
        toast.info("You are no longer attending this event");
      }
    },
    onError: (error, variables, context) => {
      // Revert optimistic update
      if (context) {
        setIsAttending(context.previousAttendingStatus);
        setAttendeesCount(context.previousCount);
      }
      console.error('❌ Attendance error:', error);
      toast.error('Failed to update attendance status');
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['event-attending', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
      queryClient.invalidateQueries({ queryKey: ['unified-events'] });
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
