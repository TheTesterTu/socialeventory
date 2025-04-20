import { motion, AnimatePresence } from "framer-motion";
import { MapPin, AlertCircle, Search } from "lucide-react";
import EventMap from "@/components/EventMap";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { useState, useEffect } from "react";
import { Event, AccessibilityInfo, Pricing } from "@/lib/types";
import { EventFilters } from "@/lib/types/filters";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/layout/AppLayout";
import { LocationSearch } from "@/components/LocationSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

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
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 37.7749, // Default to San Francisco
    lng: -122.4194
  });
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [radius, setRadius] = useState<number>(5);
  const [filters, setFilters] = useState<EventFilters>({
    accessibility: {
      wheelchairAccessible: false,
      familyFriendly: false,
    },
    pricing: {
      isFree: false,
      maxPrice: 100,
    },
    location: {
      radius: 5000,
      coordinates: [37.7749, -122.4194]
    }
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userCoords);
          setFilters(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: [userCoords.lat, userCoords.lng]
            }
          }));
          fetchNearbyEvents(userCoords.lat, userCoords.lng);
        },
        (error) => {
          console.error('Geolocation error:', error);
          fetchNearbyEvents(userLocation.lat, userLocation.lng);
        }
      );
    } else {
      fetchNearbyEvents(userLocation.lat, userLocation.lng);
    }
  }, []);

  const fetchNearbyEvents = async (lat: number, lon: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const radiusMeters = radius * 1000; // Convert km to meters
      
      const { data: eventsData, error } = await supabase
        .rpc('find_nearby_events', {
          lat: lat,
          lon: lon,
          radius_meters: radiusMeters,
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

      const filteredEvents = searchQuery 
        ? formattedEvents.filter(event => 
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.location.venue_name && event.location.venue_name.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : formattedEvents;

      setEvents(filteredEvents);
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
    if (filters.location?.coordinates) {
      fetchNearbyEvents(
        filters.location.coordinates[0], 
        filters.location.coordinates[1]
      );
    }
  }, [selectedCategories, filters, radius, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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

  const handleLocationSelect = (address: string, coordinates: [number, number]) => {
    setSearchLocation(address);
    setFilters(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: coordinates
      }
    }));
  };

  const handleRadiusChange = (value: number[]) => {
    setRadius(value[0]);
    setFilters(prev => ({
      ...prev,
      location: {
        ...prev.location,
        radius: value[0] * 1000 // Convert km to meters
      }
    }));
  };

  return (
    <AppLayout pageTitle="Events Near You" showTopBar={true}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
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
          className="mb-6 space-y-4"
        >
          <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
            <div className="w-full md:flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <SearchFilters
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="glass-panel p-4 rounded-xl">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Location Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Search Location</label>
                <div className="relative">
                  <LocationSearch 
                    value={searchLocation}
                    onChange={setSearchLocation}
                    onLocationSelect={handleLocationSelect}
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Radius: {radius} km
                </label>
                <div className="px-2 py-4">
                  <Slider 
                    defaultValue={[radius]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={handleRadiusChange}
                  />
                </div>
              </div>
            </div>
          </div>
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

        <div className="bg-muted/20 p-2 mb-4 rounded-lg">
          <p className="text-sm text-center">
            Found {events.length} event{events.length !== 1 ? 's' : ''} within {radius} km
          </p>
        </div>

        <div className="rounded-xl overflow-hidden h-[calc(100vh-380px)] mb-8">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <EventMap 
              events={events} 
              showFilters={true}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Nearby;
