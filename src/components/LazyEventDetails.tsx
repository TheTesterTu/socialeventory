
import { lazy, Suspense } from 'react';
import { EventDetailsSkeleton } from './EventDetailsSkeleton';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy load del componente EventDetailsOptimized
const LazyEventDetailsOptimizedComponent = lazy(() => 
  import('./EventDetailsOptimized').then(module => ({
    default: module.EventDetailsOptimized
  }))
);

interface LazyEventDetailsProps {
  event: any;
}

export const LazyEventDetails = ({ event }: LazyEventDetailsProps) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<EventDetailsSkeleton />}>
        <LazyEventDetailsOptimizedComponent event={event} />
      </Suspense>
    </ErrorBoundary>
  );
};
