import { User } from '@supabase/supabase-js';
import { isDevelopment } from './productionConfig';
import { supabase } from '@/integrations/supabase/client';

// Admin email addresses - fallback for emergency access
const ADMIN_EMAILS = [
  'admin@socialeventory.com',
  // Add more admin emails here
];

export const isAdminUser = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    // First, try to get role from database using secure function
    const { data, error } = await supabase.rpc('get_user_role', { 
      user_id: user.id 
    });
    
    if (!error && data) {
      return data === 'admin';
    }
    
    // Fallback to email check only in development or if database call fails
    if (isDevelopment()) {
      return ADMIN_EMAILS.includes(user.email || '');
    }
    
    return false;
  } catch (error) {
    // Emergency fallback for development
    if (isDevelopment()) {
      return ADMIN_EMAILS.includes(user.email || '');
    }
    return false;
  }
};

// Synchronous version for non-async contexts - less secure
export const isAdminUserSync = (user: User | null): boolean => {
  if (!user) return false;
  
  // Only allow email-based admin check in development
  if (isDevelopment()) {
    return ADMIN_EMAILS.includes(user.email || '');
  }
  
  // In production, require async database check
  return false;
};

export const isProductionToolsEnabled = (): boolean => {
  // Only show production tools in development or for admin users
  return isDevelopment();
};

export const shouldShowDebugInfo = (): boolean => {
  return isDevelopment();
};