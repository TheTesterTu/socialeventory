
import { motion } from "framer-motion";
import { EventCard } from "@/components/EventCard";
import { TrendingUp, Sparkles } from "lucide-react";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { memo } from "react";
// Event type can be imported if EventCard requires it explicitly, or if we map data here
// import { Event } from "@/lib/types";
import { useFeaturedEvents } from "@/hooks/useEvents";
import { EventCardSkeleton } from "@/components/EventCardSkeleton";
// Removed supabase and useToast imports as they are no longer directly used

const FeaturedEventsContent = memo(() => {
  const { data: events, isLoading, error, refetch } = useFeaturedEvents();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Featured Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[300px] md:h-[350px]">
                <EventCardSkeleton />
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    );
  }

  if (error) {
    return <ErrorFallback error={error as Error} resetError={refetch} />;
  }

  if (!events || events.length === 0) {
    return (
      <div className="space-y-6">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Featured Events</h2>
          </div>
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No featured events available at the moment.</p>
            <p className="text-sm">Check back later for exciting events!</p>
          </div>
        </motion.section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" /> {/* Changed Icon to Sparkles for consistency */}
          <h2 className="text-xl font-semibold">Featured Events</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-[300px] md:h-[350px]"
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      </motion.section>
      {/* Removed the "Just Added" section as per simplification strategy */}
    </div>
  );
});

FeaturedEventsContent.displayName = "FeaturedEventsContent";

export const FeaturedEvents = () => {
  return (
    <ErrorBoundary>
      <FeaturedEventsContent />
    </ErrorBoundary>
  );
};
