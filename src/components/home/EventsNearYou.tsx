
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// Event type might not be needed directly if relying on hook's data type
// import { Event } from "@/lib/types";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useNearbyEvents } from "@/hooks/useNearbyEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const EventsNearYou = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocationButton, setIsLoadingLocationButton] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: nearbyEvents,
    isLoading: isLoadingEvents,
    error: eventsError,
    // refetch: refetchNearbyEvents // Can be used if a manual refresh button is added
  } = useNearbyEvents({
    latitude: userLocation?.lat,
    longitude: userLocation?.lng,
    radiusKm: 50, // Match original 50km
    enabled: !!userLocation, // Only run query if userLocation is set
  });

  useEffect(() => {
    // Try to get user location automatically on mount if not already set
    if (!userLocation && navigator.geolocation) {
      setIsLoadingLocationButton(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          setIsLoadingLocationButton(false);
          toast({
            title: "Location automatically detected",
            description: "Showing events near you.",
          });
        },
        () => {
          setIsLoadingLocationButton(false);
          toast({
            title: "Location access denied or unavailable",
            description: "Please manually enable location or use the 'Get Location' button.",
            variant: "default",
          });
          // User location remains null, hook won't run until manually triggered
        }
      );
    }
  }, []); // Run once on mount if userLocation is not already there

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsLoadingLocationButton(true);
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
          setUserLocation(coords); // This will trigger the useNearbyEvents hook via enabled or queryKey change
          setIsLoadingLocationButton(false);
          toast({
            title: "Location updated!",
            description: "Now showing events near you.",
          });
        },
        (error) => {
          setIsLoadingLocationButton(false);
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

  const renderMapImage = () => {
    if (nearbyEvents && nearbyEvents.length > 0 && nearbyEvents[0].location.coordinates[0] !== 0) {
      return (
        <img
          src={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-s+8B5CF6(${nearbyEvents[0].location.coordinates[1]},${nearbyEvents[0].location.coordinates[0]})/auto/800x200@2x?access_token=pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHFrazlmam8wMXlnMnFxcWV6OXZ2MnFqIn0.n7ZZPfC3JG0Vl-xSQyzkww`}
          alt="Map with events near you"
          className="w-full h-48 object-cover"
        />
      );
    }
    return (
      <div className="w-full h-48 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">
            {isLoadingEvents ? "Finding events near you..." : (userLocation ? "No events found for your location." : "Provide location to see nearby events.")}
          </p>
        </div>
      </div>
    );
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
          disabled={isLoadingLocationButton}
          className="flex items-center gap-1"
        >
          {isLoadingLocationButton ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          <span>{userLocation ? "Update Location" : "Get Location"}</span>
        </Button>
      </div>

      {isLoadingEvents && !eventsError && (
        <div className="glass-panel relative rounded-xl overflow-hidden">
          <Skeleton className="w-full h-48" /> {/* Map Image Skeleton */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 z-10" />
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-background/90 via-background/70 to-transparent pt-12">
            <Skeleton className="h-4 w-1/3 mb-3 rounded" /> {/* Event count text skeleton */}
            <Skeleton className="h-10 w-full rounded-md" /> {/* Button skeleton */}
          </div>
        </div>
      )}

      {eventsError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not load nearby events. {eventsError.message}
          </AlertDescription>
        </Alert>
      )}

      {!isLoadingEvents && !eventsError && (
        <div className="glass-panel relative rounded-xl overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          {renderMapImage()}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <div className="mb-2">
              {(!userLocation && !isLoadingLocationButton) && (
                 <p className="text-white text-sm font-medium">
                   Click "Get Location" to see events near you.
                 </p>
              )}
              {(userLocation && nearbyEvents) && (
                <p className="text-white text-sm font-medium">
                  {nearbyEvents.length} event{nearbyEvents.length !== 1 ? 's' : ''} found
                  {userLocation && ' in your area (approx 50km radius)'}
                </p>
              )}
               {(userLocation && !nearbyEvents && !isLoadingEvents) && (
                 <p className="text-white text-sm font-medium">
                   No events found within 50km of your location.
                 </p>
              )}
            </div>
            <Button
              onClick={() => navigate("/nearby")}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!userLocation || !nearbyEvents || nearbyEvents.length === 0}
            >
              Explore Nearby Events
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
