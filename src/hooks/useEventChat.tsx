
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useEventChat = (eventId: string) => {
  const { user } = useAuth();
  const [participantCount, setParticipantCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    // Get initial participant count
    const fetchParticipantCount = async () => {
      const { count } = await supabase
        .from('comments')
        .select('user_id', { count: 'exact', head: true })
        .eq('event_id', eventId);
      
      setParticipantCount(count || 0);
    };

    fetchParticipantCount();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`event-${eventId}-participants`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          fetchParticipantCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const joinChat = () => {
    setIsActive(true);
  };

  const leaveChat = () => {
    setIsActive(false);
  };

  return {
    participantCount,
    isActive,
    joinChat,
    leaveChat,
    canJoin: !!user
  };
};
