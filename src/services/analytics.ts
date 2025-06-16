// Production analytics service with environment-aware logging
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      // Only log in development mode
      if (import.meta.env.DEV) {
        console.log('Analytics:', event, properties);
      }
      
      // Store analytics data for future integration
      try {
        const analyticsData = {
          event,
          properties: properties || {},
          timestamp: new Date().toISOString(),
          sessionId: sessionStorage.getItem('session_id') || 'anonymous',
          url: window.location.href
        };
        
        // Store in localStorage for later batch sending
        const existingData = JSON.parse(localStorage.getItem('pending_analytics') || '[]');
        existingData.push(analyticsData);
        
        // Keep only last 100 events to prevent storage bloat
        const recentData = existingData.slice(-100);
        localStorage.setItem('pending_analytics', JSON.stringify(recentData));
      } catch (error) {
        // Silently fail if localStorage is not available
      }
    }
  },

  page: (path: string, title?: string) => {
    if (typeof window !== 'undefined') {
      if (import.meta.env.DEV) {
        console.log('Page view:', path, title);
      }
      
      analytics.track('page_view', {
        path,
        title: title || document.title,
        referrer: document.referrer
      });
    }
  },

  identify: (userId: string, traits?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      if (import.meta.env.DEV) {
        console.log('Identify user:', userId, traits);
      }
      
      analytics.track('user_identify', {
        userId,
        traits: traits || {}
      });
      
      // Store user context
      try {
        sessionStorage.setItem('user_id', userId);
        if (traits) {
          sessionStorage.setItem('user_traits', JSON.stringify(traits));
        }
      } catch (error) {
        // Silently fail if sessionStorage is not available
      }
    }
  },

  // Method to export analytics data for external services
  exportPendingData: () => {
    try {
      const data = localStorage.getItem('pending_analytics');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Method to clear analytics data after successful export
  clearPendingData: () => {
    try {
      localStorage.removeItem('pending_analytics');
    } catch {
      // Silently fail
    }
  }
};

export const trackEvent = analytics.track;
