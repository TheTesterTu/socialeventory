
import { supabase } from "@/integrations/supabase/client";

export const savedEventsService = {
  async saveEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_events')
      .insert({ event_id: eventId })
      .single();

    if (error) throw error;
  },

  async unsaveEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_events')
      .delete()
      .eq('event_id', eventId);

    if (error) throw error;
  },

  async isSaved(eventId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('saved_events')
      .select('id')
      .eq('event_id', eventId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  async getSavedEvents(): Promise<string[]> {
    const { data, error } = await supabase
      .from('saved_events')
      .select('event_id');

    if (error) throw error;
    return (data || []).map(item => item.event_id);
  }
};
