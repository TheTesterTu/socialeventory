
import { motion } from "framer-motion";
import { EventCard } from "@/components/EventCard";
import { TrendingUp, Sparkles } from "lucide-react";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { memo, useEffect, useState } from "react";
import { Event } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const FeaturedEventsContent = memo(() => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [newEvents, setNewEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch trending events (high likes or attendees)
      const { data: trendingData, error: trendingError } = await supabase
        .from('events')
        .select('*')
        .or('likes.gte.5,attendees.gte.10')
        .order('likes', { ascending: false })
        .limit(2);

      if (trendingError) throw trendingError;

      // Fetch recent events
      const { data: recentData, error: recentError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (recentError) throw recentError;

      const formatEvent = (event: any): Event => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        startDate: event.start_date,
        endDate: event.end_date,
        location: {
          coordinates: event.coordinates ? [event.coordinates.x, event.coordinates.y] as [number, number] : [0, 0],
          address: event.location || '',
          venue_name: event.venue_name || ''
        },
        category: event.category || [],
        tags: event.tags || [],
        culturalContext: event.cultural_context,
        accessibility: event.accessibility || {
          languages: ['en'],
          wheelchairAccessible: false,
          familyFriendly: true
        },
        pricing: event.pricing || { isFree: true },
        creator: {
          id: event.created_by || '',
          type: 'user'
        },
        verification: {
          status: event.verification_status || 'pending'
        },
        imageUrl: event.image_url || '',
        likes: event.likes || 0,
        attendees: event.attendees || 0
      });

      const formattedTrending = (trendingData || []).map(formatEvent);
      const formattedRecent = (recentData || []).map(formatEvent);

      // If no trending events, use first 2 recent events
      setFeaturedEvents(formattedTrending.length > 0 ? formattedTrending : formattedRecent.slice(0, 2));
      setNewEvents(formattedRecent.slice(formattedTrending.length > 0 ? 0 : 2, 4));
      
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to fetch featured events",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <ErrorFallback 
        error={error} 
        resetError={() => {
          setError(null);
          fetchEvents();
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <motion.section className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-[300px] md:h-[350px] bg-muted/20 rounded-xl animate-pulse" />
            ))}
          </div>
        </motion.section>
        
        <motion.section className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Just Added</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-[300px] md:h-[350px] bg-muted/20 rounded-xl animate-pulse" />
            ))}
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
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Trending Now</h2>
        </div>
        
        {featuredEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No trending events yet</p>
            <p className="text-sm">Add some sample events from the admin panel to see trending content</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {featuredEvents.map((event) => (
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
        )}
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
                <EventCard event={event} />
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
