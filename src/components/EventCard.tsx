import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Event } from "@/lib/types";
import { EventSocialActions } from "./EventSocialActions";
import { EventMetadata } from "./EventMetadata";
import { motion } from "framer-motion";

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
            <div className="flex flex-wrap gap-2">
              {category.map((cat) => (
                <span key={cat} className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary">
                  {cat}
                </span>
              ))}
              {verification.status === 'verified' && (
                <Badge variant="secondary" className="gap-1">
                  <Check className="h-3 w-3" /> Verified
                </Badge>
              )}
              {verification.status === 'featured' && (
                <Badge variant="default" className="gap-1">
                  <Check className="h-3 w-3" /> Featured
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          
          <EventSocialActions 
            eventId={id} 
            likes={likes} 
            comments={0}
          />
        </div>

        <EventMetadata
          startDate={startDate}
          endDate={endDate}
          location={location}
          tags={tags}
          attendees={attendees}
          pricing={pricing}
        />

        <div className="pt-2">
          <Link to={`/event/${id}`}>
            <Button variant="secondary" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};