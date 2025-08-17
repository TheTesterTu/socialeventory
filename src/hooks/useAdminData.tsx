import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { Event } from '@/lib/types';

interface AdminUser {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  eventsCreated: number;
}

interface AdminData {
  pendingEvents: Event[];
  recentUsers: AdminUser[];
  loading: boolean;
  error: string | null;
}

export const useAdminData = () => {
  const [data, setData] = useState<AdminData>({
    pendingEvents: [],
    recentUsers: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch pending events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('verification_status', 'pending')
          .order('created_at', { ascending: false });

        if (eventsError) throw eventsError;

        const pendingEvents = eventsData.map(mapDatabaseEventToEvent);

        // Fetch recent users with event counts
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            username,
            avatar_url,
            role,
            created_at
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (usersError) throw usersError;

        // Get event counts for each user
        const usersWithEventCounts = await Promise.all(
          usersData.map(async (user) => {
            const { count } = await supabase
              .from('events')
              .select('*', { count: 'exact', head: true })
              .eq('created_by', user.id);

            return {
              ...user,
              eventsCreated: count || 0
            };
          })
        );

        setData({
          pendingEvents,
          recentUsers: usersWithEventCounts,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching admin data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    };

    fetchAdminData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  const approveEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ verification_status: 'verified' })
        .eq('id', eventId);

      if (error) throw error;

      // Update local state
      setData(prev => ({
        ...prev,
        pendingEvents: prev.pendingEvents.filter(event => event.id !== eventId)
      }));

      return { success: true };
    } catch (error) {
      console.error('Error approving event:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  };

  const rejectEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ verification_status: 'rejected' })
        .eq('id', eventId);

      if (error) throw error;

      // Update local state
      setData(prev => ({
        ...prev,
        pendingEvents: prev.pendingEvents.filter(event => event.id !== eventId)
      }));

      return { success: true };
    } catch (error) {
      console.error('Error rejecting event:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      // Update local state
      setData(prev => ({
        ...prev,
        pendingEvents: prev.pendingEvents.filter(event => event.id !== eventId)
      }));

      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  };

  return {
    ...data,
    approveEvent,
    rejectEvent,
    deleteEvent
  };
};