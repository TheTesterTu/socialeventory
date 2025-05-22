
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockEvents } from "@/lib/mock-data";
import { EventCard } from "@/components/EventCard";
import { TrendingUp, Sparkles } from "lucide-react";
import { Event } from "@/lib/types";

export const FeaturedEvents = () => {
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [newEvents, setNewEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Get top 2 events for each section
    setTrendingEvents(mockEvents.slice(0, 2));
    setNewEvents(mockEvents.slice(2, 4));
  }, []);

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-[400px]"
            >
              <EventCard {...event} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Just Added</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-[400px]"
            >
              <EventCard {...event} />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
