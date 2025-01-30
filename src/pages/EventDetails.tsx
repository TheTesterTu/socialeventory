import { useParams } from "react-router-dom";
import { getEventById } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Heart, Share2, Clock, Tag } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const EventDetails = () => {
  const { id } = useParams();
  const event = getEventById(id || "");

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {event.category.map((cat) => (
                  <Badge key={cat} variant="secondary">
                    {cat}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl font-bold">{event.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(event.startDate), "PPP")}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(new Date(event.startDate), "p")} - {format(new Date(event.endDate), "p")}
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {event.location.venue ? `${event.location.venue}, ${event.location.address}` : event.location.address}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p>{event.description}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            {event.tags.map((tag) => (
              <span key={tag} className="text-sm text-muted-foreground flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {event.likes} likes
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {event.attendees} attending
              </span>
            </div>
            <span>
              {event.pricing.isFree ? (
                <Badge variant="secondary">Free</Badge>
              ) : (
                <Badge variant="secondary">
                  {event.pricing.currency} {event.pricing.priceRange?.[0]}-{event.pricing.priceRange?.[1]}
                </Badge>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;