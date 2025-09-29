
import { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Clock, Sparkles } from "lucide-react";
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        delay: index * 0.05,
        ease: "easeOut"
      }
    }
  };

  if (!event) {
    return (
      <motion.div variants={cardVariants} initial="hidden" animate="visible" className="h-full">
         <Card className="h-full w-full bg-muted/30 animate-pulse" />
      </motion.div>
    );
  }
  
  const { id, title, description, startDate, location, category, imageUrl, attendees, verification, pricing } = event;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      className="h-full group"
    >
      <Link to={`/event/${id}`} className="block h-full">
        <Card className={cn(
          "overflow-hidden transition-all duration-300 h-full flex flex-col border-0 group-hover:shadow-xl hover:shadow-primary/20",
          "bg-card shadow-md hover:shadow-lg",
          isFeatured && "ring-2 ring-primary/20 shadow-xl"
        )}>
          <div className="relative">
            <OptimizedImage
              src={imageUrl}
              alt={title}
              className={cn("w-full object-cover transition-transform duration-300 group-hover:scale-105", isCompact ? 'h-32' : 'h-48')}
              aspectRatio="video"
              priority={index < 4 ? 'high' : 'medium'}
              fallback="https://images.unsplash.com/photo-1540575467063-178a50c2df87"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            
            {/* Past event overlay */}
            {(event as any).isPast && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="bg-background/90 text-foreground border border-border">
                  Event Ended
                </Badge>
              </div>
            )}
            
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {category.slice(0, 1).map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs bg-black/60 text-white backdrop-blur-sm border-0">
                  {cat}
                </Badge>
              ))}
            </div>
            
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <EventVerificationBadge status={verification.status} />
              <SaveEventButton eventId={id} size="icon" />
            </div>

            {isFeatured && (
               <Badge variant="default" className="absolute bottom-2 left-2 text-xs bg-primary/90 text-primary-foreground backdrop-blur-sm border border-primary/30">
                 <Sparkles className="h-3 w-3 mr-1" />
                 Featured
               </Badge>
            )}
          </div>

          <CardContent className="p-4 flex flex-col flex-grow">
            <div className="flex-grow space-y-2">
              <h3 className={cn(
                "font-semibold text-foreground tracking-tight line-clamp-2 leading-tight",
                isCompact ? 'text-base' : 'text-lg'
              )}>
                {title}
              </h3>
              
              {!isCompact && description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <div className="pt-3 mt-auto space-y-2 text-sm text-muted-foreground border-t border-border/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="truncate">{format(new Date(startDate), "E, MMM d, yyyy")}</span>
                {(() => {
                  const isPast = new Date(event.endDate) < new Date();
                  return isPast ? (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Ended</span>
                  ) : null;
                })()}
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="truncate">{format(new Date(startDate), "p")}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="truncate">
                  {location.venue_name || location.address}
                </span>
              </div>
            </div>

            <div className="pt-3 mt-3 flex justify-between items-center border-t border-border/50">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium text-foreground">{attendees}</span>
                  <span className="text-muted-foreground">attending</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">{event.likes || 0}</span>
                  <span className="text-muted-foreground">likes</span>
                </div>
              </div>
              
              {pricing && (
                <div className="flex items-center">
                  <span className={cn(
                    "text-sm font-bold truncate",
                    pricing.isFree ? 'text-emerald-600' : 'text-foreground'
                  )}>
                    {pricing.isFree 
                      ? 'FREE' 
                      : pricing.priceRange 
                        ? `${pricing.currency || '$'}${pricing.priceRange[0]}`
                        : 'Paid'
                    }
                  </span>
                  {pricing.priceRange && !pricing.isFree && (
                    <span className="text-xs text-muted-foreground ml-1">+</span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
