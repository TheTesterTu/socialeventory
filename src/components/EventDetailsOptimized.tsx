
import { memo } from 'react';
import { Event } from "@/lib/types";
import { EventHeader } from "./EventHeader";
import { EventMetadata } from "./EventMetadata";
import { EventSocialActions } from "./EventSocialActions";
import { Tag, Ticket, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { UnifiedButton } from "@/components/ui/unified-button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { EventChatModal } from "./EventChatModal";
import { useEventComments } from "@/hooks/useEventComments";

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
        <UnifiedButton 
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Back to Home
        </UnifiedButton>
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

  // Create a safe event object with guaranteed properties
  const safeEvent = {
    ...event,
    title: event.title || 'Untitled Event',
    description: event.description || 'No description available',
    imageUrl: event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    tags: Array.isArray(event.tags) ? event.tags : [],
    location: {
      coordinates: event.location?.coordinates || [37.7749, -122.4194],
      address: event.location?.address || 'Location not specified',
      venue_name: event.location?.venue_name || ''
    },
    category: Array.isArray(event.category) ? event.category : ['Other'],
    pricing: event.pricing || { isFree: true, currency: 'USD' },
    accessibility: event.accessibility || {
      languages: ['en'],
      wheelchairAccessible: false,
      familyFriendly: true
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8 container-padding"
      >
        {/* Hero Image */}
        <div className="relative h-[400px] rounded-2xl overflow-hidden modern-shadow">
          <img
            src={safeEvent.imageUrl}
            alt={safeEvent.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <EventHeader 
              title={safeEvent.title}
              startDate={safeEvent.startDate}
              endDate={safeEvent.endDate}
              location={safeEvent.location}
              category={safeEvent.category}
            />

            {/* Description */}
            <div className="glass-card card-padding rounded-2xl">
              <h3 className="text-lg font-semibold mb-3 text-primary">About This Event</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed">{safeEvent.description}</p>
              </div>
            </div>

            {/* Tags */}
            {safeEvent.tags.length > 0 && (
              <div className="glass-card card-padding rounded-2xl">
                <h3 className="text-lg font-semibold mb-3 text-primary">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {safeEvent.tags.map((tag, index) => (
                    <span 
                      key={`${tag}-${index}`} 
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="glass-card card-padding rounded-2xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <UnifiedButton 
                  variant="primary"
                  size="lg"
                  className="gap-2 flex-1 rounded-xl"
                  onClick={handleGetTickets}
                >
                  <Ticket className="h-5 w-5" />
                  Get Tickets
                </UnifiedButton>
                
                <UnifiedButton 
                  variant="outline"
                  size="lg"
                  className="gap-2 rounded-xl"
                  onClick={handleShowOnMap}
                >
                  <MapPin className="h-5 w-5" />
                  Show on Map
                </UnifiedButton>
                
                <UnifiedButton 
                  variant="secondary"
                  size="lg"
                  className="gap-2 rounded-xl"
                  onClick={() => setIsChatModalOpen(true)}
                >
                  💬 Join Discussion
                </UnifiedButton>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card card-padding rounded-2xl">
              <EventMetadata 
                startDate={safeEvent.startDate}
                endDate={safeEvent.endDate}
                location={safeEvent.location}
                tags={safeEvent.tags}
                attendees={safeEvent.attendees || 0}
                pricing={safeEvent.pricing}
              />
            </div>

            <div className="glass-card card-padding rounded-2xl">
              <EventSocialActions 
                eventId={safeEvent.id} 
                comments={comments?.length || 0}
              />
            </div>
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
});

EventDetailsOptimized.displayName = 'EventDetailsOptimized';
