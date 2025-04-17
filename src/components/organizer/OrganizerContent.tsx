
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/EventCard";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { EventCategories } from "@/components/EventCategories";
import { CalendarClock, MapPin, Users, Badge, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/types";

interface OrganizerContentProps {
  activeEvents: Event[];
  pastEvents: Event[];
  name: string;
}

export const OrganizerContent = ({
  activeEvents,
  pastEvents,
  name
}: OrganizerContentProps) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  return (
    <Tabs defaultValue="upcoming" className="w-full mt-8" onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="upcoming" className="mt-4">
        <h2 className="text-xl font-semibold mb-6">Upcoming Events by {name}</h2>
        {activeEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEvents.map(event => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <AlertCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {name} doesn't have any upcoming events at the moment. 
              Check back later or browse past events.
            </p>
          </motion.div>
        )}
      </TabsContent>
      
      <TabsContent value="past" className="mt-4">
        <h2 className="text-xl font-semibold mb-6">Past Events by {name}</h2>
        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map(event => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <AlertCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No past events</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {name} hasn't organized any events in the past.
            </p>
          </motion.div>
        )}
      </TabsContent>
      
      <TabsContent value="about" className="mt-4">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">About {name}</h2>
            <p className="text-muted-foreground mb-6">
              {name} is a passionate event organizer dedicated to creating memorable experiences.
              With a focus on quality and participant satisfaction, they've established a reputation
              for well-organized and engaging events.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <EventCategories categories={["Tech", "Business", "Education"]} />
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Stats</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span>Organizing since 2020</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Based in San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>10,000+ total attendees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="h-4 w-4 text-muted-foreground" />
                    <span>Verified Organizer</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button variant="outline">Follow Organizer</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="reviews" className="mt-4">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Reviews & Ratings</h2>
            <p className="text-muted-foreground">
              Reviews will be available soon.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
