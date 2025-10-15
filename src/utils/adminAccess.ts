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

// REMOVED: isAdminUserSync was insecure (client-side metadata can be manipulated)
// Always use isAdminUser() or useSecureAdmin() hook for proper server-side validation

export const isProductionToolsEnabled = (): boolean => {
  // Only show production tools in development or for admin users
  return isDevelopment();
};

export const shouldShowDebugInfo = (): boolean => {
  return isDevelopment();
};