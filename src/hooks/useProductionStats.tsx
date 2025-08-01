import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isDevelopment } from '@/utils/productionConfig';

interface AppStats {
  totalEvents: number;
  upcomingEvents: number;
  thisWeekEvents: number;
  todayEvents: number;
  liveEvents: number;
  totalUsers: number;
  activeOrganizers: number;
  loading: boolean;
}

export const useProductionStats = () => {
  const [stats, setStats] = useState<AppStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    thisWeekEvents: 0,
    todayEvents: 0,
    liveEvents: 0,
    totalUsers: 0,
    activeOrganizers: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

        // Run all queries in parallel for better performance
        const [
          totalEventsResult,
          upcomingEventsResult,
          thisWeekEventsResult,
          todayEventsResult,
          liveEventsResult,
          totalUsersResult,
          activeOrganizersResult
        ] = await Promise.all([
          // Total events
          supabase
            .from('events')
            .select('*', { count: 'exact', head: true }),

          // Upcoming events
          supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .gte('start_date', now.toISOString()),

          // Events this week (past week)
          supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .gte('start_date', weekAgo.toISOString())
            .lt('start_date', now.toISOString()),

          // Events today
          supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .gte('start_date', todayStart.toISOString())
            .lt('start_date', todayEnd.toISOString()),

          // Live events (happening right now)
          supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .lte('start_date', now.toISOString())
            .gte('end_date', now.toISOString()),

          // Total users
          supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true }),

          // Active organizers (users who created events)
          supabase
            .from('events')
            .select('created_by', { count: 'exact', head: true })
            .not('created_by', 'is', null)
        ]);

        const newStats: AppStats = {
          totalEvents: totalEventsResult.count || 0,
          upcomingEvents: upcomingEventsResult.count || 0,
          thisWeekEvents: thisWeekEventsResult.count || 0,
          todayEvents: todayEventsResult.count || 0,
          liveEvents: liveEventsResult.count || 0,
          totalUsers: totalUsersResult.count || 0,
          activeOrganizers: activeOrganizersResult.count || 0,
          loading: false
        };

        setStats(newStats);

        if (isDevelopment()) {
          console.log('📊 Production Stats:', newStats);
        }
      } catch (error) {
        console.error('Error fetching production stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();

    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return stats;
};