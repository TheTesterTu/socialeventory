
import { lazy, Suspense } from 'react';
import { EventDetailsSkeleton } from './EventDetailsSkeleton';
import { ErrorBoundary } from './ErrorBoundary';

const EventDetailsOptimizedLazy = lazy(() => 
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
        <EventDetailsOptimizedLazy event={event} />
      </Suspense>
    </ErrorBoundary>
  );
};
