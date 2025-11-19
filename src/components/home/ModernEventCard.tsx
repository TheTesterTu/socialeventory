import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Event } from "@/lib/types";
import { format } from "date-fns";
import { OptimizedImage } from "@/components/OptimizedImage";

interface ModernEventCardProps {
  event: Event;
  index?: number;
}

export const ModernEventCard = ({ event, index = 0 }: ModernEventCardProps) => {
  const categoryColor = event.category[0]?.toLowerCase() || 'default';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Link to={`/events/${event.id}`}>
        <Card className="group overflow-hidden border-0 bg-card hover:shadow-2xl transition-all duration-300">
          {/* Image Container with Overlay */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <OptimizedImage
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <Badge 
                className={`bg-category-${categoryColor} text-white border-0 shadow-lg backdrop-blur-sm`}
              >
                {event.category[0]}
              </Badge>
            </div>
            
            {/* Like Count */}
            {event.likes > 0 && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
                <Heart className="h-4 w-4 text-like fill-like" />
                <span className="text-sm font-medium text-white">{event.likes}</span>
              </div>
            )}
            
            {/* Event Title (on image) */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white line-clamp-2 drop-shadow-lg">
                {event.title}
              </h3>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-5 space-y-4">
            {/* Date & Location */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  {format(new Date(event.startDate), "EEE, MMM d · h:mm a")}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="line-clamp-1">{event.location.address}</span>
              </div>
            </div>
            
            {/* Attendees */}
            {event.attendees > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <Users className="h-4 w-4 text-attend" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{event.attendees}</span> attending
                </span>
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
