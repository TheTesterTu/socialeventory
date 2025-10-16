// Production configuration and environment checks
export const isProduction = () => {
  return import.meta.env.MODE === 'production';
};

export const isDevelopment = () => {
  return import.meta.env.MODE === 'development';
};

// Safely log only in development
export const devLog = (...args: any[]) => {
  if (isDevelopment()) {
    console.log(...args);
  }
};

// Production-safe error logging
export const errorLog = (error: any, context?: string) => {
  if (isDevelopment()) {
    console.error(context ? `[${context}]` : '', error);
  }
  // In production, errors are silent on client - use Supabase error monitoring
};

// Feature flags for production readiness
export const FEATURE_FLAGS = {
  SHOW_DEBUG_INFO: isDevelopment(),
  ENABLE_PERFORMANCE_LOGGING: isDevelopment(),
  ENABLE_MOCK_DATA: false, // Always false for production readiness
  STRICT_AUTH_CHECKS: true,
  ENABLE_ERROR_BOUNDARIES: true,
  ENABLE_ANALYTICS: isProduction(),
  ENABLE_CONSOLE_LOGS: isDevelopment(), // Disable all console logs in production
} as const;

// Production optimization settings
export const PERFORMANCE_CONFIG = {
  QUERY_STALE_TIME: isProduction() ? 5 * 60 * 1000 : 30 * 1000, // 5min prod, 30s dev
  CACHE_TIME: isProduction() ? 10 * 60 * 1000 : 5 * 60 * 1000, // 10min prod, 5min dev
  RETRY_COUNT: isProduction() ? 3 : 1,
  TIMEOUT: isProduction() ? 10000 : 5000,
} as const;

// Database query optimization for production
export const DB_CONFIG = {
  MAX_EVENTS_PER_PAGE: 20,
  MAX_SEARCH_RESULTS: 100,
  NEARBY_EVENTS_RADIUS: 25000, // 25km in meters
  FEATURED_EVENTS_LIMIT: 10,
  POPULAR_ORGANIZERS_LIMIT: 4,
} as const;

// Security configurations
export const SECURITY_CONFIG = {
  REQUIRE_EMAIL_VERIFICATION: isProduction(),
  ENABLE_RATE_LIMITING: isProduction(),
  STRICT_CORS: isProduction(),
  ENFORCE_HTTPS: isProduction(),
} as const;