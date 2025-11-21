import { useEffect } from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from 'web-vitals';

const isDevelopment = () => import.meta.env.MODE === 'development';
const isProduction = () => import.meta.env.MODE === 'production';

interface WebVitalsMetrics {
  CLS: number | null;
  INP: number | null;
  LCP: number | null;
  FCP: number | null;
  TTFB: number | null;
}

const metrics: WebVitalsMetrics = {
  CLS: null,
  INP: null,
  LCP: null,
  FCP: null,
  TTFB: null,
};

const sendToAnalytics = (metric: Metric) => {
  // Store metric
  metrics[metric.name as keyof WebVitalsMetrics] = metric.value;

  // Log in development
  if (isDevelopment()) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // Send to analytics service (can be extended to send to Google Analytics, Sentry, etc.)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Store in localStorage for dashboard
  try {
    const stored = localStorage.getItem('web-vitals-history') || '[]';
    const history = JSON.parse(stored);
    history.push({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: Date.now(),
    });
    // Keep only last 100 entries
    if (history.length > 100) {
      history.shift();
    }
    localStorage.setItem('web-vitals-history', JSON.stringify(history));
  } catch (error) {
    console.error('Failed to store Web Vitals:', error);
  }
};

export const useWebVitals = () => {
  useEffect(() => {
    // Only track in production
    if (!isProduction()) return;

    // Initialize Web Vitals tracking
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return metrics;
};

export const getWebVitalsMetrics = (): WebVitalsMetrics => metrics;

export const getWebVitalsHistory = () => {
  try {
    const stored = localStorage.getItem('web-vitals-history') || '[]';
    return JSON.parse(stored);
  } catch {
    return [];
  }
};
