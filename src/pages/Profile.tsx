import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { ProfileCompleteness } from "@/components/profile/ProfileCompleteness";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Event } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mapDatabaseEventToEvent } from "@/lib/utils/mappers";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

const Profile = () => {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [publishedEvents, setPublishedEvents] = useState<Event[]>([]);
  const [draftEvents, setDraftEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // In a real app, we would fetch real events from the database
        // Here we're simulating it with a delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Fetch user events from database
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('created_by', user.id);
          
        if (error) throw error;
        
        // Use the data if available, otherwise use mock data
        if (data && data.length > 0) {
          const mappedEvents = data.map(event => mapDatabaseEventToEvent(event));
          setEvents(mappedEvents);
          
          // Filter events by verification status
          setPublishedEvents(mappedEvents.filter(event => 
            event.verification.status === 'verified' || event.verification.status === 'featured'));
          
          setDraftEvents(mappedEvents.filter(event => 
            event.verification.status === 'pending'));
        } else {
          // Mock data if no real data available - create Event objects directly
          const mockEvents: Event[] = [
            {
              id: "1",
              title: "Tech Meetup 2025",
              description: "A gathering of tech enthusiasts",
              startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
              endDate: new Date(Date.now() + 86400000 * 5 + 7200000).toISOString(),
              location: {
                coordinates: [37.7749, -122.4194],
                address: "San Francisco, CA",
                venue_name: "Tech Hub"
              },
              category: ["Technology", "Networking"],
              tags: ["tech", "networking"],
              accessibility: {
                languages: ["en"],
                wheelchairAccessible: false,
                familyFriendly: true
              },
              pricing: {
                isFree: true,
                currency: "USD"
              },
              creator: {
                id: user.id,
                type: "user" as const
              },
              verification: {
                status: "verified" as const
              },
              imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
              likes: 0,
              attendees: 0
            },
            {
              id: "2",
              title: "Art Exhibition",
              description: "Showcasing local artists' work",
              startDate: new Date(Date.now() + 86400000 * 12).toISOString(),
              endDate: new Date(Date.now() + 86400000 * 12 + 14400000).toISOString(),
              location: {
                coordinates: [40.7128, -74.0060],
                address: "New York, NY",
                venue_name: "Art Gallery"
              },
              category: ["Art", "Culture"],
              tags: ["art", "culture"],
              accessibility: {
                languages: ["en"],
                wheelchairAccessible: true,
                familyFriendly: true
              },
              pricing: {
                isFree: false,
                currency: "USD",
                priceRange: [15, 25]
              },
              creator: {
                id: user.id,
                type: "user" as const
              },
              verification: {
                status: "pending" as const
              },
              imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262",
              likes: 0,
              attendees: 0
            }
          ];
          
          setEvents(mockEvents);
          
          // Filter mock events by verification status
          setPublishedEvents(mockEvents.filter(event => 
            event.verification.status === 'verified' || event.verification.status === 'featured'));
          
          setDraftEvents(mockEvents.filter(event => 
            event.verification.status === 'pending'));
        }
        
        // Fetch saved events (likes or bookmarks)
        const { data: likedData, error: likedError } = await supabase
          .from('event_likes')
          .select('event_id')
          .eq('user_id', user.id);
          
        if (likedError) throw likedError;
        
        if (likedData && likedData.length > 0) {
          const eventIds = likedData.map(item => item.event_id);
          
          // Get the full event details for saved events
          const { data: savedEventData } = await supabase
            .from('events')
            .select('*')
            .in('id', eventIds);
            
          if (savedEventData) {
            const mappedSavedEvents = savedEventData.map(event => mapDatabaseEventToEvent(event));
            setSavedEvents(mappedSavedEvents);
          }
        } else {
          // Mock saved events
          const mockSavedEvents: Event[] = [
            {
              id: "3",
              title: "Music Festival",
              description: "Annual music celebration",
              startDate: new Date(Date.now() + 86400000 * 45).toISOString(),
              endDate: new Date(Date.now() + 86400000 * 45 + 28800000).toISOString(),
              location: {
                coordinates: [30.2672, -97.7431],
                address: "Austin, TX",
                venue_name: "Music Venue"
              },
              category: ["Music", "Festival"],
              tags: ["music", "festival"],
              accessibility: {
                languages: ["en"],
                wheelchairAccessible: true,
                familyFriendly: true
              },
              pricing: {
                isFree: false,
                currency: "USD",
                priceRange: [50, 150]
              },
              creator: {
                id: "other-user",
                type: "user" as const
              },
              verification: {
                status: "verified" as const
              },
              imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
              likes: 0,
              attendees: 0
            }
          ];
          
          setSavedEvents(mockSavedEvents);
        }
      } catch (error) {
        console.error("Error fetching user events:", error);
        toast.error("Could not load your events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserEvents();
  }, [user]);
  
  if (!user || !session) {
    return (
      <AppLayout 
        pageTitle="Loading Profile" 
        pageDescription="Please wait while we load your profile"
      >
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Loading profile...</h2>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout 
      pageTitle="My Profile" 
      pageDescription="Manage your profile, events and connections"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ProfileHeader user={user} isLoading={loading} />
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <ProfileCompleteness user={user} />
            
            <Card className="border border-border/50 shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Events</span>
                  <span className="font-medium">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saved Events</span>
                  <span className="font-medium">{savedEvents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Organizations</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <ProfileContent
              events={events}
              savedEvents={savedEvents}
              publishedEvents={publishedEvents}
              draftEvents={draftEvents}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
