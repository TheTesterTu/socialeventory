
import { Event } from "@/lib/types";
import { format } from "date-fns";
import { MapPin, Calendar, Users } from "lucide-react";
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
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "glass-panel overflow-hidden border border-white/10 hover:border-primary/50 transition-all",
        className
      )}
    >
      <div className="relative">
        <img
          src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
          alt={event.title}
          className="aspect-video w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2">
            {event.verification.status !== "pending" && (
              <EventVerificationBadge status={event.verification.status} size="sm" />
            )}
            <span className="text-xs text-white/70 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm">
              {event.category[0]}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <Link to={`/event/${event.id}`} className="block hover:opacity-90 transition-opacity">
            <h3 className="font-bold text-lg line-clamp-1">{event.title}</h3>
          </Link>
          
          <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}, {formattedTime}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{event.location.address}</span>
          </div>
        </div>
        
        {showSocialActions && (
          <div className="pt-2 border-t border-border/50">
            <EventSocialActions
              eventId={event.id}
              likes={event.likes}
              attendees={event.attendees}
              comments={0}
              compact={true}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};
