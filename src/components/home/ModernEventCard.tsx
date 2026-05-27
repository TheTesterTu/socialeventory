
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Event } from "@/lib/types";
import { format } from "date-fns";
import { OptimizedImage } from "@/components/OptimizedImage";
import { cn } from "@/lib/utils";

interface ModernEventCardProps {
  event: Event;
  index?: number;
  variant?: "default" | "featured" | "compact";
}

export const ModernEventCard = ({ event, index = 0, variant = "default" }: ModernEventCardProps) => {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <Link to={`/events/${event.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className={cn(
          "group card-interactive overflow-hidden h-full rounded-lg",
          isFeatured && "md:col-span-2 md:row-span-2"
        )}
      >
        {/* Image */}
        <div className={cn(
          "relative overflow-hidden",
          isCompact ? "aspect-[16/9]" : "aspect-[4/3]",
          isFeatured && "md:aspect-[16/9]"
        )}>
          <OptimizedImage
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="badge-dark backdrop-blur-sm">
              {event.category[0]}
            </span>
          </div>

          {/* Like count on image */}
          {event.likes > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
              <Heart className="h-3.5 w-3.5 fill-current" />
              {event.likes}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Date */}
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <Calendar className="h-4 w-4" />
            {format(new Date(event.startDate), "EEE, MMM d · h:mm a")}
          </div>

          {/* Title */}
          <h3 className={cn(
            "font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors",
            isFeatured ? "text-xl md:text-2xl" : "text-lg"
          )}>
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{event.location.venue_name || event.location.address}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{event.attendees} attending</span>
            </div>
            
            <span className="text-primary font-medium text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              View details
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};
