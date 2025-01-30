import { Calendar, MapPin, Heart, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Event } from "@/lib/mock-data";
import { format } from "date-fns";

interface EventCardProps extends Event {}

export const EventCard = ({ 
  id, 
  title, 
  date, 
  location, 
  imageUrl, 
  category,
  likes,
  attendees 
}: EventCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="event-card group">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover -z-10 transition-transform group-hover:scale-105"
      />
      
      <div className="relative space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary">
              {category}
            </span>
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex items-center text-sm text-muted-foreground gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(date), "PPp")}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {location}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full transition-colors",
              isLiked && "text-red-500 hover:text-red-600"
            )}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {likes} likes
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {attendees} attending
          </span>
        </div>

        <div className="pt-2">
          <Link to={`/event/${id}`}>
            <Button variant="secondary" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};