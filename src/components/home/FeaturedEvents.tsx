
import { motion } from "framer-motion";
import { EventCard } from "@/components/EventCard";
import { TrendingUp, Sparkles } from "lucide-react";
import { useOptimizedEvents } from "@/hooks/useOptimizedEvents";
import { PageLoader } from "@/components/loading/PageLoader";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { memo } from "react";

const FeaturedEventsContent = memo(() => {
  const { 
    events: featuredEvents, 
    isLoading: featuredLoading, 
    error: featuredError,
    refetch: refetchFeatured 
  } = useOptimizedEvents({ featured: true, limit: 2 });
  
  const { 
    events: allEvents, 
    isLoading: allLoading, 
    error: allError,
    refetch: refetchAll 
  } = useOptimizedEvents({ limit: 4 });

  const isLoading = featuredLoading || allLoading;
  const error = featuredError || allError;

  if (error) {
    return (
      <ErrorFallback 
        error={error as Error} 
        resetError={() => {
          refetchFeatured();
          refetchAll();
        }}
      />
    );
  }

  if (isLoading) {
    return <PageLoader message="Loading featured events..." />;
  }

  // Fallback to recent events if no featured events
  const trendingEvents = featuredEvents?.length ? 
    featuredEvents.slice(0, 2) : 
    allEvents?.slice(0, 2) || [];
  
  const newEvents = allEvents?.slice(2, 4) || [];

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {trendingEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-[300px] md:h-[350px]"
            >
              <EventCard {...event} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {newEvents.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Just Added</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {newEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="h-[300px] md:h-[350px]"
              >
                <EventCard {...event} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
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
