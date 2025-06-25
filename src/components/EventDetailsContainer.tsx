
import { Event } from "@/lib/types";
import { EventHeader } from "./EventHeader";
import { EventMetadata } from "./EventMetadata";
import { EventSocialActions } from "./EventSocialActions";
import { EventCommunity } from "./EventCommunity";
import { Tag, Ticket, MapPin, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { EventChatModal } from "./EventChatModal";
import { useEventComments } from "@/hooks/useEventComments";

interface EventDetailsContainerProps {
  event: Event;
}

export const EventDetailsContainer = ({ event }: EventDetailsContainerProps) => {
  const navigate = useNavigate();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const { comments } = useEventComments(event.id);

  // Safely validate event data
  if (!event || !event.id) {
    console.error('Invalid event data:', event);
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-xl font-semibold mb-2">Event data unavailable</h2>
        <p className="text-muted-foreground">There was an issue loading this event.</p>
        <Button 
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  const handleGetTickets = () => {
    window.open(`https://example.com/tickets/${event.id}`, '_blank');
    toast("Opening ticket page");
  };

  const handleShowOnMap = () => {
    navigate(`/nearby?eventId=${event.id}`);
    toast("Showing event location on map");
  };

  // Safely extract event properties with fallbacks
  const safeEvent = {
    ...event,
    title: event.title || 'Untitled Event',
    description: event.description || 'No description available',
    imageUrl: event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    tags: Array.isArray(event.tags) ? event.tags : [],
    location: {
      ...event.location,
      address: event.location?.address || 'Location not specified',
      venue_name: event.location?.venue_name || ''
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6"
      >
        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <img
            src={safeEvent.imageUrl}
            alt={safeEvent.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <EventHeader 
              title={safeEvent.title}
              startDate={safeEvent.startDate}
              endDate={safeEvent.endDate}
              location={safeEvent.location}
              category={safeEvent.category}
            />

            <div className="prose prose-invert max-w-none">
              <p>{safeEvent.description}</p>
            </div>

            {safeEvent.tags.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {safeEvent.tags.map((tag, index) => (
                  <span key={`${tag}-${index}`} className="text-sm text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-border pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <EventMetadata 
                  startDate={safeEvent.startDate}
                  endDate={safeEvent.endDate}
                  location={safeEvent.location}
                  tags={safeEvent.tags}
                  attendees={safeEvent.attendees || 0}
                  pricing={safeEvent.pricing}
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <EventSocialActions 
                    eventId={safeEvent.id} 
                    comments={comments?.length || 0}
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="gap-2"
                      onClick={() => setIsChatModalOpen(true)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Join Chat
                    </Button>
                    <Button 
                      variant="outline"
                      className="gap-2"
                      onClick={handleShowOnMap}
                    >
                      <MapPin className="h-4 w-4" />
                      Show on Map
                    </Button>
                    <Button 
                      className="gap-2 font-medium"
                      onClick={handleGetTickets}
                    >
                      <Ticket className="h-4 w-4" />
                      Get Tickets
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Community Chat Sidebar */}
          <div className="lg:col-span-1">
            <EventCommunity eventId={safeEvent.id} />
          </div>
        </div>
      </motion.div>

      <EventChatModal
        event={safeEvent}
        isOpen={isChatModalOpen}
        onOpenChange={setIsChatModalOpen}
      />
    </>
  );
};
