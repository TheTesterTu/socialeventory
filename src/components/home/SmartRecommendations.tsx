
import { motion } from "framer-motion";
import { Sparkles, MapPin, Clock } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { useEventRecommendations } from "@/hooks/useEventRecommendations";
import { useAdvancedGeolocation } from "@/hooks/useAdvancedGeolocation";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";

export const SmartRecommendations = () => {
  const { user } = useAuth();
  const { coordinates } = useAdvancedGeolocation();

  // User preferences from profile data for personalized recommendations
  const userFactors = useMemo(() => ({
    userInterests: ['Music', 'Technology', 'Food', 'Art'],
    attendedEvents: [],
    savedEvents: [],
    location: coordinates,
    preferredTimeOfDay: 'evening' as const
  }), [coordinates]);

  const { recommendations, isLoading } = useEventRecommendations(userFactors);

  if (!user || isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Raccomandazioni Smart</h2>
            <p className="text-sm text-muted-foreground">Eventi personalizzati per te</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </motion.div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Raccomandazioni Smart</h2>
            <p className="text-sm text-muted-foreground">Partecipa a più eventi per ricevere raccomandazioni personalizzate</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Raccomandazioni Smart</h2>
            <p className="text-sm text-muted-foreground">
              Eventi selezionati appositamente per te
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {coordinates && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Posizione attiva</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Aggiornato ora</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.slice(0, 6).map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <EventCard event={event} index={index} variant="default" />
            {/* Show recommendation score in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs text-muted-foreground">
                Score: {Math.round((event as any).recommendationScore || 0)}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
