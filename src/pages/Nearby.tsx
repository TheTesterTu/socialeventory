
import { motion } from "framer-motion";
import { MapPin, Calendar, Minus, Plus } from "lucide-react";
import EventMap from "@/components/EventMap";
import { useState, useEffect } from "react";
import { Event } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";

const Nearby = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 37.7749,
    lng: -122.4194
  });
  const [radius, setRadius] = useState<number>(5);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userCoords);
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
          category_filter: null,
          max_price: null,
          accessibility_filter: null
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
    if (userLocation) {
      fetchNearbyEvents(userLocation.lat, userLocation.lng);
    }
  }, [selectedDate, radius, userLocation]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const increaseRadius = () => {
    setRadius(prev => Math.min(prev + 1, 50));
  };

  const decreaseRadius = () => {
    setRadius(prev => Math.max(prev - 1, 1));
  };

  return (
    <AppLayout pageTitle="Events Near You" showTopBar={true}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative space-y-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between"
        >
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Events Near You</h1>
            <p className="text-muted-foreground">Discover events happening in your area</p>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <MapPin className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
          <span className="text-sm">
            Found {events.length} event{events.length !== 1 ? 's' : ''} within {radius} km
            {selectedDate && ` on ${format(selectedDate, 'MMMM d, yyyy')}`}
          </span>
          
          <div className="flex items-center gap-3 w-64">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7 rounded-full"
              onClick={decreaseRadius}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <Slider
              value={[radius]}
              min={1}
              max={50}
              step={1}
              onValueChange={(value) => setRadius(value[0])}
              className="w-full"
            />
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7 rounded-full"
              onClick={increaseRadius}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden h-[calc(100vh-280px)]">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <EventMap 
              events={events}
              showFilters={false}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Nearby;
