import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TopOrganizer {
  id: string;
  name: string;
  avatar: string | null;
  events: number;
  role: string;
  type: string;
}

export const useTopOrganizers = (limit: number = 4) => {
  const [organizers, setOrganizers] = useState<TopOrganizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopOrganizers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get users with events count
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            username,
            full_name,
            avatar_url,
            role
          `)
          .not('role', 'is', null);

        if (profilesError) throw profilesError;

        if (profiles && profiles.length > 0) {
          // Get event counts for each user
          const organizersWithCounts = await Promise.all(
            profiles.map(async (profile) => {
              const { count } = await supabase
                .from('events')
                .select('*', { count: 'exact', head: true })
                .eq('created_by', profile.id);

              return {
                id: profile.id,
                name: profile.full_name || profile.username || 'Anonymous',
                avatar: profile.avatar_url,
                events: count || 0,
                role: profile.role === 'admin' ? 'Administrator' : 'Event Organizer',
                type: profile.role === 'admin' ? 'Featured' : count && count > 5 ? 'Popular' : 'Rising'
              };
            })
          );

          // Filter and sort by event count
          const filteredOrganizers = organizersWithCounts
            .filter(org => org.events > 0)
            .sort((a, b) => b.events - a.events)
            .slice(0, limit);

          setOrganizers(filteredOrganizers);
        }
      } catch (err) {
        console.error('Error fetching top organizers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch organizers');
      } finally {
        setLoading(false);
      }
    };

    fetchTopOrganizers();
  }, [limit]);

  return { organizers, loading, error };
};