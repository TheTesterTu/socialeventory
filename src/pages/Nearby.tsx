
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
  const [showPastEvents, setShowPastEvents] = useState(false);
  
  const { coordinates, isLoading: locationLoading, error: locationError } = useGeolocation();
  const { events, isLoading: eventsLoading, error: eventsError, fetchNearbyEvents } = useNearbyEvents();

  // Fetch events when location or filters change
  useEffect(() => {
    if (coordinates) {
      fetchNearbyEvents(coordinates.lat, coordinates.lng, radius, selectedDate, showPastEvents);
    }
  }, [coordinates, radius, selectedDate, showPastEvents]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const isLoading = locationLoading || eventsLoading;
  const error = locationError || eventsError;

  return (
    <AppLayout pageTitle="Events Near You" showTopBar={true}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-6"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Events Near You</h1>
              <p className="text-muted-foreground mt-1 text-sm lg:text-base">
                {coordinates 
                  ? `Showing events within ${radius}km of your location` 
                  : "Getting your location to show nearby events"
                }
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full lg:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-card/90 hover:bg-card border border-border/60 hover:border-primary/50 flex-1 lg:flex-none">
                    <Calendar className="h-4 w-4" />
                    <span className="truncate">{selectedDate ? format(selectedDate, 'MMM d') : 'Any date'}</span>
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
                variant={showPastEvents ? "default" : "outline"} 
                onClick={() => setShowPastEvents(!showPastEvents)}
                className="gap-2 bg-card/90 hover:bg-card border border-border/60 hover:border-primary/50 flex-1 lg:flex-none"
              >
                {showPastEvents ? 'Hide Past' : 'Show Past'}
              </Button>

              <Button 
                variant={showEventsList ? "default" : "outline"} 
                onClick={() => setShowEventsList(!showEventsList)}
                className="gap-2 bg-card/90 hover:bg-card border border-border/60 hover:border-primary/50 flex-1 lg:flex-none"
              >
                <MapPin className="h-4 w-4" />
                {showEventsList ? 'Show Map' : 'Show List'}
              </Button>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-destructive/10 border border-destructive/20 rounded-xl p-4"
          >
            <Alert variant="destructive" className="border-0 bg-transparent">
              <MapPin className="h-4 w-4" />
              <AlertDescription className="text-destructive font-medium">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {coordinates && (
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-4">
            <RadiusControl
              radius={radius}
              onRadiusChange={setRadius}
              eventsCount={events.length}
              selectedDate={selectedDate}
            />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg overflow-hidden"
        >
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="w-full h-[600px] rounded-xl" />
            </div>
          ) : showEventsList ? (
            <div className="p-4 lg:p-6">
              {events.length === 0 ? (
                <div className="text-center py-16">
                  <MapPin className="h-16 w-16 text-muted-foreground/40 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-3">No events found nearby</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Try increasing the search radius or selecting a different date to discover more events in your area.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Found {events.length} event{events.length !== 1 ? 's' : ''} nearby
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {events.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <EventCard event={event} index={index} variant="compact" />
                      </motion.div>
                    ))}
                  </div>
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
