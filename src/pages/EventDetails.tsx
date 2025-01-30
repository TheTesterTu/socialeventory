import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Share2, Heart, Users, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getEventById } from "@/lib/mock-data";
import { format } from "date-fns";

const EventDetails = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);

  const event = getEventById(id || "");

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>

        <div className="glass-panel rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary">
                {event.category}
              </span>
              <h1 className="text-3xl font-bold">{event.title}</h1>
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

          <div className="flex gap-6 text-sm">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(event.date), "PPp")}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {event.attendees} attending
            </span>
          </div>

          <div className="prose prose-invert max-w-none">
            <p>{event.description}</p>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1">
              <Users className="mr-2 h-4 w-4" />
              Join Event
            </Button>
            <Button variant="outline" className="flex-1">
              <Calendar className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;