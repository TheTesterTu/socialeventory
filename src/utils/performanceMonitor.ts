interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 100;

  recordMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href
    };

    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Store in localStorage for analysis
    try {
      localStorage.setItem('performance_metrics', JSON.stringify(this.metrics));
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  measureAsync<T>(name: string, asyncFn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    
    return asyncFn().finally(() => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration);
    });
  }

  measureSync<T>(name: string, syncFn: () => T): T {
    const startTime = performance.now();
    const result = syncFn();
    const duration = performance.now() - startTime;
    this.recordMetric(name, duration);
    return result;
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearMetrics() {
    this.metrics = [];
    try {
      localStorage.removeItem('performance_metrics');
    } catch {
      // Silently fail
    }
  }

  getAverageMetric(name: string): number {
    const relevantMetrics = this.metrics.filter(m => m.name === name);
    if (relevantMetrics.length === 0) return 0;
    
    const sum = relevantMetrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / relevantMetrics.length;
  }

  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  // Monitor Core Web Vitals
  monitorWebVitals() {
    if ('web-vitals' in window) {
      // If web-vitals library is available, use it
      return;
    }

    // Basic performance monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.loadEventStart);
          this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
        }
        
        if (entry.entryType === 'paint') {
          this.recordMetric(entry.name, entry.startTime);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['navigation', 'paint'] });
    } catch {
      // Browser doesn't support Performance Observer
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Initialize web vitals monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.monitorWebVitals();
}
