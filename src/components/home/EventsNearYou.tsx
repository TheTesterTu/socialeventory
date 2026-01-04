
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Event } from "@/lib/types";
import { MapPin, Loader2, ArrowRight, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseEventToEvent } from "@/lib/utils/mappers";
import { ModernEventCard } from "./ModernEventCard";

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

      const formattedEvents: Event[] = (eventsData as any[] || []).slice(0, 4).map(mapDatabaseEventToEvent);

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
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(4);

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
    <section className="section-spacing">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-primary font-medium text-sm">Location-based</span>
              </div>
              <h2 className="text-headline text-3xl md:text-4xl">
                Events near you
              </h2>
              <p className="text-muted-foreground text-lg">
                {userLocation 
                  ? `Showing events within 50km` 
                  : 'Enable location to see nearby events'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleGetLocation}
                disabled={isLoading}
                className="btn-outline"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Navigation className="h-4 w-4 mr-2" />
                )}
                {userLocation ? "Update" : "Enable location"}
              </Button>
              <Link to="/nearby">
                <Button variant="ghost" className="btn-ghost gap-2 hover:gap-3 transition-all">
                  View map
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Events grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : nearbyEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nearbyEvents.map((event, index) => (
                <ModernEventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="card-modern p-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">No events found nearby</p>
              <p className="text-muted-foreground text-sm mt-1">Try expanding your search area</p>
              <Button 
                onClick={() => navigate("/events")}
                className="btn-primary mt-6"
              >
                Browse all events
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
