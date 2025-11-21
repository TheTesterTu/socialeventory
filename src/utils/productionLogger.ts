// Production-safe logging utilities
const isDev = import.meta.env.MODE === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  
  error: (...args: any[]) => {
    if (isDev) {
      console.error(...args);
    } else {
      // In production, errors should be sent to monitoring service
      // For now, we keep them silent to avoid console pollution
    }
  },
  
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  },
  
  debug: (...args: any[]) => {
    if (isDev) console.debug(...args);
  },
};

// Performance logging
export const perfLogger = {
  start: (label: string): number => {
    if (isDev) {
      console.time(label);
    }
    return performance.now();
  },
  
  end: (label: string, startTime?: number) => {
    if (isDev) {
      if (startTime) {
        const duration = performance.now() - startTime;
        console.log(`${label}: ${duration.toFixed(2)}ms`);
      } else {
        console.timeEnd(label);
      }
    }
  },
};
