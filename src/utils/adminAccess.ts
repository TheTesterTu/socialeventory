import { User } from '@supabase/supabase-js';
import { isDevelopment } from './productionConfig';
import { supabase } from '@/integrations/supabase/client';

export const isAdminUser = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    // Use secure database function to check admin role
    const { data, error } = await supabase.rpc('get_user_role', { 
      user_id: user.id 
    });
    
    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
    
    return data === 'admin';
  } catch (error) {
    console.error('Failed to check admin role:', error);
    return false;
  }
};

// Synchronous version - always returns false in production for security
export const isAdminUserSync = (user: User | null): boolean => {
  if (!user) return false;
  
  // In production, always require async database check for security
  // Only allow fallback in development for testing purposes
  if (isDevelopment()) {
    // Even in development, we should use the async version when possible
    console.warn('Using synchronous admin check - prefer isAdminUser() for security');
    return false;
  }
  
  return false;
};

export const isProductionToolsEnabled = (): boolean => {
  // Only show production tools in development or for admin users
  return isDevelopment();
};

export const shouldShowDebugInfo = (): boolean => {
  return isDevelopment();
};