
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
import { EventCard } from "@/components/EventCard";

const Nearby = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [radius, setRadius] = useState<number>(5);
  const [showEventsList, setShowEventsList] = useState(false);
  
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Events Near You</h1>
            <p className="text-muted-foreground mt-1">
              {coordinates 
                ? `Showing events within ${radius}km of your location` 
                : "Getting your location to show nearby events"
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 bg-white/80 backdrop-blur-sm">
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

            <Button 
              variant={showEventsList ? "default" : "outline"} 
              onClick={() => setShowEventsList(!showEventsList)}
              className="gap-2 bg-white/80 backdrop-blur-sm"
            >
              <MapPin className="h-4 w-4" />
              {showEventsList ? 'Show Map' : 'Show List'}
            </Button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl overflow-hidden"
        >
          {isLoading ? (
            <Skeleton className="w-full h-[600px]" />
          ) : showEventsList ? (
            <div className="space-y-6">
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No events found nearby</h3>
                  <p className="text-muted-foreground">
                    Try increasing the search radius or selecting a different date
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <EventCard event={event} index={index} variant="compact" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-[600px]">
              <EventMap 
                events={events}
                showFilters={false}
                userLocation={coordinates ? [coordinates.lng, coordinates.lat] : undefined}
              />
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Nearby;
