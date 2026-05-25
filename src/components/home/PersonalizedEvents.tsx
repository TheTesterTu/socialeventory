import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { EventCard } from "../EventCard";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAdvancedGeolocation } from "@/hooks/useAdvancedGeolocation";
import { useEventRecommendations } from "@/hooks/useEventRecommendations";

/**
 * Real personalized strip: pulls the user's liked + attended event categories
 * from the database and feeds them into the recommendation algorithm.
 * Falls back gracefully when there's no signal yet.
 */
export const PersonalizedEvents = () => {
  const { user } = useAuth();
  const { coordinates } = useAdvancedGeolocation();
  const [interests, setInterests] = useState<string[]>([]);
  const [signalIds, setSignalIds] = useState<{ liked: string[]; attended: string[] }>({
    liked: [],
    attended: [],
  });

  useEffect(() => {
    if (!user) return;
    const loadSignals = async () => {
      const [{ data: likes }, { data: attends }] = await Promise.all([
        supabase.from("event_likes").select("event_id").eq("user_id", user.id),
        supabase.from("event_attendees").select("event_id").eq("user_id", user.id),
      ]);

      const liked = (likes || []).map((l) => l.event_id).filter(Boolean) as string[];
      const attended = (attends || []).map((a) => a.event_id).filter(Boolean) as string[];
      setSignalIds({ liked, attended });

      const eventIds = [...new Set([...liked, ...attended])];
      if (eventIds.length === 0) return;

      const { data: cats } = await supabase
        .from("events")
        .select("category")
        .in("id", eventIds);

      const flat = (cats || []).flatMap((e: any) => e.category || []);
      setInterests([...new Set(flat)]);
    };
    loadSignals();
  }, [user]);

  const factors = useMemo(
    () => ({
      userInterests: interests,
      attendedEvents: signalIds.attended,
      savedEvents: signalIds.liked,
      location: coordinates,
    }),
    [interests, signalIds, coordinates]
  );

  const { recommendations, isLoading } = useEventRecommendations(factors);

  if (!user) return null;

  const events = recommendations.slice(0, 6);
  const hasSignals = interests.length > 0;

  if (isLoading) {
    return (
      <section className="space-y-6">
        <Header hasSignals={hasSignals} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 bg-muted/20 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Header hasSignals={hasSignals} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </motion.section>
  );
};

const Header = ({ hasSignals }: { hasSignals: boolean }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Sparkles className="h-5 w-5 text-primary" />
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {hasSignals ? "Picked for you" : "Worth your time"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {hasSignals
            ? "Based on events you've liked and attended"
            : "Like a few events and we'll learn your taste"}
        </p>
      </div>
    </div>
    <Link to="/events">
      <Button variant="ghost" className="gap-2">
        View all <ArrowRight className="h-4 w-4" />
      </Button>
    </Link>
  </div>
);
