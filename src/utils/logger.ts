// Production-safe logging utility
import { FEATURE_FLAGS } from './productionConfig';

/**
 * Safe console.log that only works in development
 */
export const log = (...args: any[]) => {
  if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGS) {
    console.log(...args);
  }
};

/**
 * Safe console.warn that only works in development
 */
export const warn = (...args: any[]) => {
  if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGS) {
    console.warn(...args);
  }
};

/**
 * Safe console.error that only works in development
 * In production, you should integrate with error monitoring service
 */
export const error = (err: any, context?: string) => {
  if (FEATURE_FLAGS.ENABLE_CONSOLE_LOGS) {
    console.error(context ? `[${context}]` : '', err);
  }
  // TODO: In production, send to error monitoring service (Sentry, LogRocket, etc.)
};

/**
 * Performance logging - only in development
 */
export const logPerformance = (operation: string, duration: number) => {
  if (FEATURE_FLAGS.ENABLE_PERFORMANCE_LOGGING && duration > 1000) {
    console.warn(`⚠️ Slow operation: ${operation} took ${duration}ms`);
  }
};
