# Performance Monitoring Guide

## Overview

SocialEventory now includes comprehensive performance monitoring with Web Vitals tracking and Lighthouse CI integration for continuous performance audits.

## Features

### 1. Web Vitals Tracking

We track all Core Web Vitals metrics in real-time:

- **LCP (Largest Contentful Paint)**: Good < 2.5s
- **INP (Interaction to Next Paint)**: Good < 200ms  
- **CLS (Cumulative Layout Shift)**: Good < 0.1
- **FCP (First Contentful Paint)**: Good < 1.8s
- **TTFB (Time to First Byte)**: Good < 800ms

#### How It Works

- Metrics are automatically tracked on every page load
- Results are logged in development mode
- Historical data is stored in localStorage
- Can be sent to analytics services (Google Analytics, Sentry, etc.)

#### Viewing Metrics

1. Navigate to **Admin Dashboard** → **Performance** tab
2. View real-time metrics and ratings
3. Check historical measurements
4. Monitor trends over time

### 2. Performance Monitor Dashboard

A dedicated admin dashboard component that shows:

- Current Web Vitals metrics with color-coded ratings
- Historical performance data
- Metric thresholds and recommendations
- Recent measurements timeline

**Access**: Admin Dashboard → Performance Tab

### 3. Lighthouse CI Integration

Automated performance audits on every commit/PR.

#### Configuration

The `.lighthouserc.json` file defines:

- **Audit Targets**: Home, Events, Nearby, Profile pages
- **Performance Thresholds**:
  - Performance Score: ≥ 80
  - Accessibility Score: ≥ 90
  - Best Practices Score: ≥ 90
  - SEO Score: ≥ 90
  - FCP: < 2000ms
  - LCP: < 3000ms
  - CLS: < 0.1
  - TBT: < 300ms
  - Speed Index: < 3500ms

#### Running Locally

```bash
# Build the project
npm run build

# Start preview server
npm run preview

# Run Lighthouse CI (in another terminal)
npx lhci autorun
```

#### GitHub Actions Integration

The `.github/workflows/lighthouse-ci.yml` workflow automatically:

1. Runs on every push to main and on PRs
2. Builds the project
3. Runs Lighthouse audits on key pages
4. Uploads results as artifacts
5. Comments on PRs with performance reports

#### Setting Up

1. **Local Development**: Already configured, just run the commands above

2. **GitHub Actions**: 
   - Workflow file is already created
   - Add Supabase secrets to GitHub:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - (Optional) Add `LHCI_GITHUB_APP_TOKEN` for enhanced PR comments

3. **Vercel Integration**:
   - Lighthouse CI automatically works with Vercel preview deployments
   - Results are stored in temporary public storage
   - Can integrate with Lighthouse CI server for persistent storage

## Usage Examples

### 1. Track Custom Events

```typescript
import { useWebVitals } from '@/hooks/useWebVitals';

function MyComponent() {
  const metrics = useWebVitals();
  
  // Metrics are automatically tracked
  // Access current values:
  console.log('LCP:', metrics.LCP);
  console.log('INP:', metrics.INP);
}
```

### 2. Access Historical Data

```typescript
import { getWebVitalsHistory } from '@/hooks/useWebVitals';

const history = getWebVitalsHistory();
// Returns array of all tracked metrics with timestamps and ratings
```

### 3. Integrate with Analytics

The `sendToAnalytics` function in `useWebVitals.tsx` can be extended to send data to:

- Google Analytics
- Sentry Performance Monitoring
- Custom analytics backends

Example for Google Analytics:

```typescript
if (typeof window !== 'undefined' && (window as any).gtag) {
  (window as any).gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true,
  });
}
```

## Performance Optimization Tips

### Based on Web Vitals Results

1. **Poor LCP** (> 2.5s):
   - Optimize images (use WebP, proper sizing)
   - Implement lazy loading
   - Reduce server response time
   - Use CDN for static assets

2. **Poor INP** (> 200ms):
   - Reduce JavaScript execution time
   - Debounce/throttle event handlers
   - Use React.memo and useMemo
   - Implement code splitting

3. **Poor CLS** (> 0.1):
   - Set explicit dimensions for images/videos
   - Reserve space for dynamic content
   - Use CSS aspect-ratio
   - Avoid inserting content above existing content

4. **Poor FCP** (> 1.8s):
   - Optimize critical rendering path
   - Inline critical CSS
   - Defer non-critical JavaScript
   - Use preconnect for external resources

5. **Poor TTFB** (> 800ms):
   - Optimize server response time
   - Use CDN/edge caching
   - Implement server-side caching
   - Optimize database queries

## Monitoring in Production

### Automatic Tracking

- Web Vitals are automatically tracked on all pages
- Data is logged in development mode
- Can be integrated with monitoring services

### Setting Up Production Monitoring

1. **Sentry Integration**:
```typescript
// Add to sendToAnalytics function
import * as Sentry from '@sentry/react';

Sentry.captureEvent({
  message: `Web Vital: ${metric.name}`,
  level: metric.rating === 'good' ? 'info' : 'warning',
  extra: {
    value: metric.value,
    rating: metric.rating,
  },
});
```

2. **Custom Backend**:
```typescript
// Send to your analytics API
fetch('/api/analytics/web-vitals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    metric: metric.name,
    value: metric.value,
    rating: metric.rating,
    timestamp: Date.now(),
  }),
});
```

## Continuous Improvement

### Weekly Review Process

1. Check Lighthouse CI results in GitHub Actions
2. Review Web Vitals trends in Admin Dashboard
3. Identify performance regressions
4. Prioritize optimization work
5. Set performance budgets

### Performance Budgets

Recommended budgets (configured in `.lighthouserc.json`):

- Performance Score: ≥ 80
- Bundle Size: < 500KB (gzipped)
- LCP: < 2.5s
- INP: < 200ms
- CLS: < 0.1

## Troubleshooting

### Web Vitals Not Showing

- Check browser console for errors
- Ensure `web-vitals` package is installed
- Verify tracking is initialized in `main.tsx`

### Lighthouse CI Failing

- Check Node.js version (≥ 18 required)
- Verify build completes successfully
- Check preview server starts correctly
- Review error logs in GitHub Actions

### Poor Performance Scores

- Run local Lighthouse audit for details
- Check Network tab for slow requests
- Use Chrome DevTools Performance panel
- Review bundle size with visualizer:
  ```bash
  npm run build
  # Check dist/stats.html
  ```

## Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Core Web Vitals Guide](https://web.dev/learn-core-web-vitals/)
- [Performance Optimization Guide](./PERFORMANCE.md)

## Support

For issues or questions:
1. Check this documentation
2. Review GitHub Actions logs
3. Check browser console for errors
4. Contact the development team
