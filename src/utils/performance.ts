
// Performance monitoring utilities for production
export const performance = {
  // Mark performance metrics
  mark: (name: string) => {
    if ('performance' in window && 'mark' in window.performance) {
      window.performance.mark(name);
    }
  },

  // Measure performance between marks
  measure: (name: string, startMark: string, endMark?: string) => {
    if ('performance' in window && 'measure' in window.performance) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name, 'measure')[0];
        const duration = measure?.duration || 0;
        
        // Log only in development or if duration is concerning
        if (process.env.NODE_ENV === 'development' || duration > 1000) {
          console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
        }
        
        return duration;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    }
    return 0;
  },

  // Report Core Web Vitals
  reportWebVitals: (metric: any) => {
    // Only log in development or for critical metrics
    if (process.env.NODE_ENV === 'development' || metric.value > 2500) {
      console.log('Web Vitals:', metric);
    }
    
    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: analytics.track('web_vital', metric);
    }
  },

  // Memory usage monitoring
  getMemoryUsage: () => {
    if ('memory' in performance) {
      return {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1048576),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1048576),
        limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  }
};

// Monitor large DOM changes
export const observePerformance = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.duration > 100) {
          console.warn(`Slow operation detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
        }
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
    
    return () => observer.disconnect();
  }
  
  return () => {};
};
