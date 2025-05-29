
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/types";
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
  location?: any;
  category?: string[];
  tags?: string[];
  culturalContext?: string;
  accessibility?: any;
  pricing?: any;
  creator?: any;
  verification?: any;
  imageUrl?: string;
  likes?: number;
  attendees?: number;
}

export const EventCard = ({ 
  event, 
  variant = "default", 
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
  ...props
}: EventCardProps) => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Use event prop if provided, otherwise construct from legacy props
  const eventData: Event = event || {
    id: id!,
    title: title!,
    description: description!,
    startDate: startDate!,
    endDate: endDate!,
    location: location!,
    category: category || [],
    tags: tags || [],
    culturalContext,
    accessibility: accessibility || { languages: ["en"], wheelchairAccessible: false, familyFriendly: true },
    pricing: pricing || { isFree: true },
    creator: creator || { id: "unknown", type: "user" as const },
    verification: verification || { status: "pending" as const },
    imageUrl: imageUrl || '',
    likes: likes || 0,
    attendees: attendees || 0
  };

  const { participantCount, joinChat } = useEventChat(eventData.id);
  const { isLiked, likesCount, handleLike } = useEventInteractions(eventData.id);

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
            <img
              src={eventData.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'}
              alt={eventData.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="ml-1 text-sm">{likesCount}</span>
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
