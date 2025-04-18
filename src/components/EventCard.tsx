
import { motion } from "framer-motion";
import { Event } from "@/lib/types";
import { EventVerificationBadge } from "./EventVerificationBadge";
import { EventCategories } from "./EventCategories";
import { EventMetadata } from "./EventMetadata";
import { EventActionButtons } from "./EventActionButtons";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface EventCardProps extends Event {}

export const EventCard = ({ 
  id, 
  title,
  description,
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    setIsDialogOpen(false);
    navigate(`/event/${id}`);
  };

  return (
    <>
      <motion.div 
        className="event-card group relative h-[280px] md:h-[320px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setIsDialogOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background/90" />
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        
        <div className="relative h-full flex flex-col justify-between p-4">
          <div className="space-y-2">
            <EventCategories categories={category} />
            <EventVerificationBadge status={verification.status} />
            <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
          </div>

          <div className="space-y-4">
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
              attendees={attendees}
            />
          </div>

          <motion.div 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
          >
            <Button 
              size="sm" 
              variant="secondary" 
              className="rounded-full h-8 w-8 p-0 bg-background/70 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="sr-only">Event Details</DialogTitle>
          <div className="space-y-4">
            <div className="relative h-52 overflow-hidden rounded-t-lg">
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              <div className="absolute top-2 right-2">
                <EventVerificationBadge status={verification.status} />
              </div>
            </div>
            <div className="p-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {category.slice(0, 3).map(cat => (
                  <span key={cat} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {cat}
                  </span>
                ))}
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-3">
                {description}
              </p>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(startDate), "PPP p")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{location.venue_name ? `${location.venue_name}, ${location.address}` : location.address}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={handleViewDetails}>
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
