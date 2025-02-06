
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { Location } from "@/lib/types";

interface EventHeaderProps {
  title: string;
  startDate: string;
  endDate: string;
  location: Location;
  category: string[];
}

export const EventHeader = ({ 
  title, 
  startDate, 
  endDate, 
  location, 
  category 
}: EventHeaderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {category.map((cat) => (
          <Badge key={cat} variant="secondary" className="hover:bg-primary/20">
            {cat}
          </Badge>
        ))}
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
        {title}
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {format(new Date(startDate), "PPP")}
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {format(new Date(startDate), "p")} - {format(new Date(endDate), "p")}
        </span>
      </div>
      <div className="flex items-center gap-1 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        {location.venue_name ? `${location.venue_name}, ${location.address}` : location.address}
      </div>
    </div>
  );
};
