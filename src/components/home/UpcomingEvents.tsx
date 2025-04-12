
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockEvents } from "@/lib/mock-data";
import { Calendar, Users } from "lucide-react";
import { Event } from "@/lib/types";
import { format, isPast, isToday, addDays, isFuture } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export const UpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
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
    if (isFuture(eventDate) && !isPast(addDays(new Date(), 3), eventDate)) 
      return "text-orange-500 font-medium";
    return "text-foreground";
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
            onClick={() => navigate(`/event/${event.id}`)}
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
    </motion.div>
  );
};
