
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockEvents } from "@/lib/mock-data";
import { Event } from "@/lib/types";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const EventsNearYou = () => {
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, we would use the browser's geolocation API
    // and fetch events near the user's location
    // For now, we'll just show random events
    setNearbyEvents(mockEvents.slice(0, 3));
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: "Getting your location...",
        description: "This may take a few seconds.",
      });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          
          toast({
            title: "Location found!",
            description: "Now showing events near you.",
          });
          
          // In a real app, we would fetch events near this location
          // For now, we'll just navigate to the nearby page
          navigate("/nearby");
        },
        (error) => {
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
          className="flex items-center gap-1"
        >
          <MapPin className="h-4 w-4" />
          <span>Get Location</span>
        </Button>
      </div>
      
      <div className="glass-panel relative rounded-xl overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <img 
          src="https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-s+8B5CF6(-73.9857,40.7484),pin-s+8B5CF6(-73.9657,40.7584),pin-s+8B5CF6(-73.9957,40.7384)/-73.9857,40.7484,11.5/800x200@2x?access_token=pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHFrazlmam8wMXlnMnFxcWV6OXZ2MnFqIn0.n7ZZPfC3JG0Vl-xSQyzkww"
          alt="Map with events near you"
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
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
