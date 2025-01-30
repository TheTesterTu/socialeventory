import { Calendar, MapPin, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
}

export const EventCard = ({ id, title, date, location, imageUrl }: EventCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="event-card group">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover -z-10 transition-transform group-hover:scale-105"
      />
      
      <div className="relative">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div className="flex items-center text-sm text-muted-foreground gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {date}
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
        
        <div className="mt-4">
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