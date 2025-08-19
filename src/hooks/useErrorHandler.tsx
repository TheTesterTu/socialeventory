
import { useCallback } from 'react';
import { toast } from 'sonner';
import { analytics } from '@/services/analytics';

export const useErrorHandler = () => {
  const handleError = useCallback((error: Error, context?: string) => {
    // Show user-friendly error message first
    toast.error("Something went wrong", {
      description: context ? `Error in ${context}` : "Please try again later",
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by error handler:', error, { context });
    }

    // Safely log error for analytics
    try {
      analytics.track('error_occurred', {
        error_message: error.message,
        error_stack: error.stack,
        context,
        user_agent: navigator.userAgent,
        url: window.location.href,
      });
    } catch (analyticsError) {
      // Prevent analytics errors from affecting user experience
      console.error('Analytics error:', analyticsError);
    }
  }, []);

  return { handleError };
};
