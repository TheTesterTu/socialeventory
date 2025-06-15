
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
          "overflow-hidden transition-all duration-300 bg-card/80 backdrop-blur-sm h-full flex flex-col border border-border/20 group-hover:border-primary/40 group-hover:shadow-lg",
          isFeatured && "ring-2 ring-primary/20 shadow-lg"
        )}>
          <div className="relative">
            <OptimizedImage
              src={imageUrl}
              alt={title}
              className={cn("w-full object-cover transition-transform duration-300 group-hover:scale-105", isCompact ? 'h-32' : 'h-48')}
              aspectRatio="video"
              priority={index < 4 ? 'high' : 'medium'}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
              {category.slice(0, 1).map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs bg-black/40 text-white backdrop-blur-md border border-white/20">
                  {cat}
                </Badge>
              ))}
            </div>
            
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <EventVerificationBadge status={verification.status} />
              <SaveEventButton eventId={id} size="icon" />
            </div>

            {isFeatured && (
               <Badge variant="default" className="absolute bottom-2 left-2 text-xs bg-primary/90 text-primary-foreground backdrop-blur-sm border border-primary-foreground/20">
                 <Sparkles className="h-3 w-3 mr-1" />
                 Featured
               </Badge>
            )}
          </div>

          <CardContent className="p-4 flex flex-col flex-grow">
            <div className="flex-grow space-y-2">
              <h3 className={cn(
                "font-semibold text-foreground tracking-tight line-clamp-2",
                isCompact ? 'text-base' : 'text-lg'
              )}>
                {title}
              </h3>
              
              {!isCompact && description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {description}
                </p>
              )}
            </div>

            <div className="pt-3 mt-auto space-y-2.5 text-sm text-muted-foreground border-t border-border/20">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{format(new Date(startDate), "E, MMM d, yyyy")}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{format(new Date(startDate), "p")}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="line-clamp-1">
                  {location.venue_name || location.address}
                </span>
              </div>
            </div>

            <div className="pt-3 mt-3 flex justify-between items-center border-t border-border/20">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{attendees}</span>
                <span className="text-muted-foreground">attending</span>
              </div>
              
              {pricing && (
                <div>
                  <span className={cn(
                    "text-sm font-bold",
                    pricing.isFree ? 'text-green-500' : 'text-foreground'
                  )}>
                    {pricing.isFree 
                      ? 'FREE' 
                      : pricing.priceRange 
                        ? `${pricing.currency || '$'}${pricing.priceRange[0]}`
                        : 'Paid'
                    }
                  </span>
                  {pricing.priceRange && !pricing.isFree && <span className="text-xs text-muted-foreground"> onwards</span>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
