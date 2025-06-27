
// Simple performance utility for marking and measuring
const marks = new Map<string, number>();
const measures = new Map<string, number>();

export const performance = {
  mark: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
      marks.set(name, window.performance.now());
    }
  },
  
  measure: (name: string, startMark: string, endMark: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name, 'measure')[0];
        if (measure) {
          measures.set(name, measure.duration);
          console.log(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
        }
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    }
  },

  getMetrics: () => {
    return {
      marks,
      measures
    };
  }
};
