
import { useState } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/EventCard";
import { Calendar, Settings, PlusCircle, UserPlus, Building2, MapPin, Mail, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Mock data for user's events
const mockUserEvents = [
  {
    id: "e1",
    title: "Tech Meetup: Web Development Trends",
    description: "Join fellow developers for an evening of discussions about the latest web development trends.",
    startDate: "2025-05-20T18:00:00",
    endDate: "2025-05-20T20:00:00",
    location: {
      coordinates: [40.7128, -74.006],
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
      type: "user"
    },
    verification: {
      status: "verified"
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
      coordinates: [40.7328, -73.9502],
      address: "456 Design Studio, Brooklyn, NY",
      venue_name: "Creative Space"
    },
    category: ["Workshop", "Design", "Education"],
    tags: ["design", "UX", "UI", "creative"],
    pricing: {
      isFree: false,
      priceRange: [25, 25],
      currency: "USD"
    },
    creator: {
      id: "1",
      type: "user"
    },
    verification: {
      status: "pending"
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

// Mock data for saved events
const mockSavedEvents = [
  {
    id: "s1",
    title: "Annual Food Festival",
    description: "Experience the best flavors from around the world at our annual food festival.",
    startDate: "2025-07-15T12:00:00",
    endDate: "2025-07-17T22:00:00",
    location: {
      coordinates: [40.7831, -73.9712],
      address: "789 Park Avenue, New York, NY",
      venue_name: "Central Park"
    },
    category: ["Food", "Festival", "Cultural"],
    tags: ["food", "cuisine", "international", "community"],
    pricing: {
      isFree: false,
      priceRange: [10, 10],
      currency: "USD"
    },
    creator: {
      id: "5",
      type: "organizer"
    },
    verification: {
      status: "verified"
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
      coordinates: [40.7580, -73.9855],
      address: "555 Business Center, Manhattan, NY",
      venue_name: "Innovation Hub"
    },
    category: ["Business", "Conference", "Networking"],
    tags: ["entrepreneurs", "startups", "business", "networking"],
    pricing: {
      isFree: false,
      priceRange: [149, 199],
      currency: "USD"
    },
    creator: {
      id: "2",
      type: "organizer"
    },
    verification: {
      status: "verified"
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <AppLayout>
      <motion.div 
        className="max-w-6xl mx-auto pt-10 pb-20 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-primary/20 to-accent/20" />
          <div className="px-8 pb-6 relative">
            <div className="flex flex-col md:flex-row gap-6 md:items-end">
              <div className="-mt-12">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                  <AvatarImage src={user?.user_metadata?.avatar || "https://i.pravatar.cc/150?img=12"} />
                  <AvatarFallback>
                    {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 md:pb-2">
                <h1 className="text-2xl font-bold">{user?.user_metadata?.name || "User Profile"}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {user?.email || "example@email.com"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user?.user_metadata?.location || "Location not set"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Member since {new Date(user?.created_at || Date.now()).getFullYear()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="events" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 md:w-[400px]">
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My Events</h2>
              <Button onClick={() => navigate('/create-event')} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Event
              </Button>
            </div>

            {mockUserEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockUserEvents.map(event => (
                  <EventCard key={event.id} event={event} />
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
          </TabsContent>

          <TabsContent value="saved" className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Saved Events</h2>
            </div>

            {mockSavedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockSavedEvents.map(event => (
                  <EventCard key={event.id} event={event} />
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
          </TabsContent>

          <TabsContent value="organizations" className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My Organizations</h2>
              <Button onClick={() => navigate('/organizers')} className="gap-2">
                <Building2 className="h-4 w-4" />
                Create Organization
              </Button>
            </div>

            {mockUserOrganizations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockUserOrganizations.map(org => (
                  <Card key={org.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="h-24 bg-gradient-to-r from-primary/20 to-accent/20" />
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between -mt-8 mb-4">
                        <Avatar className="h-16 w-16 border-4 border-background shadow-sm">
                          <AvatarImage src={org.avatar} />
                          <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Badge className="h-fit mt-2">{org.role}</Badge>
                      </div>
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {org.location}
                      </CardDescription>
                      <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{org.eventCount} events</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserPlus className="h-4 w-4" />
                          <span>{org.memberCount} members</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => navigate(`/organizer/${org.id}`)}
                      >
                        Manage Organization
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="flex flex-col items-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No organizations yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Create or join an organization to collaborate with others on events.
                    </p>
                    <Button onClick={() => navigate('/organizers')} className="gap-2">
                      <Building2 className="h-4 w-4" />
                      Create Organization
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input defaultValue={user?.user_metadata?.name || ""} placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue={user?.email || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input defaultValue={user?.user_metadata?.location || ""} placeholder="City, Country" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Interests</label>
                    <Input defaultValue="" placeholder="e.g. Tech, Music, Sports" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Input defaultValue={user?.user_metadata?.bio || ""} placeholder="Tell us about yourself" />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
};

export default Profile;
