
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { mockEvents } from "@/lib/mock-data";
import { Event } from "@/lib/types";

const Profile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [publishedEvents, setPublishedEvents] = useState<Event[]>([]);
  const [draftEvents, setDraftEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Redirect to auth page if not logged in
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    // Fetch user data when authenticated
    if (user) {
      fetchUserData();
    }
  }, [user, authLoading, navigate]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // In a real app, these would be separate API calls to get the user's events
      // For now, we're using mockEvents with a delay to simulate API calls
      setTimeout(() => {
        // Filter mockEvents to create different lists
        const userEvents = mockEvents.slice(0, 6).map(event => ({
          ...event,
          key: event.id // Add key property for React list rendering
        }));
        
        const userSavedEvents = mockEvents.slice(2, 8).map(event => ({
          ...event,
          key: event.id
        }));
        
        const userPublishedEvents = mockEvents.slice(0, 4).map(event => ({
          ...event,
          key: event.id
        }));
        
        const userDraftEvents = mockEvents.slice(4, 6).map(event => ({
          ...event,
          key: event.id
        }));

        setEvents(userEvents);
        setSavedEvents(userSavedEvents);
        setPublishedEvents(userPublishedEvents);
        setDraftEvents(userDraftEvents);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container max-w-5xl mx-auto">
        <ProfileHeader isLoading={isLoading} />
        
        {!isLoading && (
          <ProfileContent
            events={events}
            savedEvents={savedEvents}
            publishedEvents={publishedEvents}
            draftEvents={draftEvents}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;
