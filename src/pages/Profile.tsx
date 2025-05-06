
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
          setEvents(data as Event[]);
          setPublishedEvents(data.filter((event: any) => 
            event.verification_status === 'verified') as Event[]);
          setDraftEvents(data.filter((event: any) => 
            event.verification_status === 'draft') as Event[]);
        } else {
          // Mock data if no real data available
          const mockEvents = [
            {
              id: "1",
              title: "Tech Meetup 2025",
              description: "A gathering of tech enthusiasts",
              location: "San Francisco, CA",
              image_url: "https://source.unsplash.com/random/800x600/?tech",
              start_date: new Date(Date.now() + 86400000 * 5).toISOString(),
              verification_status: 'verified',
              category: ["Technology", "Networking"]
            },
            {
              id: "2",
              title: "Art Exhibition",
              description: "Showcasing local artists' work",
              location: "New York, NY",
              image_url: "https://source.unsplash.com/random/800x600/?art",
              start_date: new Date(Date.now() + 86400000 * 12).toISOString(),
              verification_status: 'draft',
              category: ["Art", "Culture"]
            }
          ] as Event[];
          
          setEvents(mockEvents);
          setPublishedEvents(mockEvents.filter(e => e.verification_status === 'verified'));
          setDraftEvents(mockEvents.filter(e => e.verification_status === 'draft'));
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
            setSavedEvents(savedEventData as Event[]);
          }
        } else {
          // Mock saved events
          setSavedEvents([
            {
              id: "3",
              title: "Music Festival",
              description: "Annual music celebration",
              location: "Austin, TX",
              image_url: "https://source.unsplash.com/random/800x600/?music",
              start_date: new Date(Date.now() + 86400000 * 45).toISOString(),
              category: ["Music", "Festival"]
            }
          ] as Event[]);
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
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3 lg:col-span-1 space-y-6">
            <ProfileCompleteness user={user} />
            {/* Add more widgets in the sidebar as needed */}
          </div>
          
          <div className="md:col-span-3 lg:col-span-2">
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
