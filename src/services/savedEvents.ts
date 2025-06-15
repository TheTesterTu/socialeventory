
import { supabase } from '@/integrations/supabase/client';

export const savedEventsService = {
  async saveEvent(eventId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('saved_events')
      .insert({ event_id: eventId, user_id: user.id });

    if (error) throw error;
  },

  async unsaveEvent(eventId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('saved_events')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  async isSaved(eventId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('saved_events')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();

    return !error && data !== null;
  },

  async getSavedEvents(): Promise<string[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('saved_events')
      .select('event_id')
      .eq('user_id', user.id);

    if (error) return [];
    
    return data?.map(item => item.event_id) || [];
  }
};
