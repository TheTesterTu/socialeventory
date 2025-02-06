
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import EventMap from "@/components/EventMap";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { BackButton } from "@/components/navigation/BackButton";
import { useState, useEffect } from "react";
import { Event } from "@/lib/types";
import { EventFilters } from "@/lib/types/filters";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Nearby = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      // Default to San Francisco coordinates if user location is not available
      const { data: eventsData, error } = await supabase
        .rpc('find_nearby_events', {
          lat: 37.7749,
          lon: -122.4194,
          radius_meters: 5000,
          category_filter: selectedCategories.length > 0 ? selectedCategories : null,
          max_price: filters.pricing.maxPrice,
          accessibility_filter: filters.accessibility
        });

      if (error) throw error;

      const formattedEvents: Event[] = eventsData.map(event => ({
        id: event.id,
        title: event.title,
        description: '', // We can fetch full details when needed
        location: {
          coordinates: [event.coordinates.x, event.coordinates.y],
          address: event.location,
          venue_name: event.venue_name || ''
        },
        startDate: new Date().toISOString(), // We'll need to add these to the function response
        endDate: new Date().toISOString(),
        category: event.category,
        tags: [],
        accessibility: event.accessibility,
        pricing: event.pricing,
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 pt-20 pb-24 md:pt-6 relative"
    >
      <BackButton />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Events Near You</h1>
        <p className="text-muted-foreground">Discover events happening around your location</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <SearchBar onSearch={handleSearch} />
        <SearchFilters
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="rounded-xl overflow-hidden h-[calc(100vh-280px)]">
        <EventMap events={events} />
      </div>
    </motion.div>
  );
};

export default Nearby;
