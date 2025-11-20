import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWebVitals, getWebVitalsHistory } from '@/hooks/useWebVitals';
import { Activity, Clock, Eye, Gauge, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface VitalsHistory {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

export const PerformanceMonitor = () => {
  const metrics = useWebVitals();
  const [history, setHistory] = useState<VitalsHistory[]>([]);

  useEffect(() => {
    setHistory(getWebVitalsHistory());
    
    // Update history periodically
    const interval = setInterval(() => {
      setHistory(getWebVitalsHistory());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-600 dark:text-green-400';
      case 'needs-improvement':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'poor':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatValue = (name: string, value: number | null) => {
    if (value === null) return 'Measuring...';
    if (name === 'CLS') return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  const getMetricIcon = (name: string) => {
    switch (name) {
      case 'LCP':
        return <Eye className="h-4 w-4" />;
      case 'INP':
        return <Zap className="h-4 w-4" />;
      case 'CLS':
        return <Activity className="h-4 w-4" />;
      case 'FCP':
        return <Clock className="h-4 w-4" />;
      case 'TTFB':
        return <Gauge className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const metricsInfo = [
    { key: 'LCP', name: 'Largest Contentful Paint', threshold: 'Good: < 2.5s' },
    { key: 'INP', name: 'Interaction to Next Paint', threshold: 'Good: < 200ms' },
    { key: 'CLS', name: 'Cumulative Layout Shift', threshold: 'Good: < 0.1' },
    { key: 'FCP', name: 'First Contentful Paint', threshold: 'Good: < 1.8s' },
    { key: 'TTFB', name: 'Time to First Byte', threshold: 'Good: < 800ms' },
  ];

  const getLatestRating = (metricName: string): string => {
    const latest = history.filter(h => h.name === metricName).pop();
    return latest?.rating || 'unknown';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Core Web Vitals
          </CardTitle>
          <CardDescription>
            Real-time performance metrics tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metricsInfo.map(({ key, name, threshold }) => {
              const value = metrics[key as keyof typeof metrics];
              const rating = getLatestRating(key);
              
              return (
                <div
                  key={key}
                  className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getMetricIcon(key)}
                      <div>
                        <p className="text-sm font-medium">{key}</p>
                        <p className="text-xs text-muted-foreground">{name}</p>
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${getRatingColor(rating)}`}>
                      {formatValue(key, value)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{threshold}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Measurements</CardTitle>
          <CardDescription>
            Last {Math.min(history.length, 10)} performance measurements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {history.slice(-10).reverse().map((metric, index) => (
              <div
                key={`${metric.name}-${metric.timestamp}-${index}`}
                className="flex items-center justify-between rounded-lg border bg-card p-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  {getMetricIcon(metric.name)}
                  <span className="font-medium">{metric.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    {formatValue(metric.name, metric.value)}
                  </span>
                  <span className={`font-medium ${getRatingColor(metric.rating)}`}>
                    {metric.rating}
                  </span>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No measurements yet. Interact with the app to collect metrics.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
