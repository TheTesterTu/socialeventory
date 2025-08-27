
import { supabase } from "@/integrations/supabase/client";

export interface APIConfig {
  key: string;
  value: string;
  description: string;
  is_public: boolean;
}

export const getAPIConfig = async (key: string): Promise<string | null> => {
  // Note: API configurations are now admin-only for security
  // Public configurations should be moved to environment variables
  const { data, error } = await supabase
    .from('api_configurations')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error('Error fetching API configuration:', error);
    return null;
  }

  return data?.value || null;
};

export const getSecureAPIConfig = async (key: string): Promise<string | null> => {
  // This function requires admin access and fetches private configurations
  const { data, error } = await supabase
    .from('api_configurations')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error('Error fetching secure API configuration:', error);
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
