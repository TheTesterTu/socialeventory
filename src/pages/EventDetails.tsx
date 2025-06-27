
import { useParams } from 'react-router-dom';
import { AppLayout } from "@/components/layout/AppLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { StructuredData } from "@/components/seo/StructuredData";
import { EventDetailsSkeleton } from '@/components/EventDetailsSkeleton';
import { useOptimizedEventDetails } from '@/hooks/useOptimizedEventDetails';
import { EventDetailsOptimized } from '@/components/EventDetailsOptimized';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return (
      <AppLayout pageTitle="Error">
        <div className="flex flex-col items-center justify-center h-full text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">Invalid Event</h2>
          <p className="text-muted-foreground">No event ID provided.</p>
        </div>
      </AppLayout>
    );
  }

  const { data: event, isLoading, error } = useOptimizedEventDetails(id);

  if (isLoading) {
    return (
      <AppLayout pageTitle="Loading Event">
        <EventDetailsSkeleton />
      </AppLayout>
    );
  }

  if (error || !event) {
    return (
      <AppLayout pageTitle="Error">
        <div className="flex flex-col items-center justify-center h-full text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">Error Loading Event</h2>
          <p className="text-muted-foreground">
            {error?.message || 'The event could not be found.'}
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <ErrorBoundary>
      <AppLayout 
        pageTitle={event.title}
        pageDescription={event.description}
      >
        <SEOHead 
          title={event.title}
          description={event.description}
          type="event"
          image={event.imageUrl}
        />
        
        <StructuredData 
          type="Event" 
          data={{
            name: event.title,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            location: {
              name: event.location?.venue_name || event.location?.address || 'Unknown location',
              address: event.location?.address || 'Address not specified'
            },
            image: event.imageUrl,
            url: window.location.href
          }} 
        />
        
        <div className="min-h-screen bg-background section-spacing">
          <EventDetailsOptimized event={event} />
        </div>
      </AppLayout>
    </ErrorBoundary>
  );
};

export default EventDetails;
