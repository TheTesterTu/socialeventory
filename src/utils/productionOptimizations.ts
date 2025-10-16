// Production optimizations for SocialEventory
export const PRODUCTION_CONFIG = {
  // Query optimization
  QUERY_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 30 * 60 * 1000, // 30 minutes
  
  // Performance settings
  PREFETCH_DELAY: 100, // ms
  DEBOUNCE_DELAY: 300, // ms
  THROTTLE_DELAY: 100, // ms
  
  // Feature flags
  ENABLE_REALTIME: false, // Disabled for better performance
  ENABLE_ANIMATIONS: true,
  ENABLE_PREFETCH: true,
  
  // API limits
  MAX_EVENTS_PER_PAGE: 20,
  MAX_SEARCH_RESULTS: 50,
  MAX_NEARBY_RADIUS: 25000, // 25km
  
  // Cache keys
  CACHE_KEYS: {
    EVENTS: 'unified-events',
    CATEGORIES: 'categories',
    EVENT_DETAILS: 'event-details',
    EVENT_STATS: 'event-stats',
    USER_PROFILE: 'user-profile'
  }
} as const;

// Image optimization
export const optimizeImageUrl = (url: string, width: number = 800, quality: number = 80): string => {
  if (!url) return '';
  
  // Unsplash optimization
  if (url.includes('unsplash.com')) {
    return `${url}?w=${width}&q=${quality}&auto=format&fit=crop`;
  }
  
  // Supabase storage optimization (if needed in future)
  if (url.includes('supabase')) {
    return url; // Return as-is for now
  }
  
  return url;
};

// Cleanup old cache entries
export const cleanupCache = (queryClient: any) => {
  const oldCacheTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
  
  queryClient.getQueryCache().getAll().forEach((query: any) => {
    if (query.state.dataUpdatedAt < oldCacheTime) {
      queryClient.removeQueries({ queryKey: query.queryKey });
    }
  });
};

// Performance monitoring (lightweight)
export const logPerformance = (operation: string, startTime: number) => {
  if (import.meta.env.MODE === 'development') {
    const duration = Date.now() - startTime;
    if (duration > 1000) { // Only log slow operations
      console.warn(`Slow operation: ${operation} took ${duration}ms`);
    }
  }
};