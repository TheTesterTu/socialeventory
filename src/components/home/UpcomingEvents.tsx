
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";
import { Event } from "@/lib/types";
import { format, isPast, isToday, addDays, isFuture } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
// EventCard might not be needed if the dialog shows its own details or if EventCard is used within it
// import { EventCard } from "@/components/EventCard";
// supabase and useToast are removed as data fetching and error handling will be managed by the hook
// mapDatabaseEventToEvent is also not needed here as the hook handles it
import { useUpcomingEvents } from "@/hooks/useEvents";
import { UpcomingEventItemSkeleton } from "@/components/home/UpcomingEventItemSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";


export const UpcomingEvents = () => {
  // selectedEvent and isDialogOpen are kept for the modal functionality
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data: hookUpcomingEvents,
    isLoading,
    error,
    refetch
  } = useUpcomingEvents(); // Uses default daysAhead=7, limit=4

  // Ensure upcomingEvents is always an array to prevent errors in .map()
  const upcomingEvents = hookUpcomingEvents || [];

  const getEventStatusClass = (date: string) => {
    const eventDate = new Date(date);
    if (isToday(eventDate)) return "text-primary font-medium";
    if (isPast(eventDate)) return "text-muted-foreground"; // Should not happen with current hook logic
    if (isFuture(eventDate) && !isPast(addDays(new Date(), 3))) 
      return "text-orange-500 font-medium"; // Highlight if within next 3 days
    return "text-foreground";
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (id: string) => {
    setIsDialogOpen(false);
    navigate(`/events/${id}`); // Corrected path to /events/:id
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="glass-panel p-4 rounded-xl space-y-3">
          {[...Array(4)].map((_, i) => ( // Assuming limit is 4
            <UpcomingEventItemSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="glass-panel p-4 rounded-xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load upcoming events.
              <Button variant="link" onClick={() => refetch()} className="p-0 h-auto ml-1 inline">
                Try again
              </Button>.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    if (upcomingEvents.length === 0) {
      return (
        <div className="glass-panel p-4 rounded-xl">
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No upcoming events found for the next 7 days.</p>
            <p className="text-sm">Check back later or explore all events.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="glass-panel p-4 rounded-xl space-y-4"> {/* space-y-4 for item separation */}
        {upcomingEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-4 hover:bg-background/50 p-2 rounded-lg transition-colors cursor-pointer"
            onClick={() => handleEventClick(event)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-muted/50 rounded-lg p-2 w-12 h-12 flex flex-col items-center justify-center text-center flex-shrink-0">
              <span className="text-xs text-muted-foreground">
                {format(new Date(event.startDate), "MMM")}
              </span>
              <span className="text-lg font-bold">
                {format(new Date(event.startDate), "dd")}
              </span>
            </div>

            <div className="flex-1 min-w-0"> {/* min-w-0 for proper truncation */}
              <h3 className="font-medium text-sm truncate">{event.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={getEventStatusClass(event.startDate)}>
                  {format(new Date(event.startDate), "E, ha")}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {event.attendees || 0} {/* Default to 0 if undefined */}
                </span>
              </div>
              <div className="flex gap-1 mt-1 flex-wrap">
                {event.category?.slice(0, 2).map(cat => (
                  <Badge key={cat} variant="outline" className="text-xs py-0 px-1"> {/* Adjusted padding */}
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
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
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Coming Up</h2>
      </div>
      
      {renderContent()}

      {/* "See All Events" button is outside the conditional rendering of content list */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => navigate("/search")} // Navigate to general search page
      >
        See All Events
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedEvent && (
            <div className="space-y-4">
              <div className="relative h-40 overflow-hidden rounded-t-lg">
                <img 
                  src={selectedEvent.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'} 
                  alt={selectedEvent.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>
              <div className="p-2">
                <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                  {selectedEvent.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(selectedEvent.startDate), "PPP p")}</span>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => handleViewDetails(selectedEvent.id)}>
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
