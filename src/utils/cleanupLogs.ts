// Production log cleanup utility
// This file identifies console.log statements that should be removed in production

export const isDevelopment = process.env.NODE_ENV === 'development';

// Safe console wrapper for development-only logs
export const devLog = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  }
};

// Production-safe error reporting
export const reportError = (error: Error, context?: string) => {
  if (isDevelopment) {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  } else {
    // In production, send to error tracking service
    // TODO: Integrate with Sentry or similar service
  }
};