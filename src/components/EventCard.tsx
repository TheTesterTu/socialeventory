
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event, Location, AccessibilityInfo, Pricing, Creator, Verification } from "@/lib/types"; // Added specific type imports
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { EventChatButton } from "./EventChatButton";
import { EventChatModal } from "./EventChatModal";
import { useEventChat } from "@/hooks/useEventChat";
import { useEventInteractions } from "@/hooks/useEventInteractions";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface EventCardProps {
  event?: Event;
  variant?: "default" | "featured" | "compact";
  className?: string;
  // Legacy props for backward compatibility
  id?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: Partial<Location>;
  category?: string[];
  tags?: string[];
  culturalContext?: string;
  accessibility?: Partial<AccessibilityInfo>;
  pricing?: Partial<Pricing>;
  creator?: Partial<Creator>;
  verification?: Partial<Verification>;
  imageUrl?: string;
  likes?: number;
  attendees?: number;
}

export const EventCard = ({ 
  event, 
  variant: _variant = "default", // Prefixed variant
  className = "",
  // Legacy props
  id,
  title,
  description,
  startDate,
  endDate,
  location,
  category,
  tags,
  culturalContext,
  accessibility,
  pricing,
  creator,
  verification,
  imageUrl,
  likes,
  attendees,
  // ...props // Removed unused rest props
}: EventCardProps) => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Use event prop if provided, otherwise construct from legacy props
  // Define default values for each potentially missing piece to satisfy the Event type
  const defaultLocation: Location = { coordinates: [0,0], address: 'Address not available', venue_name: 'Venue not available' };
  const defaultAccessibility: AccessibilityInfo = { languages: ["en"], wheelchairAccessible: false, familyFriendly: true };
  const defaultPricing: Pricing = { isFree: true };
  const defaultCreator: Creator = { id: "unknown", type: "user" as const };
  const defaultVerification: Verification = { status: "pending" as const };

  const eventData: Event = event || {
    id: id ?? 'default-id', // Provide a sensible default or ensure id is always present
    title: title ?? 'Untitled Event',
    description: description ?? 'No description available.',
    startDate: startDate ?? new Date().toISOString(),
    endDate: endDate ?? new Date().toISOString(),
    location: { ...defaultLocation, ...(location || {}) } as Location,
    category: category || [],
    tags: tags || [],
    culturalContext: culturalContext ?? '',
    accessibility: { ...defaultAccessibility, ...accessibility },
    pricing: { ...defaultPricing, ...pricing },
    creator: { ...defaultCreator, ...creator },
    verification: { ...defaultVerification, ...verification },
    imageUrl: imageUrl || '',
    likes: likes || 0,
    attendees: attendees || 0
  };

  // Ensure eventData.id is a valid string before passing to hooks.
  // If 'default-id' is used, it might indicate an issue upstream.
  const safeEventId = eventData.id === 'default-id' && !id ? '' : eventData.id; // Prevent passing 'default-id' if id was truly missing

  const { participantCount, joinChat } = useEventChat(safeEventId);
  const { isLiked, likesCount, handleLike } = useEventInteractions(safeEventId);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking on interactive elements
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/events/${eventData.id}`);
  };

  const handleChatClick = () => {
    joinChat();
    setIsChatOpen(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        <Card 
          className="glass-card border-primary/20 cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group"
          onClick={handleCardClick}
        >
          <div className="relative h-48 overflow-hidden">
            <LazyLoadImage
              alt={eventData.title}
              src={eventData.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'}
              effect="blur"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              wrapperClassName="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            
            {/* Chat button overlay */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <EventChatButton
                eventId={eventData.id}
                participantCount={participantCount}
                onClick={handleChatClick}
              />
            </div>
          </div>

          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {eventData.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                  }}
                  className="ml-2 shrink-0"
                  aria-label={isLiked ? `Unlike event: ${eventData.title}` : `Like event: ${eventData.title}`}
                >
                  <motion.div
                    whileTap={{ scale: 0.85, transition: { duration: 0.05 } }}
                    className="flex items-center" // Ensures icon and count scale together
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="ml-1 text-sm">{likesCount}</span>
                  </motion.div>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {eventData.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {eventData.category.slice(0, 2).map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-xs">
                    {cat}
                  </Badge>
                ))}
                {eventData.category.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{eventData.category.length - 2}
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(eventData.startDate), 'MMM d, yyyy • h:mm a')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{eventData.location.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{eventData.attendees} attending</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <EventChatModal
        event={eventData}
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
    </>
  );
};
