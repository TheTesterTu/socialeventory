import { memo, useState } from "react";
import { Event } from "@/lib/types";
import { EventMetadata } from "./EventMetadata";
import { EventSocialActions } from "./EventSocialActions";
import { Tag, Ticket, MapPin, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { UnifiedButton } from "@/components/ui/unified-button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { EventChatModal } from "./EventChatModal";
import { useEventComments } from "@/hooks/useEventComments";
import { format } from "date-fns";

interface EventDetailsOptimizedProps {
  event: Event;
}

export const EventDetailsOptimized = memo(({ event }: EventDetailsOptimizedProps) => {
  const navigate = useNavigate();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const { comments } = useEventComments(event.id);

  if (!event || !event.id) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-xl font-semibold mb-2">Event data unavailable</h2>
        <p className="text-muted-foreground">There was an issue loading this event.</p>
        <UnifiedButton onClick={() => navigate("/")} className="mt-4">
          Back to Home
        </UnifiedButton>
      </div>
    );
  }

  const safeEvent = {
    ...event,
    title: event.title || "Untitled Event",
    description: event.description || "No description available",
    imageUrl: event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    tags: Array.isArray(event.tags) ? event.tags : [],
    location: {
      coordinates: event.location?.coordinates || [37.7749, -122.4194],
      address: event.location?.address || "Location not specified",
      venue_name: event.location?.venue_name || "",
    },
    category: Array.isArray(event.category) ? event.category : ["Other"],
    pricing: event.pricing || { isFree: true, currency: "USD" },
    accessibility:
      event.accessibility || {
        languages: ["en"],
        wheelchairAccessible: false,
        familyFriendly: true,
      },
  };

  const startDate = new Date(safeEvent.startDate);
  const endDate = new Date(safeEvent.endDate);

  const handleGetTickets = () => {
    toast("Tickets coming soon for this event");
  };

  const handleShowOnMap = () => {
    navigate(`/nearby?eventId=${event.id}`);
  };

  return (
    <>
      {/* Cinematic hero */}
      <div className="relative -mt-4 h-[55vh] min-h-[360px] w-full overflow-hidden">
        <img
          src={safeEvent.imageUrl}
          alt={safeEvent.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 px-4 md:px-8">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
            {safeEvent.category.map((cat) => (
              <Badge key={cat} variant="secondary" className="backdrop-blur-md bg-background/60">
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 md:px-8 -mt-8 relative z-10"
      >
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          {/* Article column */}
          <article className="space-y-6">
            <header className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
                {safeEvent.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {format(startDate, "EEE, MMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {format(startDate, "p")} – {format(endDate, "p")}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {safeEvent.location.venue_name
                    ? `${safeEvent.location.venue_name}, ${safeEvent.location.address}`
                    : safeEvent.location.address}
                </span>
              </div>
            </header>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line text-lg">
                {safeEvent.description}
              </p>
            </div>

            {safeEvent.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                {safeEvent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="bg-card border rounded-2xl p-6">
              <EventSocialActions eventId={safeEvent.id} comments={comments?.length || 0} />
            </div>
          </article>

          {/* Sticky RSVP rail */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="bg-card border rounded-2xl p-6 space-y-4 shadow-sm">
              <EventMetadata
                startDate={safeEvent.startDate}
                endDate={safeEvent.endDate}
                location={safeEvent.location}
                tags={safeEvent.tags}
                attendees={safeEvent.attendees || 0}
                pricing={safeEvent.pricing}
              />

              <div className="flex flex-col gap-2 pt-2">
                <UnifiedButton variant="primary" size="lg" className="gap-2" onClick={handleGetTickets}>
                  <Ticket className="h-5 w-5" />
                  {safeEvent.pricing.isFree ? "RSVP — Free" : "Get tickets"}
                </UnifiedButton>
                <UnifiedButton variant="outline" size="lg" className="gap-2" onClick={handleShowOnMap}>
                  <MapPin className="h-5 w-5" />
                  Show on map
                </UnifiedButton>
                <UnifiedButton
                  variant="secondary"
                  size="lg"
                  className="gap-2"
                  onClick={() => setIsChatModalOpen(true)}
                >
                  💬 Join the conversation
                </UnifiedButton>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>

      <EventChatModal event={safeEvent} isOpen={isChatModalOpen} onOpenChange={setIsChatModalOpen} />
    </>
  );
});

EventDetailsOptimized.displayName = "EventDetailsOptimized";
