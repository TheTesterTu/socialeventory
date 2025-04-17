
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Mail, Users, Star, ExternalLink, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { EventCard } from "@/components/EventCard";
import { useState, useEffect } from "react";
import NotFound from "@/pages/NotFound";

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

// Mock events data
const mockEvents = [
  {
    id: "e1",
    title: "Annual Corporate Leadership Summit",
    description: "Join us for a day of inspiring talks and networking with industry leaders.",
    startDate: "2025-06-15T09:00:00",
    endDate: "2025-06-15T17:00:00",
    location: {
      coordinates: [40.7128, -74.006],
      address: "123 Business Center, New York, NY",
      venue_name: "Grand Conference Center"
    },
    category: ["Conference", "Business", "Networking"],
    tags: ["leadership", "corporate", "professional development"],
    pricing: {
      isFree: false,
      priceRange: [199, 399],
      currency: "USD"
    },
    creator: {
      id: "1",
      type: "organizer"
    },
    verification: {
      status: "verified"
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
      coordinates: [40.7580, -73.9855],
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
      type: "organizer"
    },
    verification: {
      status: "verified"
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
      coordinates: [40.7331, -73.9902],
      address: "789 Learning Center, New York, NY",
      venue_name: "Professional Development Institute"
    },
    category: ["Workshop", "Business", "Education"],
    tags: ["training", "leadership", "skills development"],
    pricing: {
      isFree: false,
      priceRange: [299, 299],
      currency: "USD"
    },
    creator: {
      id: "1",
      type: "organizer"
    },
    verification: {
      status: "verified"
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
  const [events, setEvents] = useState(mockEvents.filter(event => event.creator.id === id));
  
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
        <div className="relative mb-8">
          <div className="h-48 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl" />
          <div className="absolute -bottom-12 left-6 flex items-end">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={organizer.avatar} alt={organizer.name} />
              <AvatarFallback>{organizer.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <div className="pt-12 pb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{organizer.name}</h1>
                {organizer.verified && (
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                )}
                {organizer.featured && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary ml-2">
                    Featured
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{organizer.location}</span>
                <span className="mx-2">•</span>
                <span>Since {organizer.foundedYear}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Mail className="h-4 w-4" />
                Contact
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              {organizer.website && (
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Website
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
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
            </div>
            
            <div>
              <Card className="bg-card/50 backdrop-blur-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Organization Info</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Team Size</p>
                      <p className="font-medium">{organizer.teamSize}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Events Organized</p>
                      <p className="font-medium">{organizer.eventCount}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{organizer.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(organizer.rating) 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-medium">{organizer.email}</p>
                      {organizer.phone && <p className="font-medium">{organizer.phone}</p>}
                    </div>
                    
                    {Object.keys(organizer.social).length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">Social</p>
                        <div className="flex gap-2 mt-1">
                          {organizer.social.twitter && (
                            <a href={`https://twitter.com/${organizer.social.twitter}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                              </Button>
                            </a>
                          )}
                          {organizer.social.instagram && (
                            <a href={`https://instagram.com/${organizer.social.instagram}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                              </Button>
                            </a>
                          )}
                          {organizer.social.facebook && (
                            <a href={`https://facebook.com/${organizer.social.facebook}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <Button className="w-full" onClick={() => window.location.href = '/create-event'}>
                      Create Event With This Organizer
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default OrganizerProfile;
