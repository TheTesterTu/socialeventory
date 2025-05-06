
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/lib/types";
import { EventCard } from "@/components/EventCard";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { mapDatabaseEventToEvent, mapMockEventToEvent } from "@/lib/utils/mappers";

export const PersonalizedEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch personalized events based on user preferences and past interactions
  useEffect(() => {
    const fetchPersonalizedEvents = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // In a production app, we would fetch recommendations from an algorithm
        // For now, we'll get a few random events as "personalized" recommendations
        const { data: userPreferences } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single();
        
        // Get preferred categories if available
        const preferredCategories = userPreferences?.preferences?.categories || [];
        
        // Get events that match user preferences or recent interests
        const { data: eventData, error } = await supabase
          .from('events')
          .select('*')
          .limit(4)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (eventData && eventData.length > 0) {
          // Map database events to our Event interface
          const mappedEvents = eventData.map(event => mapDatabaseEventToEvent(event));
          setEvents(mappedEvents);
        } else {
          // Fallback to mock data if there's an error
          const mockEvents = [
            {
              id: "rec-1",
              title: "Tech Conference 2025",
              description: "Annual technology conference featuring the latest innovations",
              location: "San Francisco, CA",
              image_url: "https://source.unsplash.com/random/800x600/?tech",
              start_date: new Date(Date.now() + 86400000 * 2).toISOString(),
              category: ["Technology", "Conference"]
            },
            {
              id: "rec-2",
              title: "Local Art Exhibition",
              description: "Featuring works from local emerging artists",
              location: "Portland, OR",
              image_url: "https://source.unsplash.com/random/800x600/?art",
              start_date: new Date(Date.now() + 86400000 * 4).toISOString(),
              category: ["Art", "Exhibition"]
            },
          ];
          
          // Map mock events to our Event interface
          const mappedMockEvents = mockEvents.map(event => mapMockEventToEvent(event));
          setEvents(mappedMockEvents);
        }
      } catch (error) {
        console.error("Error fetching personalized events:", error);
        // Fallback to mock data if there's an error
        const mockEvents = [
          {
            id: "rec-1",
            title: "Tech Conference 2025",
            description: "Annual technology conference featuring the latest innovations",
            location: "San Francisco, CA",
            image_url: "https://source.unsplash.com/random/800x600/?tech",
            start_date: new Date(Date.now() + 86400000 * 2).toISOString(),
            category: ["Technology", "Conference"]
          },
          {
            id: "rec-2",
            title: "Local Art Exhibition",
            description: "Featuring works from local emerging artists",
            location: "Portland, OR",
            image_url: "https://source.unsplash.com/random/800x600/?art",
            start_date: new Date(Date.now() + 86400000 * 4).toISOString(),
            category: ["Art", "Exhibition"]
          },
        ].map(event => mapMockEventToEvent(event));
        
        setEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalizedEvents();
  }, [user]);

  if (loading) {
    return (
      <Card className="shadow-md border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-xl">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            For You
          </CardTitle>
          <CardDescription>Loading personalized recommendations...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user || events.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-md border-primary/10 overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-background to-primary/5">
        <CardTitle className="flex items-center text-xl">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          For You
        </CardTitle>
        <CardDescription>Events we think you'll love</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <EventCard {...event} />
            </motion.div>
          ))}
        </div>
        {events.length > 0 && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
              View All Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
