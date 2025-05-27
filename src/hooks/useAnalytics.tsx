
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/services/analytics';
import { useAuth } from '@/contexts/AuthContext';

export const useAnalytics = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Track page views
    analytics.page(location.pathname, document.title);
  }, [location.pathname]);

  useEffect(() => {
    // Identify user when they log in
    if (user) {
      analytics.identify(user.id, {
        email: user.email,
        created_at: user.created_at
      });
    }
  }, [user]);

  return analytics;
};
