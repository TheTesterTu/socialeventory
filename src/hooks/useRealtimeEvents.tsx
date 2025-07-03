
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useRealtimeEvents = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('🔄 Setting up real-time events subscription...');
    
    // Subscribe to real-time events
    const channel = supabase
      .channel('events-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          console.log('✅ New event added:', payload.new);
          
          // Invalidate all event-related queries
          queryClient.invalidateQueries({ queryKey: ['unified-events'] });
          queryClient.invalidateQueries({ queryKey: ['events'] });
          
          // Show notification for new events
          toast.success('New event added!', {
            description: (payload.new as any)?.title || 'Check it out!',
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          console.log('✅ Event updated:', payload.new);
          
          const eventId = (payload.new as any)?.id;
          if (eventId) {
            // Invalidate specific event queries
            queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
            queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
          }
          
          // Invalidate general event lists
          queryClient.invalidateQueries({ queryKey: ['unified-events'] });
          queryClient.invalidateQueries({ queryKey: ['events'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          console.log('✅ Event deleted:', payload.old);
          
          const eventId = (payload.old as any)?.id;
          if (eventId) {
            // Remove from cache
            queryClient.removeQueries({ queryKey: ['event-details', eventId] });
            queryClient.removeQueries({ queryKey: ['event-stats', eventId] });
          }
          
          // Invalidate lists
          queryClient.invalidateQueries({ queryKey: ['unified-events'] });
          queryClient.invalidateQueries({ queryKey: ['events'] });
          
          toast.info('An event was removed');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_likes',
        },
        (payload) => {
          console.log('✅ Event like changed:', payload);
          
          const eventId = (payload.new as any)?.event_id || (payload.old as any)?.event_id;
          if (eventId) {
            // Invalidate like-related queries
            queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
            queryClient.invalidateQueries({ queryKey: ['event-like'] });
            queryClient.invalidateQueries({ queryKey: ['unified-events'] });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendees',
        },
        (payload) => {
          console.log('✅ Event attendance changed:', payload);
          
          const eventId = (payload.new as any)?.event_id || (payload.old as any)?.event_id;
          if (eventId) {
            // Invalidate attendance-related queries
            queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
            queryClient.invalidateQueries({ queryKey: ['event-attending'] });
            queryClient.invalidateQueries({ queryKey: ['unified-events'] });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
        },
        (payload) => {
          console.log('✅ Comment changed:', payload);
          
          const eventId = (payload.new as any)?.event_id || (payload.old as any)?.event_id;
          if (eventId) {
            // Invalidate comment-related queries
            queryClient.invalidateQueries({ queryKey: ['comments', eventId] });
          }
        }
      )
      .subscribe((status) => {
        console.log('🔄 Real-time subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time events subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription error');
        }
      });

    return () => {
      console.log('🔄 Cleaning up real-time subscription');
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [queryClient]);

  return {
    isConnected
  };
};
