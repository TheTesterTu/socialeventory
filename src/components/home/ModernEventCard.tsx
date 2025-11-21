import { motion } from "framer-motion";
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
  return (
    <Link to={`/events/${event.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group relative overflow-hidden rounded-3xl glass-card card-lift h-full transition-all duration-300 border-2 hover:border-primary/30"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <OptimizedImage
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Modern category badge */}
          <div className="absolute top-4 left-4">
            <span className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white shadow-2xl backdrop-blur-xl">
              {event.category[0]}
            </span>
          </div>

          {/* Bottom gradient content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
            <h3 className="text-xl font-bold text-white line-clamp-2 drop-shadow-2xl">
              {event.title}
            </h3>
            
            <div className="flex items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-2 backdrop-blur-xl bg-white/10 px-3 py-1.5 rounded-full">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{format(new Date(event.startDate), "MMM d")}</span>
              </div>
              
              <div className="flex items-center gap-2 backdrop-blur-xl bg-white/10 px-3 py-1.5 rounded-full">
                <MapPin className="h-4 w-4" />
                <span className="font-medium line-clamp-1">{event.location.venue_name}</span>
              </div>
            </div>

            {/* Modern stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-white/90 backdrop-blur-xl bg-white/10 px-3 py-1.5 rounded-full">
                <Heart className="h-4 w-4" />
                <span className="font-bold">{event.likes}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 backdrop-blur-xl bg-white/10 px-3 py-1.5 rounded-full">
                <Users className="h-4 w-4" />
                <span className="font-bold">{event.attendees}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
