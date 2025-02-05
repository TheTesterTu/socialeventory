
import { Calendar, MapPin, Tag, Users } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Location } from "@/lib/types";

interface EventMetadataProps {
  startDate: string;
  endDate: string;
  location: Location;
  tags: string[];
  attendees: number;
  pricing: {
    isFree: boolean;
    currency?: string;
    priceRange?: [number, number];
  };
}

export const EventMetadata = ({
  startDate,
  endDate,
  location,
  tags,
  attendees,
  pricing
}: EventMetadataProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {format(new Date(startDate), "PPp")}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {location.venue_name ? `${location.venue_name}, ${location.address}` : location.address}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="text-xs text-muted-foreground flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {attendees} attending
        </span>
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
    </div>
  );
};
