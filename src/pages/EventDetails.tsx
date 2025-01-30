import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Share2, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const EventDetails = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);

  // Mock data - replace with real data fetch
  const event = {
    id,
    title: "Summer Night Festival",
    date: "Tomorrow at 8 PM",
    location: "Central Park",
    description: "Join us for an amazing night of music, art, and entertainment under the stars.",
    imageUrl: "/lovable-uploads/bbfe17ea-9d17-4ecd-b521-a6b69a98c062.png",
    organizer: "City Events",
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-[40vh] overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <main className="max-w-4xl mx-auto -mt-32 relative p-6">
        <div className="glass-panel rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-muted-foreground">By {event.organizer}</p>
            </div>
            <div className="flex gap-2">
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
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {event.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>
          </div>

          <div className="prose prose-invert max-w-none">
            <p>{event.description}</p>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1">Get Tickets</Button>
            <Button variant="outline" className="flex-1">
              Add to Calendar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;