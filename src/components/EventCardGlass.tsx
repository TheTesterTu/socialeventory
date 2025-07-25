
import { Event } from "@/lib/types";
import { format } from "date-fns";
import { MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { EventVerificationBadge } from "./EventVerificationBadge";
import { EventSocialActions } from "./EventSocialActions";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface EventCardGlassProps {
  event: Event;
  className?: string;
  showSocialActions?: boolean;
}

export const EventCardGlass = ({ 
  event, 
  className,
  showSocialActions = true
}: EventCardGlassProps) => {
  const formattedDate = format(new Date(event.startDate), "MMM dd, yyyy");
  const formattedTime = format(new Date(event.startDate), "h:mm a");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "glass-card overflow-hidden rounded-2xl hover:shadow-xl transition-all duration-300 group mb-4 sm:mb-6",
        className
      )}
    >
      <div className="relative overflow-hidden">
        <img
          src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
          alt={event.title}
          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-3 left-3">
          {event.verification.status !== "pending" && (
            <EventVerificationBadge status={event.verification.status} size="sm" />
          )}
        </div>
        
        <div className="absolute bottom-3 left-3">
          <span className="glass-panel text-xs text-white px-3 py-1 rounded-full font-medium backdrop-blur-xl">
            {event.category[0]}
          </span>
        </div>
      </div>
      
      <div className="card-padding bg-card/90 backdrop-blur-xl">
        <div className="mobile-spacing">
          <Link to={`/event/${event.id}`} className="block group-hover:text-primary transition-colors">
            <h3 className="font-display font-semibold text-lg line-clamp-2 leading-tight text-foreground">
              {event.title}
            </h3>
          </Link>
          
          <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formattedDate}, {formattedTime}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{event.location.address}</span>
          </div>
        </div>
        
        {showSocialActions && (
          <div className="pt-3 border-t border-primary/20">
            <EventSocialActions
              eventId={event.id}
              comments={0}
              compact={true}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};
