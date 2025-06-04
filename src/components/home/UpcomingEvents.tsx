
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";
import { Event } from "@/lib/types";
import { format, isPast, isToday, addDays, isFuture } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventCard } from "@/components/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { mapDatabaseEventToEvent } from "@/lib/utils/mappers";

export const UpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      setIsLoading(true);
      const now = new Date().toISOString();
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', now)
        .lte('start_date', nextWeek)
        .order('start_date', { ascending: true })
        .limit(4);

      if (error) throw error;

      const formattedEvents: Event[] = (eventsData || []).map(mapDatabaseEventToEvent);

      setUpcomingEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch upcoming events",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEventStatusClass = (date: string) => {
    const eventDate = new Date(date);
    if (isToday(eventDate)) return "text-primary font-medium";
    if (isPast(eventDate)) return "text-muted-foreground";
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

  if (isLoading) {
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
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-start gap-4">
              <div className="bg-muted rounded-lg w-12 h-12 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

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
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No upcoming events found</p>
            <p className="text-sm">Try adding some sample events from the admin panel</p>
          </div>
        ) : (
          upcomingEvents.map((event) => (
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
          ))
        )}
        
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
