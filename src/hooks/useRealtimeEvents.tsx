
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Event } from '@/lib/types';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';

export const useRealtimeEvents = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
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
          const newEvent = mapDatabaseEventToEvent(payload.new);
          
          // Invalidate all event-related queries
          queryClient.invalidateQueries({ queryKey: ['unified-events'] });
          queryClient.invalidateQueries({ queryKey: ['events'] });
          queryClient.invalidateQueries({ queryKey: ['nearby-events'] });
          
          // Show notification for new events
          toast.success('New event added!', {
            description: newEvent.title,
            action: {
              label: 'View',
              onClick: () => window.location.href = `/events/${newEvent.id}`
            },
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
          // Invalidate specific event queries and lists
          queryClient.invalidateQueries({ 
            queryKey: ['event-details', payload.new.id] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['event-stats', payload.new.id] 
          });
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
          // Remove from cache and invalidate lists
          queryClient.removeQueries({ 
            queryKey: ['event-details', payload.old.id] 
          });
          queryClient.removeQueries({ 
            queryKey: ['event-stats', payload.old.id] 
          });
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
          // Type assertion for payload
          const eventId = (payload.new as any)?.event_id || (payload.old as any)?.event_id;
          
          // Invalidate like-related queries
          queryClient.invalidateQueries({ 
            queryKey: ['event-stats', eventId] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['event-like'] 
          });
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
          // Type assertion for payload
          const eventId = (payload.new as any)?.event_id || (payload.old as any)?.event_id;
          
          // Invalidate attendance-related queries
          queryClient.invalidateQueries({ 
            queryKey: ['event-stats', eventId] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['event-attending'] 
          });
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
          // Type assertion for payload
          const eventId = (payload.new as any)?.event_id || (payload.old as any)?.event_id;
          
          // Invalidate comment-related queries
          queryClient.invalidateQueries({ 
            queryKey: ['comments', eventId] 
          });
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          console.log('🔴 Real-time events subscription active');
        }
      });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [queryClient]);

  return {
    isConnected
  };
};
