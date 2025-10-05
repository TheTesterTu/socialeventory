import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Organization {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  events: number;
  followers: number;
  location?: string;
  role?: string;
}

export const useUserOrganizations = () => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrganizations([]);
      setLoading(false);
      return;
    }

    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        
        // Get user's profile to check if they're an organizer
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profile) {
          setOrganizations([]);
          return;
        }

        // For now, create virtual organizations based on user's events
        const { data: userEvents, error } = await supabase
          .from('events')
          .select('*')
          .eq('created_by', user.id);

        if (error) throw error;

        // Group events by location/category to create virtual organizations
        const orgs: Organization[] = [];
        
        if (userEvents && userEvents.length > 0) {
          // Create a main organization based on user's activity
          const mainOrg: Organization = {
            id: `org-${user.id}`,
            name: `${profile.full_name || profile.username || 'My'} Events`,
            imageUrl: profile.avatar_url || `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1501594907352-04cda38ebc29' : '1516450360452-9312f5e86fc7'}?w=800&h=600&fit=crop`,
            description: 'Managing and organizing community events',
            events: userEvents.length,
            followers: Math.floor(userEvents.length * 15), // Estimate based on event count
            location: (profile.preferences as any)?.location || 'Location not set',
            role: 'Owner'
          };
          
          orgs.push(mainOrg);
        }

        setOrganizations(orgs);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setOrganizations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [user]);

  return { organizations, loading };
};
