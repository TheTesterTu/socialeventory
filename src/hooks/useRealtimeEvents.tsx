
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { devLog, errorLog } from '@/utils/productionConfig';

export const useRealtimeEvents = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    devLog('🔄 Setting up real-time events subscription...');
    
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
          devLog('✅ New event added:', payload.new);
          
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
          devLog('✅ Event updated:', payload.new);
          
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
          devLog('✅ Event deleted:', payload.old);
          
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
          devLog('✅ Event like changed:', payload);
          
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
          devLog('✅ Event attendance changed:', payload);
          
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
          devLog('✅ Comment changed:', payload);
          
          const eventId = (payload.new as any)?.event_id || (payload.old as any)?.event_id;
          if (eventId) {
            // Invalidate comment-related queries
            queryClient.invalidateQueries({ queryKey: ['comments', eventId] });
          }
        }
      )
      .subscribe((status) => {
        devLog('🔄 Real-time subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          devLog('✅ Real-time events subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          errorLog('❌ Real-time subscription error');
        }
      });

    return () => {
      devLog('🔄 Cleaning up real-time subscription');
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [queryClient]);

  return {
    isConnected
  };
};
