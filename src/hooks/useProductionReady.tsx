
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

      // Database check - test basic connection and data fetch
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, title')
          .limit(1);
        newChecks.database = !error;
        console.log('Database check result:', !error, error?.message);
      } catch (err) {
        console.error('Database check failed:', err);
        newChecks.database = false;
      }

      // Auth check
      newChecks.auth = !!user;
      console.log('Auth check result:', !!user);

      // Storage check - verify buckets exist
      try {
        const { data, error } = await supabase.storage.listBuckets();
        const hasRequiredBuckets = data?.some(bucket => 
          bucket.name === 'event-images' || bucket.name === 'avatars'
        ) || false;
        newChecks.storage = hasRequiredBuckets && !error;
        console.log('Storage check result:', hasRequiredBuckets, 'Buckets:', data?.map(b => b.name));
      } catch (err) {
        console.error('Storage check failed:', err);
        newChecks.storage = false;
      }

      // Realtime check - test connection
      try {
        const channel = supabase.channel('production-test');
        let realtimeWorking = false;
        
        await new Promise((resolve) => {
          const timeout = setTimeout(() => {
            resolve(false);
          }, 3000);
          
          channel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              realtimeWorking = true;
              clearTimeout(timeout);
              resolve(true);
            }
          });
        });
        
        newChecks.realtime = realtimeWorking;
        console.log('Realtime check result:', realtimeWorking);
        supabase.removeChannel(channel);
      } catch (err) {
        console.error('Realtime check failed:', err);
        newChecks.realtime = false;
      }

      setChecks(newChecks);
      setIsReady(Object.values(newChecks).every(Boolean));
    };

    runChecks();
  }, [user]);

  return { isReady, checks };
};
