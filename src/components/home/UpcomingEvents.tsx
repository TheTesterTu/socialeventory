
import { motion } from "framer-motion";
import { EventCardGlass } from "../EventCardGlass";
import { useUnifiedEvents } from "@/hooks/useUnifiedEvents";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useMemo } from "react";

export const UpcomingEvents = () => {
  const { data: allEvents = [], isLoading } = useUnifiedEvents({
    limit: 20,
    sortBy: 'start_date',
    sortOrder: 'asc'
  });

  // Filter for upcoming events on the client side
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return allEvents
      .filter(event => new Date(event.startDate) > now)
      .slice(0, 4);
  }, [allEvents]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 bg-muted/20 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
        </div>
        <div className="glass-panel p-6 rounded-xl text-center">
          <p className="text-muted-foreground text-sm">No upcoming events found.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
        </div>
        <Link to="/events">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View all
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
      
      <div className="space-y-3">
        {upcomingEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <EventCardGlass 
              event={event} 
              showSocialActions={false}
              className="hover:scale-[1.02] transition-transform"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
