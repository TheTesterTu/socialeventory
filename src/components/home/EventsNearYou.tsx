
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Event } from "@/lib/types";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const EventsNearYou = () => {
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Try to get user location automatically
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          fetchNearbyEvents(coords.lat, coords.lng);
        },
        () => {
          // If geolocation fails, show some default events
          fetchDefaultEvents();
        }
      );
    } else {
      fetchDefaultEvents();
    }
  }, []);

  const fetchNearbyEvents = async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      
      const { data: eventsData, error } = await supabase
        .rpc('find_nearby_events', {
          lat: lat,
          lon: lng,
          radius_meters: 50000, // 50km radius
          category_filter: null,
          max_price: null,
          accessibility_filter: null
        });

      if (error) throw error;

      const formattedEvents: Event[] = (eventsData as any[] || []).slice(0, 3).map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        location: {
          coordinates: event.coordinates ? [event.coordinates.x, event.coordinates.y] as [number, number] : [0, 0],
          address: event.location || '',
          venue_name: event.venue_name || ''
        },
        category: event.category || [],
        tags: event.tags || [],
        accessibility: event.accessibility || {
          languages: ['en'],
          wheelchairAccessible: false,
          familyFriendly: true
        },
        pricing: event.pricing || { isFree: true },
        creator: {
          id: event.created_by || '',
          type: 'user'
        },
        verification: {
          status: 'verified'
        },
        imageUrl: event.image_url || '',
        likes: event.likes || 0,
        attendees: event.attendees || 0
      }));

      setNearbyEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching nearby events:', error);
      fetchDefaultEvents();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDefaultEvents = async () => {
    try {
      setIsLoading(true);
      
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .limit(3);

      if (error) throw error;

      const formattedEvents: Event[] = (eventsData || []).map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        startDate: event.start_date,
        endDate: event.end_date,
        location: {
          coordinates: event.coordinates ? [event.coordinates.x, event.coordinates.y] as [number, number] : [0, 0],
          address: event.location || '',
          venue_name: event.venue_name || ''
        },
        category: event.category || [],
        tags: event.tags || [],
        accessibility: event.accessibility || {
          languages: ['en'],
          wheelchairAccessible: false,
          familyFriendly: true
        },
        pricing: event.pricing || { isFree: true },
        creator: {
          id: event.created_by || '',
          type: 'user'
        },
        verification: {
          status: event.verification_status || 'pending'
        },
        imageUrl: event.image_url || '',
        likes: event.likes || 0,
        attendees: event.attendees || 0
      }));

      setNearbyEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching default events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      toast({
        title: "Getting your location...",
        description: "This may take a few seconds.",
      });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          
          toast({
            title: "Location found!",
            description: "Now showing events near you.",
          });
          
          fetchNearbyEvents(coords.lat, coords.lng);
        },
        (error) => {
          setIsLoading(false);
          toast({
            title: "Error getting location",
            description: error.message,
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Near You</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGetLocation}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          <span>{userLocation ? "Update Location" : "Get Location"}</span>
        </Button>
      </div>
      
      <div className="glass-panel relative rounded-xl overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {nearbyEvents.length > 0 && nearbyEvents[0].location.coordinates[0] !== 0 ? (
          <img 
            src={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-s+8B5CF6(${nearbyEvents[0].location.coordinates[1]},${nearbyEvents[0].location.coordinates[0]})/auto/800x200@2x?access_token=pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHFrazlmam8wMXlnMnFxcWV6OXZ2MnFqIn0.n7ZZPfC3JG0Vl-xSQyzkww`}
            alt="Map with events near you"
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">
                {isLoading ? "Finding events near you..." : "No events found nearby"}
              </p>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <div className="mb-2">
            {nearbyEvents.length > 0 && (
              <p className="text-white text-sm font-medium">
                {nearbyEvents.length} event{nearbyEvents.length !== 1 ? 's' : ''} found
                {userLocation && ' in your area'}
              </p>
            )}
          </div>
          <Button 
            onClick={() => navigate("/nearby")}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Explore Nearby Events
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
