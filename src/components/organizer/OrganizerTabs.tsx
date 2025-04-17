
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/EventCard";
import { Link } from "react-router-dom";
import { Event } from "@/lib/types";

interface OrganizerTabsProps {
  organizer: {
    name: string;
    description: string;
    categories: string[];
  };
  events: Event[];
}

export const OrganizerTabs = ({ organizer, events }: OrganizerTabsProps) => {
  return (
    <Tabs defaultValue="about">
      <TabsList>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about" className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">About {organizer.name}</h3>
            <p className="text-muted-foreground whitespace-pre-line">{organizer.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {organizer.categories.map(category => (
                <Badge key={category} variant="secondary">{category}</Badge>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="events" className="pt-6">
        <div className="space-y-6">
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map(event => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No upcoming events</p>
            </div>
          )}
          
          <div className="flex justify-center">
            <Link to="/events">
              <Button variant="outline">View All Events</Button>
            </Link>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="reviews" className="pt-6">
        <div className="text-center py-20">
          <p className="text-muted-foreground">Reviews coming soon</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
