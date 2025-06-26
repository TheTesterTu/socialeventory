
import { lazy, Suspense } from 'react';
import { EventDetailsSkeleton } from './EventDetailsSkeleton';
import { ErrorBoundary } from './ErrorBoundary';

const LazyEventDetailsOptimized = lazy(() => 
  import('./EventDetailsOptimized').then(module => ({
    default: module.EventDetailsOptimized
  }))
);

interface LazyEventDetailsOptimizedProps {
  event: any;
}

export const LazyEventDetailsOptimized = ({ event }: LazyEventDetailsOptimizedProps) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<EventDetailsSkeleton />}>
        <LazyEventDetailsOptimized event={event} />
      </Suspense>
    </ErrorBoundary>
  );
};
