
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
  event?: Event;
  variant?: 'default' | 'compact' | 'featured';
  index?: number;
  // Backward compatibility props
  id?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: any;
  category?: string[];
  tags?: string[];
  imageUrl?: string;
  likes?: number;
  attendees?: number;
  verification?: any;
  pricing?: any;
}

export const EventCard = ({ event, index = 0, variant = 'default', ...props }: EventCardProps) => {
  // Support both new event prop and old spread props for backward compatibility
  const eventData = event || {
    id: props.id || '',
    title: props.title || '',
    description: props.description || '',
    startDate: props.startDate || '',
    endDate: props.endDate || '',
    location: props.location || { address: '', coordinates: [0, 0], venue_name: '' },
    category: props.category || [],
    tags: props.tags || [],
    imageUrl: props.imageUrl || '',
    likes: props.likes || 0,
    attendees: props.attendees || 0,
    verification: props.verification || { status: 'pending' },
    pricing: props.pricing || { isFree: true }
  } as Event;

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
      <Link to={`/events/${eventData.id}`} className="block h-full">
        <Card className={`overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card/80 backdrop-blur-sm h-full ${isFeatured ? 'ring-2 ring-primary/20' : ''}`}>
          <div className="relative">
            <OptimizedImage
              src={eventData.imageUrl}
              alt={eventData.title}
              className={`w-full object-cover ${isCompact ? 'h-32' : 'h-48'}`}
              aspectRatio="video"
              priority={index < 3 ? 'high' : 'medium'}
            />
            
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {eventData.category.slice(0, 2).map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs bg-background/80 backdrop-blur-sm">
                  {cat}
                </Badge>
              ))}
            </div>
            
            <div className="absolute top-2 right-2 flex gap-2">
              <EventVerificationBadge status={eventData.verification.status} />
              <SaveEventButton eventId={eventData.id} size="icon" />
            </div>
          </div>

          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <h3 className={`font-semibold line-clamp-2 text-foreground ${isCompact ? 'text-sm' : 'text-base'}`}>
                {eventData.title}
              </h3>
              
              {!isCompact && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {eventData.description}
                </p>
              )}
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(eventData.startDate), "MMM d, yyyy")}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{format(new Date(eventData.startDate), "h:mm a")}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">
                  {eventData.location.venue_name || eventData.location.address}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{eventData.attendees} attending</span>
              </div>
            </div>

            {!isCompact && eventData.pricing && (
              <div className="pt-2 border-t border-border/50">
                <span className={`text-sm font-medium ${eventData.pricing.isFree ? 'text-green-600' : 'text-foreground'}`}>
                  {eventData.pricing.isFree 
                    ? 'Free Event' 
                    : eventData.pricing.priceRange 
                      ? `${eventData.pricing.currency || '€'}${eventData.pricing.priceRange[0]} - ${eventData.pricing.currency || '€'}${eventData.pricing.priceRange[1]}`
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
