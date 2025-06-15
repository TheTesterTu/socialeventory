
import { lazy, Suspense } from 'react';
import { EventDetailsSkeleton } from './EventDetailsSkeleton';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy load del componente EventDetailsContainer
const LazyEventDetailsContainer = lazy(() => 
  import('./EventDetailsContainer').then(module => ({
    default: module.EventDetailsContainer
  }))
);

interface LazyEventDetailsProps {
  event: any;
}

export const LazyEventDetails = ({ event }: LazyEventDetailsProps) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<EventDetailsSkeleton />}>
        <LazyEventDetailsContainer event={event} />
      </Suspense>
    </ErrorBoundary>
  );
};
