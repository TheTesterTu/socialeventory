
import { Event } from "@/lib/types";
import { EventHeader } from "./EventHeader";
import { EventMetadata } from "./EventMetadata";
import { EventActionButtons } from "./EventActionButtons";
import { EventComments } from "./EventComments";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";

interface EventDetailsContainerProps {
  event: Event;
}

export const EventDetailsContainer = ({ event }: EventDetailsContainerProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6"
    >
      <div className="relative h-[400px] rounded-xl overflow-hidden">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="space-y-6">
        <EventHeader 
          title={event.title}
          startDate={event.startDate}
          endDate={event.endDate}
          location={event.location}
          category={event.category}
        />

        <div className="prose prose-invert max-w-none">
          <p>{event.description}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {event.tags.map((tag) => (
            <span key={tag} className="text-sm text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors">
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <EventMetadata 
              startDate={event.startDate}
              endDate={event.endDate}
              location={event.location}
              tags={event.tags}
              attendees={event.attendees}
              pricing={event.pricing}
            />
            <EventActionButtons 
              eventId={event.id} 
              likes={event.likes} 
              comments={0}
              attendees={event.attendees}
            />
          </div>
        </div>

        <div className="pt-8">
          <h2 className="text-2xl font-semibold mb-6">Comments</h2>
          <EventComments eventId={event.id} />
        </div>
      </div>
    </motion.div>
  );
};
