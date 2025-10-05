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

        // Get users with their roles from user_roles table
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('role', ['admin', 'moderator']);

        if (rolesError) throw rolesError;

        const userIds = userRoles?.map(r => r.user_id) || [];

        if (userIds.length === 0) {
          setOrganizers([]);
          return;
        }

        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        if (profiles && profiles.length > 0) {
          // Get event counts for each user
          const organizersWithCounts = await Promise.all(
            profiles.map(async (profile) => {
              const { count } = await supabase
                .from('events')
                .select('*', { count: 'exact', head: true })
                .eq('created_by', profile.id);

              const userRole = userRoles?.find(r => r.user_id === profile.id)?.role || 'user';

              return {
                id: profile.id,
                name: profile.full_name || profile.username || 'Anonymous',
                avatar: profile.avatar_url,
                events: count || 0,
                role: userRole === 'admin' ? 'Administrator' : 'Event Organizer',
                type: userRole === 'admin' ? 'Featured' : count && count > 5 ? 'Popular' : 'Rising'
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