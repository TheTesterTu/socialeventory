
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockEvents } from "@/lib/mock-data";
import { Calendar, Users } from "lucide-react";
import { Event } from "@/lib/types";
import { format, isPast, isToday, addDays, isFuture } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventCard } from "@/components/EventCard";

export const UpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get upcoming events (future events)
    const today = new Date();
    const filtered = mockEvents
      .filter(event => {
        const eventDate = new Date(event.startDate);
        return isFuture(eventDate) || isToday(eventDate);
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 4);
    
    setUpcomingEvents(filtered);
  }, []);

  const getEventStatusClass = (date: string) => {
    const eventDate = new Date(date);
    if (isToday(eventDate)) return "text-primary font-medium";
    if (isPast(eventDate)) return "text-muted-foreground";
    // Fix here: remove the second argument from isPast
    if (isFuture(eventDate) && !isPast(addDays(new Date(), 3))) 
      return "text-orange-500 font-medium";
    return "text-foreground";
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (id: string) => {
    setIsDialogOpen(false);
    navigate(`/event/${id}`);
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
      
      <div className="glass-panel p-4 rounded-xl space-y-4">
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
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{event.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={getEventStatusClass(event.startDate)}>
                  {format(new Date(event.startDate), "E, ha")}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {event.attendees}
                </span>
              </div>
              <div className="flex gap-1 mt-1 flex-wrap">
                {event.category.slice(0, 2).map(cat => (
                  <Badge key={cat} variant="outline" className="text-xs py-0">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => navigate("/search")}
        >
          See All Events
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedEvent && (
            <div className="space-y-4">
              <div className="relative h-40 overflow-hidden rounded-t-lg">
                <img 
                  src={selectedEvent.imageUrl} 
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
