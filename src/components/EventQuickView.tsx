
import { Event } from "@/lib/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Share2, Heart, ExternalLink, Users } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface EventQuickViewProps {
  event: Event | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventQuickView = ({ event, isOpen, onOpenChange }: EventQuickViewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);

  if (!event) return null;

  const handleViewDetails = () => {
    onOpenChange(false);
    navigate(`/event/${event.id}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/event/${event.id}`);
    toast({
      title: "Link copied!",
      description: "Event link has been copied to clipboard",
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked 
        ? "Event has been removed from your favorites" 
        : "Event has been added to your favorites",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="space-y-4">
          <div className="relative h-52 overflow-hidden">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute top-2 right-2 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="h-8 w-8 rounded-full bg-background/40 backdrop-blur-sm flex items-center justify-center"
              >
                <Share2 className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`h-8 w-8 rounded-full ${isLiked ? 'bg-red-500' : 'bg-background/40'} backdrop-blur-sm flex items-center justify-center`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'text-white fill-current' : ''}`} />
              </motion.button>
            </div>
          </div>
          <div className="p-4 pt-0">
            <div className="flex flex-wrap gap-2 mb-2">
              {event.category.slice(0, 3).map(cat => (
                <Badge key={cat} variant="secondary" className="hover:bg-primary/20">
                  {cat}
                </Badge>
              ))}
            </div>
            <h3 className="text-xl font-bold">{event.title}</h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-3">
              {event.description}
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{format(new Date(event.startDate), "PPP")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="truncate">{event.location.venue_name ? `${event.location.venue_name}, ${event.location.address}` : event.location.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>{event.attendees} attending</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm">
                {event.pricing.isFree ? (
                  <span className="text-green-500 font-medium">Free</span>
                ) : (
                  <span className="text-primary font-medium">
                    {event.pricing.priceRange ? `$${event.pricing.priceRange[0]} - $${event.pricing.priceRange[1]}` : 'Paid'}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button onClick={handleViewDetails} className="gap-1">
                  <ExternalLink className="h-4 w-4" />
                  Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
