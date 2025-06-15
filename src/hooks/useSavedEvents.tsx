
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useSavedEvents = () => {
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch saved events for the current user
  const fetchSavedEvents = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_events')
        .select('event_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      setSavedEventIds(data?.map(item => item.event_id) || []);
    } catch (error) {
      console.error('Error fetching saved events:', error);
      toast({
        title: "Error",
        description: "Failed to load saved events",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save an event
  const saveEvent = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save events",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('saved_events')
        .insert({ event_id: eventId, user_id: user.id });

      if (error) throw error;

      setSavedEventIds(prev => [...prev, eventId]);
      toast({
        title: "Event saved!",
        description: "Event has been added to your saved list",
      });
      return true;
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive"
      });
      return false;
    }
  };

  // Unsave an event
  const unsaveEvent = async (eventId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_events')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedEventIds(prev => prev.filter(id => id !== eventId));
      toast({
        title: "Event removed",
        description: "Event has been removed from your saved list",
      });
      return true;
    } catch (error) {
      console.error('Error unsaving event:', error);
      toast({
        title: "Error",
        description: "Failed to remove event",
        variant: "destructive"
      });
      return false;
    }
  };

  // Check if an event is saved
  const isEventSaved = (eventId: string) => {
    return savedEventIds.includes(eventId);
  };

  // Toggle save/unsave
  const toggleSaveEvent = async (eventId: string) => {
    if (isEventSaved(eventId)) {
      return await unsaveEvent(eventId);
    } else {
      return await saveEvent(eventId);
    }
  };

  useEffect(() => {
    fetchSavedEvents();
  }, [user]);

  return {
    savedEventIds,
    isLoading,
    saveEvent,
    unsaveEvent,
    isEventSaved,
    toggleSaveEvent,
    refetch: fetchSavedEvents
  };
};
