
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import EventMap from "@/components/EventMap";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNearbyEvents } from "@/hooks/useNearbyEvents";
import { RadiusControl } from "@/components/nearby/RadiusControl";

const Nearby = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [radius, setRadius] = useState<number>(5);
  
  const { coordinates, isLoading: locationLoading, error: locationError } = useGeolocation();
  const { events, isLoading: eventsLoading, error: eventsError, fetchNearbyEvents } = useNearbyEvents();

  // Fetch events when location or filters change
  useEffect(() => {
    if (coordinates) {
      fetchNearbyEvents(coordinates.lat, coordinates.lng, radius, selectedDate);
    }
  }, [coordinates, radius, selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const isLoading = locationLoading || eventsLoading;
  const error = locationError || eventsError;

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
            <p className="text-muted-foreground">
              {coordinates 
                ? `Showing events within ${radius}km of your location` 
                : "Getting your location to show nearby events"
              }
            </p>
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

        {coordinates && (
          <RadiusControl
            radius={radius}
            onRadiusChange={setRadius}
            eventsCount={events.length}
            selectedDate={selectedDate}
          />
        )}

        <div className="rounded-xl overflow-hidden h-[calc(100vh-280px)]">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <EventMap 
              events={events}
              showFilters={false}
              userLocation={coordinates ? [coordinates.lng, coordinates.lat] : undefined}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Nearby;
