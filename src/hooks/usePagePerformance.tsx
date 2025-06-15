
import { useEffect, useRef } from 'react';
import { performance } from '@/utils/performance';
import { analytics } from '@/services/analytics';

interface UsePagePerformanceOptions {
  pageName: string;
  trackCoreWebVitals?: boolean;
  enableDebugLogs?: boolean;
}

export const usePagePerformance = ({
  pageName,
  trackCoreWebVitals = true,
  enableDebugLogs = process.env.NODE_ENV === 'development'
}: UsePagePerformanceOptions) => {
  const pageLoadStart = useRef<number>(Date.now());
  const isTracked = useRef<boolean>(false);

  useEffect(() => {
    // Mark page load start
    performance.mark(`${pageName}-page-start`);
    
    // Track page view
    analytics.page(window.location.pathname, pageName);

    // Track when page becomes interactive
    const handlePageLoad = () => {
      if (isTracked.current) return;
      isTracked.current = true;

      performance.mark(`${pageName}-page-end`);
      const loadTime = performance.measure(
        `${pageName}-page-load`,
        `${pageName}-page-start`,
        `${pageName}-page-end`
      );

      // Track page load time
      analytics.track('Page Load Time', {
        page: pageName,
        loadTime: loadTime,
        path: window.location.pathname
      });

      if (enableDebugLogs) {
        console.log(`📊 ${pageName} loaded in ${loadTime.toFixed(2)}ms`);
      }
    };

    // Track when DOM is ready
    if (document.readyState === 'complete') {
      handlePageLoad();
    } else {
      window.addEventListener('load', handlePageLoad, { once: true });
    }

    // Track Core Web Vitals if enabled
    if (trackCoreWebVitals) {
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS((metric) => {
          analytics.track('Core Web Vital - CLS', {
            page: pageName,
            value: metric.value,
            rating: metric.rating
          });
        });

        onINP((metric) => {
          analytics.track('Core Web Vital - INP', {
            page: pageName,
            value: metric.value,
            rating: metric.rating
          });
        });

        onFCP((metric) => {
          analytics.track('Core Web Vital - FCP', {
            page: pageName,
            value: metric.value,
            rating: metric.rating
          });
        });

        onLCP((metric) => {
          analytics.track('Core Web Vital - LCP', {
            page: pageName,
            value: metric.value,
            rating: metric.rating
          });
        });

        onTTFB((metric) => {
          analytics.track('Core Web Vital - TTFB', {
            page: pageName,
            value: metric.value,
            rating: metric.rating
          });
        });
      }).catch(() => {
        // web-vitals not available, skip tracking
      });
    }

    return () => {
      window.removeEventListener('load', handlePageLoad);
    };
  }, [pageName, trackCoreWebVitals, enableDebugLogs]);

  // Function to track custom performance metrics
  const trackCustomMetric = (metricName: string, value: number, unit: string = 'ms') => {
    analytics.track('Custom Performance Metric', {
      page: pageName,
      metric: metricName,
      value,
      unit
    });

    if (enableDebugLogs) {
      console.log(`📈 ${pageName} - ${metricName}: ${value}${unit}`);
    }
  };

  return {
    trackCustomMetric
  };
};
