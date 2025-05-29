
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
  event: Event;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export const EventCard = ({ event, variant = "default", className = "" }: EventCardProps) => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { participantCount, joinChat } = useEventChat(event.id);
  const { isLiked, likesCount, handleLike } = useEventInteractions(event.id);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking on interactive elements
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/events/${event.id}`);
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
              src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            
            {/* Chat button overlay */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <EventChatButton
                eventId={event.id}
                participantCount={participantCount}
                onClick={handleChatClick}
              />
            </div>
          </div>

          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {event.title}
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
                {event.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {event.category.slice(0, 2).map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-xs">
                    {cat}
                  </Badge>
                ))}
                {event.category.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{event.category.length - 2}
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(event.startDate), 'MMM d, yyyy • h:mm a')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{event.location.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <EventChatModal
        event={event}
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
    </>
  );
};
