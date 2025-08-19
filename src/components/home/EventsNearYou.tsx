
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Event } from "@/lib/types";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseEventToEvent } from "@/lib/utils/mappers";

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

      const formattedEvents: Event[] = (eventsData as any[] || []).slice(0, 3).map(mapDatabaseEventToEvent);

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

      const formattedEvents: Event[] = (eventsData || []).map(mapDatabaseEventToEvent);

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
          <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-border/20 overflow-hidden relative">
            {/* Map background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                <pattern id="map-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
                <rect width="100" height="100" fill="url(#map-grid)" />
              </svg>
            </div>
            
            {/* Event markers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {nearbyEvents.slice(0, 6).map((event, index) => {
                  const row = Math.floor(index / 3);
                  const col = index % 3;
                  const x = 25 + col * 25; // 25%, 50%, 75%
                  const y = 35 + row * 30; // 35%, 65%
                  
                  return (
                    <div
                      key={event.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div className="relative">
                        <MapPin 
                          className="h-6 w-6 text-primary drop-shadow-lg transition-all duration-200 group-hover:scale-110 animate-pulse" 
                          fill="currentColor"
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {event.title.length > 15 ? `${event.title.slice(0, 15)}...` : event.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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
