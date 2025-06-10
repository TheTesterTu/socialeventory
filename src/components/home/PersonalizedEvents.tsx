
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/lib/types";
import { EventCard } from "@/components/EventCard";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react"; // Loader2 removed
// supabase import removed
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
// mapDatabaseEventToEvent and mapMockEventToEvent removed
import { usePersonalizedEvents } from "@/hooks/useEvents";
import { EventCardSkeleton } from "@/components/EventCardSkeleton";
// Alert components can be imported if a more detailed error message is desired
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle } from "lucide-react";


export const PersonalizedEvents = () => {
  const { user } = useAuth(); // user object can still be used for conditional UI elements if needed

  const {
    data: hookPersonalizedEvents,
    isLoading,
    error,
    // refetch // Available if a manual refresh button is desired
  } = usePersonalizedEvents(2); // Fetch 2 events

  const personalizedEvents = hookPersonalizedEvents || [];

  if (isLoading) {
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
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error("Error loading personalized events:", error);
    // Optionally, display a subtle error message or return null to hide the section
    // For now, returning null as per subtask suggestion
    return null;
  }

  // The hook provides fallback events even if user is not logged in or has no prefs.
  // So, we only return null if, after loading and no error, the events array is empty.
  // This might happen if the fallback also fails or returns nothing.
  if (personalizedEvents.length === 0) {
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
