
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { OrganizerHeader } from "@/components/organizer/OrganizerHeader";
import { OrganizerContent } from "@/components/organizer/OrganizerContent";
import { mockEvents } from "@/lib/mock-data";
import { Event } from "@/lib/types";

const OrganizerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [organizer, setOrganizer] = useState({
    id: "",
    name: "",
    avatar: "",
    bio: "",
    description: "",
    website: "",
    email: "",
    rating: 0,
    eventCount: 0,
    featured: false,
    location: "",
    categories: [] as string[],
    verified: false,
    foundedYear: 2020,
    teamSize: "",
    social: {
      twitter: "",
      facebook: "",
      instagram: ""
    }
  });
  
  const [activeEvents, setActiveEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchOrganizerData();
  }, [id]);

  const fetchOrganizerData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with timeout
      setTimeout(() => {
        // Set organizer data
        setOrganizer({
          id: id || "1",
          name: "Tech Conferences Inc.",
          avatar: "/placeholder.svg",
          bio: "Premier tech conference organizer",
          description: "We organize the best tech conferences in the Bay Area",
          website: "https://techconferences.example.com",
          email: "contact@techconferences.example.com",
          rating: 4.8,
          eventCount: 45,
          featured: true,
          location: "San Francisco, CA",
          categories: ["Technology", "Business", "Education"],
          verified: true,
          foundedYear: 2015,
          teamSize: "11-50",
          social: {
            twitter: "https://twitter.com/techconf",
            facebook: "https://facebook.com/techconf",
            instagram: "https://instagram.com/techconf"
          }
        });
        
        // Filter events for this organizer
        // For active events, use the first half of mockEvents
        const active = mockEvents.slice(0, 3).map(event => ({
          ...event,
          key: event.id,
          creator: {
            id: id || "1",
            type: "organizer" as const
          }
        }));
        
        // For past events, use the second half of mockEvents
        const past = mockEvents.slice(4, 7).map(event => ({
          ...event,
          key: event.id,
          creator: {
            id: id || "1",
            type: "organizer" as const
          },
          startDate: "2023-01-15T18:00:00Z", // Set past date
          endDate: "2023-01-15T21:00:00Z"
        }));
        
        setActiveEvents(active);
        setPastEvents(past);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching organizer data:", error);
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="container max-w-5xl mx-auto">
        <OrganizerHeader
          organizer={organizer}
          isLoading={isLoading}
        />
        
        {!isLoading && (
          <OrganizerContent 
            activeEvents={activeEvents}
            pastEvents={pastEvents}
            name={organizer.name}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default OrganizerProfile;
