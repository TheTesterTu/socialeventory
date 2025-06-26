
interface PerformanceMetrics {
  marks: Map<string, number>;
  measures: Map<string, number>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    marks: new Map(),
    measures: new Map()
  };

  mark(name: string): void {
    try {
      if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark(name);
      }
      this.metrics.marks.set(name, Date.now());
    } catch (error) {
      console.warn('Performance mark failed:', error);
    }
  }

  measure(name: string, startMark: string, endMark: string): void {
    try {
      const startTime = this.metrics.marks.get(startMark);
      const endTime = this.metrics.marks.get(endMark);
      
      if (startTime && endTime) {
        const duration = endTime - startTime;
        this.metrics.measures.set(name, duration);
        
        if (typeof performance !== 'undefined' && performance.measure) {
          performance.measure(name, startMark, endMark);
        }
        
        // Log slow operations
        if (duration > 1000) {
          console.warn(`Slow operation detected: ${name} took ${duration}ms`);
        }
      }
    } catch (error) {
      console.warn('Performance measure failed:', error);
    }
  }

  getMetrics(): PerformanceMetrics {
    return {
      marks: new Map(this.metrics.marks),
      measures: new Map(this.metrics.measures)
    };
  }

  clear(): void {
    this.metrics.marks.clear();
    this.metrics.measures.clear();
    
    if (typeof performance !== 'undefined' && performance.clearMarks) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}

export const performance = new PerformanceMonitor();
