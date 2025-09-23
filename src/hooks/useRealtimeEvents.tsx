
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { isProduction } from '@/utils/productionConfig';

export const useRealtimeEvents = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Disable real-time in production to improve performance
    if (isProduction()) {
      return;
    }
    
    const channel = supabase
      .channel('events-realtime', {
        config: {
          broadcast: { self: false },
          presence: { key: 'user' }
        }
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['unified-events'] });
          queryClient.invalidateQueries({ queryKey: ['events'] });
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
          const eventId = (payload.new as any)?.id;
          if (eventId) {
            queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
          }
          queryClient.invalidateQueries({ queryKey: ['unified-events'] });
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
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
