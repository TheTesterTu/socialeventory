
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event, AccessibilityInfo, Pricing } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { EventDetailsSkeleton } from "@/components/EventDetailsSkeleton";
import { EventDetailsContainer } from "@/components/EventDetailsContainer";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!id || !uuidRegex.test(id)) {
          throw new Error("Invalid event ID format");
        }

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
          .single();

        if (error) throw error;

        if (data) {
          const coordinates = data.coordinates as { x: number; y: number };
          
          // Type assertion with validation for accessibility
          const rawAccessibility = data.accessibility as Record<string, unknown>;
          const accessibility: AccessibilityInfo = {
            languages: Array.isArray(rawAccessibility?.languages) ? rawAccessibility.languages : ['en'],
            wheelchairAccessible: Boolean(rawAccessibility?.wheelchairAccessible),
            familyFriendly: Boolean(rawAccessibility?.familyFriendly)
          };

          // Type assertion with validation for pricing
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
              id: data.created_by,
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
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load event details. Please check the event ID and try again.",
          variant: "destructive"
        });
        navigate('/'); // Redirect to home page on error
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

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
    <div className="min-h-screen p-6">
      <Button 
        onClick={() => navigate(-1)} 
        variant="outline" 
        size="lg" 
        className="mb-4 gap-2 hover:scale-105 transition-transform"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </Button>
      
      <EventDetailsContainer event={event} />
    </div>
  );
};

export default EventDetails;
