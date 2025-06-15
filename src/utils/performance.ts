
// Performance monitoring utilities
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
        console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
        return duration;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    }
    return 0;
  },

  // Report Core Web Vitals
  reportWebVitals: (metric: any) => {
    console.log('Web Vitals:', metric);
    // In production, you would send this to your analytics service
  }
};
