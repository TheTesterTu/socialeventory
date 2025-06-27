
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useProductionReady = () => {
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [checks, setChecks] = useState({
    database: false,
    auth: false,
    storage: false,
    realtime: false
  });

  useEffect(() => {
    const runChecks = async () => {
      const newChecks = { ...checks };

      // Database check
      try {
        const { data, error } = await supabase
          .from('events')
          .select('count')
          .limit(1);
        newChecks.database = !error;
      } catch {
        newChecks.database = false;
      }

      // Auth check
      newChecks.auth = !!user;

      // Storage check
      try {
        const { data } = await supabase.storage.listBuckets();
        newChecks.storage = data?.some(bucket => 
          bucket.name === 'event-images' || bucket.name === 'avatars'
        ) || false;
      } catch {
        newChecks.storage = false;
      }

      // Realtime check
      try {
        const channel = supabase.channel('test-connection');
        await new Promise((resolve) => {
          channel.subscribe((status) => {
            newChecks.realtime = status === 'SUBSCRIBED';
            resolve(true);
          });
          setTimeout(resolve, 2000);
        });
        supabase.removeChannel(channel);
      } catch {
        newChecks.realtime = false;
      }

      setChecks(newChecks);
      setIsReady(Object.values(newChecks).every(Boolean));
    };

    runChecks();
  }, [user]);

  return { isReady, checks };
};
