import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TopOrganizer {
  id: string;
  name: string;
  avatar: string | null;
  events: number;
  likes: number;
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

        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('created_by, likes')
          .not('created_by', 'is', null);

        if (eventsError) throw eventsError;

        const organizerStats = new Map<string, { events: number; likes: number }>();

        (events || []).forEach((event) => {
          if (!event.created_by) return;
          const current = organizerStats.get(event.created_by) || { events: 0, likes: 0 };
          organizerStats.set(event.created_by, {
            events: current.events + 1,
            likes: current.likes + (event.likes || 0),
          });
        });

        const userIds = Array.from(organizerStats.keys());

        if (userIds.length === 0) {
          setOrganizers([]);
          return;
        }

        const { data: profiles, error: profilesError } = await (supabase as any)
          .from('public_profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        if (profiles && profiles.length > 0) {
          const filteredOrganizers = profiles
            .map((profile) => {
              const stats = organizerStats.get(profile.id) || { events: 0, likes: 0 };

              return {
                id: profile.id,
                name: profile.full_name || profile.username || 'Organizer',
                avatar: profile.avatar_url,
                events: stats.events,
                likes: stats.likes,
                role: 'Event organizer',
                type: stats.events > 5 ? 'Frequent host' : 'Active host'
              };
            })
            .filter(org => org.events > 0)
            .sort((a, b) => b.events - a.events || b.likes - a.likes)
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