
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Event } from "@/lib/types";

interface ProfileEventsProps {
  events: Event[];
}

export const ProfileEvents = ({ events }: ProfileEventsProps) => {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">My Events</h2>
        <Button onClick={() => navigate('/create-event')} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No events created yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Start creating events and connect with people who share your interests.
              </p>
              <Button onClick={() => navigate('/create-event')} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Your First Event
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
