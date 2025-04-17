
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
    description: "",
    imageUrl: "",
    coverImageUrl: "",
    website: "",
    socialLinks: {
      twitter: "",
      facebook: "",
      instagram: ""
    },
    location: "",
    followers: 0,
    events: 0,
    rating: 0,
    verified: false
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
          description: "We organize the best tech conferences in the Bay Area",
          imageUrl: "/placeholder.svg",
          coverImageUrl: "/placeholder.svg",
          website: "https://techconferences.example.com",
          socialLinks: {
            twitter: "https://twitter.com/techconf",
            facebook: "https://facebook.com/techconf",
            instagram: "https://instagram.com/techconf"
          },
          location: "San Francisco, CA",
          followers: 1250,
          events: 45,
          rating: 4.8,
          verified: true
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
          isLoading={isLoading}
          name={organizer.name}
          description={organizer.description}
          imageUrl={organizer.imageUrl}
          coverImageUrl={organizer.coverImageUrl}
          website={organizer.website}
          socialLinks={organizer.socialLinks}
          location={organizer.location}
          followers={organizer.followers}
          events={organizer.events}
          rating={organizer.rating}
          verified={organizer.verified}
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
