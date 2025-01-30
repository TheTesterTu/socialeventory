import { Calendar, MapPin, Heart, Users, Clock, Tag, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Event } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "./ui/badge";

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
  accessibility
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
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(startDate), "PPp")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {format(new Date(endDate), "p")}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {location.venue ? `${location.venue}, ${location.address}` : location.address}
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
        
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {likes} likes
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {attendees} attending
            </span>
          </div>
          <span>
            {pricing.isFree ? (
              <Badge variant="secondary">Free</Badge>
            ) : (
              <Badge variant="secondary">
                {pricing.currency} {pricing.priceRange?.[0]}-{pricing.priceRange?.[1]}
              </Badge>
            )}
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