
import { motion } from "framer-motion";
import { EventCard } from "../EventCard";
import { useUnifiedEvents } from "@/hooks/useUnifiedEvents";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export const PersonalizedEvents = () => {
  const { user } = useAuth();
  const { data: events = [], isLoading } = useUnifiedEvents({
    limit: 6,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  if (!user) return null;

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-gradient">Recommended for You</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 bg-muted/20 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-gradient">Recommended for You</h2>
          </div>
        </div>
        <div className="glass-panel p-8 rounded-2xl text-center">
          <p className="text-muted-foreground">No personalized recommendations available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold text-gradient">Recommended for You</h2>
        </div>
        <Link to="/events">
          <Button variant="ghost" className="gap-2">
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.slice(0, 6).map((event, index) => (
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
