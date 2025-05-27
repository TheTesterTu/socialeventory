
// Production analytics service
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      console.log('Analytics:', event, properties);
      // In production, you would integrate with your analytics provider here
      // Example: gtag('event', event, properties);
    }
  },

  page: (path: string, title?: string) => {
    if (typeof window !== 'undefined') {
      console.log('Page view:', path, title);
      // In production: gtag('config', 'GA_MEASUREMENT_ID', { page_path: path });
    }
  },

  identify: (userId: string, traits?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      console.log('Identify user:', userId, traits);
      // In production: analytics.identify(userId, traits);
    }
  }
};
