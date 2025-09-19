import { motion } from "framer-motion";
import { Event } from "@/lib/types";
import { EventCard } from "@/components/EventCard";
import { MapPin } from "lucide-react";

interface EventsNearbyListProps {
  events: Event[];
  showPastEvents: boolean;
}

export const EventsNearbyList = ({ events, showPastEvents }: EventsNearbyListProps) => {
  // Separate current and past events
  const now = new Date();
  const currentEvents = events.filter(event => new Date(event.endDate) >= now);
  const pastEvents = events.filter(event => new Date(event.endDate) < now);

  const displayEvents = showPastEvents ? [...currentEvents, ...pastEvents] : currentEvents;

  if (displayEvents.length === 0) {
    return (
      <div className="text-center py-16">
        <MapPin className="h-16 w-16 text-muted-foreground/40 mx-auto mb-6" />
        <h3 className="text-xl font-semibold mb-3">
          {showPastEvents ? 'No events found nearby' : 'No current events found nearby'}
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {showPastEvents 
            ? 'Try increasing the search radius or selecting a different date to discover more events in your area.'
            : 'Try increasing the search radius, including past events, or selecting a different date to discover more events in your area.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Events Section */}
      {currentEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Current Events ({currentEvents.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {currentEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EventCard event={event} index={index} variant="compact" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Past Events Section */}
      {showPastEvents && pastEvents.length > 0 && (
        <div className="space-y-4">
          <div className="border-t border-border/50 pt-6">
            <h2 className="text-lg font-semibold text-muted-foreground">
              Past Events ({pastEvents.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (currentEvents.length + index) * 0.05 }}
                className="opacity-75"
              >
                <EventCard 
                  event={{ ...event, isPast: true } as any} 
                  index={currentEvents.length + index} 
                  variant="compact" 
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};