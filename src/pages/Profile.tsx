
import { useState } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileEvents } from "@/components/profile/ProfileEvents";
import { SavedEvents } from "@/components/profile/SavedEvents";
import { OrganizationsList } from "@/components/profile/OrganizationsList";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { Event } from "@/lib/types";

// Mock data for user's events with fixed coordinates as tuples [number, number]
const mockUserEvents: Event[] = [
  {
    id: "e1",
    title: "Tech Meetup: Web Development Trends",
    description: "Join fellow developers for an evening of discussions about the latest web development trends.",
    startDate: "2025-05-20T18:00:00",
    endDate: "2025-05-20T20:00:00",
    location: {
      coordinates: [40.7128, -74.006] as [number, number],
      address: "123 Tech Hub, New York, NY",
      venue_name: "Developers Coworking"
    },
    category: ["Tech", "Networking", "Education"],
    tags: ["webdev", "coding", "frontend", "javascript"],
    pricing: {
      isFree: true
    },
    creator: {
      id: "1",
      type: "user" as "user"
    },
    verification: {
      status: "verified" as "verified"
    },
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
    likes: 42,
    attendees: 38,
    accessibility: {
      languages: ["English"],
      wheelchairAccessible: true,
      familyFriendly: false
    }
  },
  {
    id: "e2",
    title: "UX/UI Design Workshop",
    description: "Hands-on workshop covering the fundamentals of user experience and interface design.",
    startDate: "2025-06-05T09:00:00",
    endDate: "2025-06-05T16:00:00",
    location: {
      coordinates: [40.7328, -73.9502] as [number, number],
      address: "456 Design Studio, Brooklyn, NY",
      venue_name: "Creative Space"
    },
    category: ["Workshop", "Design", "Education"],
    tags: ["design", "UX", "UI", "creative"],
    pricing: {
      isFree: false,
      priceRange: [25, 25] as [number, number],
      currency: "USD"
    },
    creator: {
      id: "1",
      type: "user" as "user"
    },
    verification: {
      status: "pending" as "pending"
    },
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
    likes: 18,
    attendees: 12,
    accessibility: {
      languages: ["English"],
      wheelchairAccessible: true,
      familyFriendly: true
    }
  }
];

// Mock data for saved events with fixed coordinates as tuples [number, number]
const mockSavedEvents: Event[] = [
  {
    id: "s1",
    title: "Annual Food Festival",
    description: "Experience the best flavors from around the world at our annual food festival.",
    startDate: "2025-07-15T12:00:00",
    endDate: "2025-07-17T22:00:00",
    location: {
      coordinates: [40.7831, -73.9712] as [number, number],
      address: "789 Park Avenue, New York, NY",
      venue_name: "Central Park"
    },
    category: ["Food", "Festival", "Cultural"],
    tags: ["food", "cuisine", "international", "community"],
    pricing: {
      isFree: false,
      priceRange: [10, 10] as [number, number],
      currency: "USD"
    },
    creator: {
      id: "5",
      type: "organizer" as "organizer"
    },
    verification: {
      status: "verified" as "verified"
    },
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
    likes: 345,
    attendees: 1200,
    accessibility: {
      languages: ["English", "Spanish"],
      wheelchairAccessible: true,
      familyFriendly: true
    }
  },
  {
    id: "s2",
    title: "Entrepreneurship Summit",
    description: "Connect with industry leaders and fellow entrepreneurs at this inspirational summit.",
    startDate: "2025-08-10T09:00:00",
    endDate: "2025-08-11T17:00:00",
    location: {
      coordinates: [40.7580, -73.9855] as [number, number],
      address: "555 Business Center, Manhattan, NY",
      venue_name: "Innovation Hub"
    },
    category: ["Business", "Conference", "Networking"],
    tags: ["entrepreneurs", "startups", "business", "networking"],
    pricing: {
      isFree: false,
      priceRange: [149, 199] as [number, number],
      currency: "USD"
    },
    creator: {
      id: "2",
      type: "organizer" as "organizer"
    },
    verification: {
      status: "verified" as "verified"
    },
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop",
    likes: 127,
    attendees: 450,
    accessibility: {
      languages: ["English"],
      wheelchairAccessible: true,
      familyFriendly: false
    }
  }
];

// Mock user organizations
const mockUserOrganizations = [
  {
    id: "o1",
    name: "Tech Community Builders",
    avatar: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop",
    role: "Admin",
    eventCount: 8,
    memberCount: 345,
    location: "New York, NY"
  }
];

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("events");
  
  return (
    <AppLayout>
      <motion.div 
        className="max-w-6xl mx-auto pt-10 pb-20 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ProfileHeader user={user} />

        <Tabs defaultValue="events" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 md:w-[400px]">
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="pt-6">
            <ProfileEvents events={mockUserEvents} />
          </TabsContent>

          <TabsContent value="saved" className="pt-6">
            <SavedEvents events={mockSavedEvents} />
          </TabsContent>

          <TabsContent value="organizations" className="pt-6">
            <OrganizationsList organizations={mockUserOrganizations} />
          </TabsContent>

          <TabsContent value="profile" className="pt-6">
            <ProfileSettings user={user} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
};

export default Profile;
