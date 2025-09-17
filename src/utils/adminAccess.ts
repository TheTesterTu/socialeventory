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

// Synchronous version - checks user metadata (less secure but works for UI elements)
export const isAdminUserSync = (user: User | null): boolean => {
  if (!user) return false;
  
  // Check user metadata for admin role (less secure but works for UI)
  return user.user_metadata?.role === 'admin' || 
         user.app_metadata?.role === 'admin' ||
         (isDevelopment() && user.email?.includes('admin'));
};

export const isProductionToolsEnabled = (): boolean => {
  // Only show production tools in development or for admin users
  return isDevelopment();
};

export const shouldShowDebugInfo = (): boolean => {
  return isDevelopment();
};