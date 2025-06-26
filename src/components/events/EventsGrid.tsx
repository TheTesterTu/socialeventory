
import { Event } from "@/lib/types";
import { EventCard } from "../EventCard";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";

interface EventsGridProps {
  events: Event[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const EventsGrid = ({ 
  events, 
  isLoading = false, 
  emptyMessage = "No events found",
  className = ""
}: EventsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-80 bg-muted/20 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <Filter className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-xl font-medium mb-2">No events found</h3>
        <p className="text-muted-foreground max-w-md">
          {emptyMessage}
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <EventCard event={event} index={index} />
        </motion.div>
      ))}
    </div>
  );
};
