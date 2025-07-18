import { User } from '@supabase/supabase-js';
import { isDevelopment } from './productionConfig';

// Admin email addresses - in production this should come from database
const ADMIN_EMAILS = [
  'admin@socialeventory.com',
  // Add more admin emails here
];

export const isAdminUser = (user: User | null): boolean => {
  if (!user) return false;
  
  // In development, allow any authenticated user to access admin features
  if (isDevelopment()) {
    return true;
  }
  
  // In production, check against admin email list
  return ADMIN_EMAILS.includes(user.email || '');
};

export const isProductionToolsEnabled = (): boolean => {
  // Only show production tools in development or for admin users
  return isDevelopment();
};

export const shouldShowDebugInfo = (): boolean => {
  return isDevelopment();
};