import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import NotFound from "@/pages/NotFound";
import { OrganizerHeader } from "@/components/organizer/OrganizerHeader";
import { OrganizerTabs } from "@/components/organizer/OrganizerTabs";
import { OrganizerInfo } from "@/components/organizer/OrganizerInfo";
import { Event } from "@/lib/types";

// Same mock data as in Organizers.tsx
const organizersData = [
  {
    id: "1",
    name: "EventMasters Group",
    avatar: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2274&auto=format&fit=crop",
    bio: "Professional event planning company with 10+ years of experience in corporate and social events.",
    description: "EventMasters Group is a premier event planning company specializing in corporate events, conferences, and social gatherings. With over a decade of experience, our team of seasoned professionals is dedicated to creating memorable experiences tailored to our clients' unique needs. We handle everything from venue selection and decor to catering and entertainment, ensuring a seamless event execution every time.",
    website: "www.eventmastersgroup.com",
    email: "contact@eventmastersgroup.com",
    phone: "(555) 123-4567",
    rating: 4.8,
    eventCount: 145,
    featured: true,
    location: "New York, NY",
    categories: ["Corporate", "Wedding", "Conference"],
    verified: true,
    foundedYear: 2010,
    teamSize: "15-30 people",
    social: {
      twitter: "eventmasters",
      instagram: "eventmastersgroup",
      facebook: "EventMastersGroup"
    }
  },
  {
    id: "2",
    name: "Community Events Collective",
    avatar: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop",
    bio: "Grass-roots organization dedicated to bringing the community together through inclusive events.",
    description: "Community Events Collective is a grass-roots organization founded with the mission of strengthening community bonds through inclusive events. We focus on creating accessible, affordable, and engaging activities that celebrate diversity and foster a sense of belonging. Our team works closely with local businesses, artists, and community leaders to create authentic experiences that reflect the unique character of each neighborhood we serve.",
    website: "www.communityeventscollective.org",
    email: "info@communityeventscollective.org",
    phone: "(555) 234-5678",
    rating: 4.6,
    eventCount: 92,
    featured: true,
    location: "Portland, OR",
    categories: ["Community", "Cultural", "Festival"],
    verified: true,
    foundedYear: 2015,
    teamSize: "5-15 people",
    social: {
      twitter: "commevents",
      instagram: "communityeventscollective",
      facebook: "CommunityEventsCollective"
    }
  },
  // ... other organizers data from the previous file
];

// Mock events data with fixed coordinates as tuples [number, number]
const mockEvents: Event[] = [
  {
    id: "e1",
    title: "Annual Corporate Leadership Summit",
    description: "Join us for a day of inspiring talks and networking with industry leaders.",
    startDate: "2025-06-15T09:00:00",
    endDate: "2025-06-15T17:00:00",
    location: {
      coordinates: [40.7128, -74.006] as [number, number],
      address: "123 Business Center, New York, NY",
      venue_name: "Grand Conference Center"
    },
    category: ["Conference", "Business", "Networking"],
    tags: ["leadership", "corporate", "professional development"],
    pricing: {
      isFree: false,
      priceRange: [199, 399] as [number, number],
      currency: "USD"
    },
    creator: {
      id: "1",
      type: "organizer" as "organizer"
    },
    verification: {
      status: "verified" as "verified"
    },
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    likes: 128,
    attendees: 342,
    accessibility: {
      languages: ["English"],
      wheelchairAccessible: true,
      familyFriendly: false
    }
  },
  {
    id: "e2",
    title: "Product Launch & Networking Mixer",
    description: "Be the first to see our newest innovations and connect with industry professionals.",
    startDate: "2025-07-22T18:00:00",
    endDate: "2025-07-22T21:00:00",
    location: {
      coordinates: [40.7580, -73.9855] as [number, number],
      address: "555 Tech Plaza, New York, NY",
      venue_name: "Innovation Hub"
    },
    category: ["Networking", "Tech", "Product Launch"],
    tags: ["innovation", "technology", "networking"],
    pricing: {
      isFree: true
    },
    creator: {
      id: "1",
      type: "organizer" as "organizer"
    },
    verification: {
      status: "verified" as "verified"
    },
    imageUrl: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=2071&auto=format&fit=crop",
    likes: 89,
    attendees: 175,
    accessibility: {
      languages: ["English"],
      wheelchairAccessible: true,
      familyFriendly: true
    }
  },
  {
    id: "e3",
    title: "Executive Training Workshop",
    description: "Intensive one-day workshop to develop essential leadership skills.",
    startDate: "2025-08-10T09:30:00",
    endDate: "2025-08-10T16:30:00",
    location: {
      coordinates: [40.7331, -73.9902] as [number, number],
      address: "789 Learning Center, New York, NY",
      venue_name: "Professional Development Institute"
    },
    category: ["Workshop", "Business", "Education"],
    tags: ["training", "leadership", "skills development"],
    pricing: {
      isFree: false,
      priceRange: [299, 299] as [number, number],
      currency: "USD"
    },
    creator: {
      id: "1",
      type: "organizer" as "organizer"
    },
    verification: {
      status: "verified" as "verified"
    },
    imageUrl: "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2070&auto=format&fit=crop",
    likes: 42,
    attendees: 28,
    accessibility: {
      languages: ["English"],
      wheelchairAccessible: true,
      familyFriendly: false
    }
  }
];

const OrganizerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [organizer, setOrganizer] = useState(organizersData.find(org => org.id === id));
  const [events, setEvents] = useState<Event[]>(mockEvents.filter(event => event.creator.id === id));
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    window.scrollTo(0, 0);
  }, [id]);
  
  if (!organizer) {
    return <NotFound />;
  }
  
  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto"
      >
        <OrganizerHeader organizer={organizer} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <OrganizerTabs organizer={organizer} events={events} />
          </div>
          
          <div>
            <OrganizerInfo organizer={organizer} />
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default OrganizerProfile;
