
import { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { OptimizedImage } from "./OptimizedImage";
import { SaveEventButton } from "./SaveEventButton";
import { EventVerificationBadge } from "./EventVerificationBadge";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact' | 'featured';
  index?: number;
}

export const EventCard = ({ event, index = 0, variant = 'default' }: EventCardProps) => {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  if (!event) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="h-full"
      >
        <Card className="h-full w-full bg-muted animate-pulse rounded-2xl" />
      </motion.div>
    );
  }
  
  const { id, title, description, startDate, location, category, imageUrl, attendees, verification, pricing } = event;
  const isPast = new Date(event.endDate) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full group"
    >
      <Link to={`/event/${id}`} className="block h-full">
        <Card className={cn(
          "card-interactive overflow-hidden h-full flex flex-col rounded-lg",
          isFeatured && "ring-2 ring-primary/20"
        )}>
          {/* Image section */}
          <div className={cn(
            "relative overflow-hidden bg-muted",
            isCompact ? "aspect-[16/10]" : "aspect-[4/3]",
            isFeatured && "md:aspect-[16/9]"
          )}>
            <OptimizedImage
              src={imageUrl}
              alt={title}
              className="h-full w-full transition-transform duration-500 group-hover:scale-105"
              priority={index < 4 ? 'high' : 'medium'}
              fallback="https://images.unsplash.com/photo-1540575467063-178a50c2df87"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Past event overlay */}
            {isPast && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="bg-background/90 text-foreground">
                  Event Ended
                </Badge>
              </div>
            )}
            
            {/* Category badge */}
            <div className="absolute top-3 left-3">
              {category.slice(0, 1).map((cat) => (
                <span key={cat} className="badge-dark backdrop-blur-sm">
                  {cat}
                </span>
              ))}
            </div>
            
            {/* Top right actions */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <EventVerificationBadge status={verification.status} />
              <SaveEventButton eventId={id} size="icon" />
            </div>

            {/* Featured badge */}
            {isFeatured && (
              <Badge className="absolute bottom-2 left-2 badge-primary">
                <Sparkles className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          {/* Content section */}
          <CardContent className="p-5 flex flex-col flex-grow">
            <div className="flex-grow space-y-3">
              {/* Date highlight */}
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(startDate), "EEE, MMM d")}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{format(new Date(startDate), "h:mm a")}</span>
              </div>

              {/* Title */}
              <h3 className={cn(
                "font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors",
                isCompact ? 'text-base' : 'text-lg'
              )}>
                {title}
              </h3>
              
              {/* Description */}
              {!isCompact && description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {description}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="pt-3 mt-auto space-y-2 text-sm text-muted-foreground border-t border-border">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="truncate">
                  {location.venue_name || location.address}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 mt-3 flex justify-between items-center border-t border-border">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="font-medium text-foreground">{attendees}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span className="font-medium text-foreground">{event.likes || 0}</span>
                </div>
              </div>
              
              {pricing && (
                <span className={cn(
                  "text-sm font-semibold",
                  pricing.isFree ? 'text-success' : 'text-foreground'
                )}>
                  {pricing.isFree 
                    ? 'Free' 
                    : pricing.priceRange 
                      ? `${pricing.currency || '€'}${pricing.priceRange[0]}+`
                      : 'Paid'
                  }
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
