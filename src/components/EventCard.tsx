import { motion } from "framer-motion";
import { Event } from "@/lib/types";
import { EventVerificationBadge } from "./EventVerificationBadge";
import { EventCategories } from "./EventCategories";
import { EventMetadata } from "./EventMetadata";
import { EventActionButtons } from "./EventActionButtons";

interface EventCardProps extends Event {}

export const EventCard = ({ 
  id, 
  title,
  startDate,
  endDate,
  location,
  imageUrl,
  category,
  tags,
  likes,
  attendees,
  verification,
  pricing,
}: EventCardProps) => {
  return (
    <motion.div 
      className="event-card group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover -z-10 transition-transform group-hover:scale-105"
      />
      
      <div className="relative space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <EventCategories categories={category} />
            <EventVerificationBadge status={verification.status} />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        </div>

        <EventMetadata
          startDate={startDate}
          endDate={endDate}
          location={location}
          tags={tags}
          attendees={attendees}
          pricing={pricing}
        />

        <EventActionButtons
          eventId={id}
          likes={likes}
          comments={0}
        />
      </div>
    </motion.div>
  );
};