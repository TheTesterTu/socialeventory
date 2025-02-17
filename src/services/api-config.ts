
import { supabase } from "@/integrations/supabase/client";

export interface APIConfig {
  key: string;
  value: string;
  description: string;
  is_public: boolean;
}

export const getAPIConfig = async (key: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('api_configurations')
    .select('value')
    .eq('key', key)
    .eq('is_public', true)
    .single();

  if (error) {
    console.error('Error fetching API configuration:', error);
    return null;
  }

  return data?.value || null;
};

export const getAdminAPIConfigs = async (): Promise<APIConfig[]> => {
  const { data, error } = await supabase
    .from('api_configurations')
    .select('*');

  if (error) {
    console.error('Error fetching API configurations:', error);
    return [];
  }

  return data || [];
};

export const updateAPIConfig = async (key: string, value: string): Promise<boolean> => {
  const { error } = await supabase
    .from('api_configurations')
    .update({ value })
    .eq('key', key);

  if (error) {
    console.error('Error updating API configuration:', error);
    return false;
  }

  return true;
};
