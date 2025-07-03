
import { motion } from "framer-motion";
import { EventCard } from "../EventCard";
import { useUnifiedEvents } from "@/hooks/useUnifiedEvents";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export const FeaturedEvents = () => {
  const { data: events = [], isLoading, error } = useUnifiedEvents({
    featured: true,
    limit: 6,
    sortBy: 'start_date',
    sortOrder: 'asc'
  });

  console.log('🔄 FeaturedEvents - Loading:', isLoading, 'Events:', events.length, 'Error:', error);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gradient">Featured Events</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 bg-muted/20 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    console.error('❌ FeaturedEvents error:', error);
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gradient">Featured Events</h2>
        </div>
        <div className="glass-panel p-8 rounded-2xl text-center">
          <p className="text-destructive mb-2">Error loading featured events</p>
          <p className="text-muted-foreground text-sm">{error?.message || 'Please try again later'}</p>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    console.log('⚠️ No featured events found');
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gradient">Featured Events</h2>
        </div>
        <div className="glass-panel p-8 rounded-2xl text-center">
          <p className="text-muted-foreground">No featured events available at the moment.</p>
          <p className="text-muted-foreground text-sm mt-2">Check back later for exciting events!</p>
        </div>
      </section>
    );
  }

  console.log('✅ Rendering', events.length, 'featured events');

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gradient">Featured Events</h2>
        <Link to="/events">
          <Button variant="ghost" className="gap-2">
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <EventCard event={event} index={index} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
