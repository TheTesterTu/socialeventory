
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockEvents } from "@/lib/mock-data";
import { EventCard } from "@/components/EventCard";
import { Sparkles, TrendingUp } from "lucide-react";
import { Event } from "@/lib/types";
import { Card } from "@/components/ui/card";

export const FeaturedEvents = () => {
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [newEvents, setNewEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Get top 2 trending events
    const sortedByLikes = [...mockEvents].sort((a, b) => b.likes - a.likes).slice(0, 2);
    setTrendingEvents(sortedByLikes);

    // Get newest 2 events
    const sortedByDate = [...mockEvents]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 2);
    setNewEvents(sortedByDate);
  }, []);

  return (
    <div className="space-y-12 px-4 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {trendingEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
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
        className="space-y-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Just Added</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {newEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
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
