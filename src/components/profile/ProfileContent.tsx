
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SavedEvents } from "@/components/profile/SavedEvents";
import { ProfileEvents } from "@/components/profile/ProfileEvents";
import { OrganizationsList } from "@/components/profile/OrganizationsList";
import { useNavigate } from "react-router-dom";
import { Event } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";

interface ProfileContentProps {
  events: Event[];
  savedEvents: Event[];
  publishedEvents: Event[];
  draftEvents: Event[];
}

export const ProfileContent = ({
  events,
  savedEvents,
  publishedEvents,
  draftEvents
}: ProfileContentProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-2">
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="mb-4">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="space-y-6">
          <div>
            <ProfileEvents title="Your Events" events={events} />
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <OrganizationsList
              title="Your Organizations"
              organizations={[
                {
                  id: "1",
                  name: "Tech Meetups SF",
                  imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
                  description: "Organizing tech meetups in San Francisco",
                  events: 12,
                  followers: 350
                },
                {
                  id: "2",
                  name: "Bay Area Hiking Club",
                  imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
                  description: "Weekend hikes and outdoor adventures",
                  events: 8,
                  followers: 420
                }
              ]}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <SavedEvents events={savedEvents} />
        </TabsContent>
        
        <TabsContent value="published">
          <ProfileEvents 
            title="Published Events" 
            events={publishedEvents}
            emptyMessage="You haven't published any events yet"
            emptyActionLabel="Create an event"
            emptyAction={() => navigate("/create-event")}
          />
        </TabsContent>
        
        <TabsContent value="drafts">
          <ProfileEvents 
            title="Draft Events" 
            events={draftEvents}
            emptyMessage="You have no draft events"
            emptyActionLabel="Create a draft"
            emptyAction={() => navigate("/create-event")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
