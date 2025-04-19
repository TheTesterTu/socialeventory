
import { motion } from "framer-motion";
import { Event } from "@/lib/types";
import { EventVerificationBadge } from "./EventVerificationBadge";
import { format } from "date-fns";
import { MapPin, Users, ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

interface EventCardProps extends Event {
  showViewDetails?: boolean;
}

export const EventCard = ({ 
  id, 
  title,
  startDate,
  location,
  imageUrl,
  category,
  attendees,
  verification,
  pricing,
  showViewDetails = false,
}: EventCardProps) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast(isLiked ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <motion.div 
      className="event-card relative h-[280px] overflow-hidden rounded-xl group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/event/${id}`)}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative h-full p-4 flex flex-col justify-between text-white">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              {category.slice(0, 2).map((cat) => (
                <Badge 
                  key={cat}
                  variant="secondary" 
                  className="mr-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white"
                >
                  {cat}
                </Badge>
              ))}
            </div>
            <EventVerificationBadge status={verification.status} />
          </div>
          <h3 className="text-xl font-bold line-clamp-2 mt-2">{title}</h3>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1.5 text-sm text-white/90">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{location.venue_name || location.address}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{attendees} attending</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {format(new Date(startDate), "MMM d, h:mm a")}
              </span>
              <span className="text-sm font-medium">
                {pricing.isFree ? "Free" : `$${pricing.priceRange?.[0]}`}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className={`rounded-full ${isLiked ? 'text-red-500' : 'text-white/90'}`}
                onClick={handleLike}
              >
                <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
              </Button>
              
              {showViewDetails && (
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://example.com/tickets/${id}`, '_blank');
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Tickets
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
