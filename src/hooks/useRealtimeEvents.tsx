
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
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['events'] });
          queryClient.invalidateQueries({ queryKey: ['nearby-events'] });
          
          // Show notification for new events
          toast.success('Nuovo evento aggiunto!', {
            description: newEvent.title,
            action: {
              label: 'Visualizza',
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
          // Invalidate specific event queries
          queryClient.invalidateQueries({ 
            queryKey: ['event', payload.new.id] 
          });
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
          // Remove from cache
          queryClient.removeQueries({ 
            queryKey: ['event', payload.old.id] 
          });
          queryClient.invalidateQueries({ queryKey: ['events'] });
          
          toast.info('Un evento è stato rimosso');
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
