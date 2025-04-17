import { motion, AnimatePresence } from "framer-motion";
import { MapPin, AlertCircle } from "lucide-react";
import EventMap from "@/components/EventMap";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { BackButton } from "@/components/navigation/BackButton";
import { useState, useEffect } from "react";
import { Event, AccessibilityInfo, Pricing } from "@/lib/types";
import { EventFilters } from "@/lib/types/filters";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/layout/AppLayout";

interface NearbyEventResponse {
  id: string;
  title: string;
  location: string;
  coordinates: { x: number; y: number };
  distance: number;
  category: string[];
  pricing: Pricing;
  accessibility: AccessibilityInfo;
  venue_name: string | null;
}

const Nearby = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [filters, setFilters] = useState<EventFilters>({
    accessibility: {
      wheelchairAccessible: false,
      familyFriendly: false,
    },
    pricing: {
      isFree: false,
      maxPrice: 100,
    }
  });

  const fetchNearbyEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Default to San Francisco coordinates if user location is not available
      const { data: eventsData, error } = await supabase
        .rpc('find_nearby_events', {
          lat: 37.7749,
          lon: -122.4194,
          radius_meters: 5000,
          category_filter: selectedCategories.length > 0 ? selectedCategories : null,
          max_price: filters.pricing?.maxPrice,
          accessibility_filter: filters.accessibility
        });

      if (error) throw error;

      const formattedEvents: Event[] = (eventsData as any[]).map(event => ({
        id: event.id,
        title: event.title,
        description: '', 
        location: {
          coordinates: [event.coordinates.y, event.coordinates.x] as [number, number],
          address: event.location,
          venue_name: event.venue_name || ''
        },
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        category: event.category,
        tags: [],
        accessibility: {
          languages: event.accessibility?.languages || ['en'],
          wheelchairAccessible: event.accessibility?.wheelchairAccessible || false,
          familyFriendly: event.accessibility?.familyFriendly || true,
        },
        pricing: {
          isFree: event.pricing?.isFree || true,
          priceRange: event.pricing?.priceRange as [number, number],
          currency: event.pricing?.currency,
        },
        creator: {
          id: '',
          type: 'user'
        },
        verification: {
          status: 'pending'
        },
        imageUrl: '',
        likes: 0,
        attendees: 0
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch nearby events. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to fetch nearby events. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyEvents();
  }, [selectedCategories, filters]);

  const handleSearch = (query: string) => {
    console.log("Searching nearby:", query);
    // TODO: Implement search filtering
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleFilterChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
  };

  return (
    <AppLayout pageTitle="Events Near You" showTopBar={true}>
      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex-1"
        >
          <p className="text-muted-foreground">Discover events happening around your location</p>
        </motion.div>

        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-6"
        >
          <SearchBar onSearch={handleSearch} />
          <SearchFilters
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-xl overflow-hidden h-[calc(100vh-280px)]">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <EventMap events={events} />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Nearby;
