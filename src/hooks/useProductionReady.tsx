
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProductionChecks {
  database: boolean;
  auth: boolean;
  storage: boolean;
  realtime: boolean;
}

export const useProductionReady = () => {
  const [checks, setChecks] = useState<ProductionChecks>({
    database: false,
    auth: false,
    storage: false,
    realtime: false
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    runChecks();
  }, []);

  const runChecks = async () => {
    const newChecks: ProductionChecks = {
      database: false,
      auth: false,
      storage: false,
      realtime: false
    };

    // Database check
    try {
      const { error } = await supabase.from('events').select('count').limit(1);
      newChecks.database = !error;
    } catch {
      newChecks.database = false;
    }

    // Auth check
    try {
      const { error } = await supabase.auth.getSession();
      newChecks.auth = !error;
    } catch {
      newChecks.auth = false;
    }

    // Storage check - consistent with PipelineCheck
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error) {
        newChecks.storage = false;
      } else {
        const requiredBuckets = ['event-images', 'avatars'];
        const existingBuckets = buckets?.map(b => b.name) || [];
        const hasAllBuckets = requiredBuckets.every(name => existingBuckets.includes(name));
        newChecks.storage = hasAllBuckets;
      }
    } catch {
      newChecks.storage = false;
    }

    // Realtime check
    try {
      const channel = supabase.channel('production-ready-test');
      const realtimePromise = new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => resolve(false), 3000);
        channel.subscribe((status) => {
          clearTimeout(timeout);
          resolve(status === 'SUBSCRIBED');
        });
      });
      
      newChecks.realtime = await realtimePromise;
      supabase.removeChannel(channel);
    } catch {
      newChecks.realtime = false;
    }

    setChecks(newChecks);
    setIsReady(Object.values(newChecks).every(Boolean));
  };

  return { isReady, checks };
};
