
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event, AccessibilityInfo, Pricing } from "@/lib/types";
import { toast } from "sonner";
import { EventDetailsSkeleton } from "@/components/EventDetailsSkeleton";
import { LazyEventDetails } from "@/components/LazyEventDetails";
import { getEventById } from "@/lib/mock-data";
import { SEOHead } from "@/components/seo/SEOHead";
import { StructuredData } from "@/components/seo/StructuredData";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { usePagePerformance } from "@/hooks/usePagePerformance";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useErrorHandler();
  
  // Track page performance
  const { trackCustomMetric } = usePagePerformance({
    pageName: 'Event Details',
    trackCoreWebVitals: true
  });

  useEffect(() => {
    const fetchEvent = async () => {
      const fetchStart = performance.now();
      
      try {
        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!id || !uuidRegex.test(id)) {
          throw new Error("Invalid event ID format");
        }

        // Try to get from the database first
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            profiles:created_by (
              username,
              avatar_url
            )
          `)
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;

        // If the event is not found in the database, try to get it from mock data
        if (!data) {
          const mockEvent = getEventById(id);
          
          if (!mockEvent) {
            toast.error("Event not found", {
              description: "The event you're looking for doesn't exist or has been removed."
            });
            navigate('/');
            return;
          }
          
          setEvent(mockEvent);
          setIsLoading(false);
          return;
        }

        const coordinates = data.coordinates as { x: number; y: number };
        
        // Type assertion with validation for accessibility
        const rawAccessibility = data.accessibility as Record<string, unknown>;
        const accessibility: AccessibilityInfo = {
          languages: Array.isArray(rawAccessibility?.languages) ? rawAccessibility.languages : ['en'],
          wheelchairAccessible: Boolean(rawAccessibility?.wheelchairAccessible),
          familyFriendly: Boolean(rawAccessibility?.familyFriendly)
        };

        const rawPricing = data.pricing as Record<string, unknown>;
        const pricing: Pricing = {
          isFree: Boolean(rawPricing?.isFree),
          priceRange: Array.isArray(rawPricing?.priceRange) ? rawPricing.priceRange as [number, number] : undefined,
          currency: typeof rawPricing?.currency === 'string' ? rawPricing.currency : undefined
        };

        const verification_status = data.verification_status as 'pending' | 'verified' | 'featured';

        const formattedEvent: Event = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          location: {
            coordinates: coordinates ? [coordinates.x, coordinates.y] : [0, 0],
            address: data.location,
            venue_name: data.venue_name || ''
          },
          startDate: data.start_date,
          endDate: data.end_date,
          category: data.category || [],
          tags: data.tags || [],
          accessibility,
          pricing,
          creator: {
            id: data.created_by || '',
            type: 'user'
          },
          verification: {
            status: verification_status || 'pending'
          },
          imageUrl: data.image_url || '',
          likes: data.likes || 0,
          attendees: data.attendees || 0
        };
        
        setEvent(formattedEvent);
        
        // Track event load time
        const fetchTime = performance.now() - fetchStart;
        trackCustomMetric('Event Fetch Time', fetchTime);
        
      } catch (error) {
        handleError(error as Error, 'Event Details Fetch');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, navigate, handleError, trackCustomMetric]);

  if (isLoading) {
    return <EventDetailsSkeleton />;
  }

  if (!event) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button onClick={() => navigate(-1)} variant="outline" size="lg" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SEOHead 
        title={`${event.title} | SocialEventory`}
        description={event.description}
        image={event.imageUrl}
        type="article"
      />
      
      <StructuredData type="Event" data={event} />
      
      <div className="min-h-screen p-6 max-w-screen-2xl mx-auto">
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline" 
          size="lg" 
          className="mb-4 gap-2 hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Button>
        
        <LazyEventDetails event={event} />
      </div>
    </ErrorBoundary>
  );
};

export default EventDetails;
