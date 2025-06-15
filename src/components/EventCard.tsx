
import { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { OptimizedImage } from "./OptimizedImage";
import { SaveEventButton } from "./SaveEventButton";
import { EventVerificationBadge } from "./EventVerificationBadge";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface EventCardProps {
  event: Event;
  index?: number;
  variant?: 'default' | 'compact' | 'featured';
}

export const EventCard = ({ event, index = 0, variant = 'default' }: EventCardProps) => {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="h-full"
    >
      <Link to={`/events/${event.id}`} className="block h-full">
        <Card className={`overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card/80 backdrop-blur-sm h-full ${isFeatured ? 'ring-2 ring-primary/20' : ''}`}>
          <div className="relative">
            <OptimizedImage
              src={event.imageUrl}
              alt={event.title}
              className={`w-full object-cover ${isCompact ? 'h-32' : 'h-48'}`}
              aspectRatio="video"
              priority={index < 3 ? 'high' : 'medium'}
            />
            
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {event.category.slice(0, 2).map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs bg-background/80 backdrop-blur-sm">
                  {cat}
                </Badge>
              ))}
            </div>
            
            <div className="absolute top-2 right-2 flex gap-2">
              <EventVerificationBadge status={event.verification.status} />
              <SaveEventButton eventId={event.id} size="icon" />
            </div>
          </div>

          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <h3 className={`font-semibold line-clamp-2 text-foreground ${isCompact ? 'text-sm' : 'text-base'}`}>
                {event.title}
              </h3>
              
              {!isCompact && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(event.startDate), "MMM d, yyyy")}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{format(new Date(event.startDate), "h:mm a")}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">
                  {event.location.venue_name || event.location.address}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{event.attendees} attending</span>
              </div>
            </div>

            {!isCompact && event.pricing && (
              <div className="pt-2 border-t border-border/50">
                <span className={`text-sm font-medium ${event.pricing.isFree ? 'text-green-600' : 'text-foreground'}`}>
                  {event.pricing.isFree 
                    ? 'Free Event' 
                    : event.pricing.priceRange 
                      ? `${event.pricing.currency || '€'}${event.pricing.priceRange[0]} - ${event.pricing.currency || '€'}${event.pricing.priceRange[1]}`
                      : 'Paid Event'
                  }
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
