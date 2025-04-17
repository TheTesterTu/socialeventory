
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Event } from "@/lib/types";

interface SavedEventsProps {
  events: Event[];
}

export const SavedEvents = ({ events }: SavedEventsProps) => {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Saved Events</h2>
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
              <h3 className="text-lg font-medium mb-2">No saved events yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Browse events and save your favorites to find them easily later.
              </p>
              <Button onClick={() => navigate('/events')} variant="outline">
                Browse Events
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
