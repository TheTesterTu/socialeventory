
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SavedEvents } from "@/components/profile/SavedEvents";
import { ProfileEvents } from "@/components/profile/ProfileEvents";
import { OrganizationsList } from "@/components/profile/OrganizationsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Event } from "@/lib/types";

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
  
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid grid-cols-4 w-fit">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
            
            <Button onClick={() => navigate("/create-event")} className="gap-1">
              <Plus size={16} />
              Create Event
            </Button>
          </div>
          
          <TabsContent value="all" className="mt-4 space-y-6">
            <ProfileEvents title="Your Events" events={events} />
            
            <OrganizationsList
              title="Your Organizations"
              organizations={[
                {
                  id: "1",
                  name: "Tech Meetups SF",
                  imageUrl: "/placeholder.svg",
                  description: "Organizing tech meetups in San Francisco",
                  events: 12,
                  followers: 350
                },
                {
                  id: "2",
                  name: "Bay Area Hiking Club",
                  imageUrl: "/placeholder.svg",
                  description: "Weekend hikes and outdoor adventures",
                  events: 8,
                  followers: 420
                }
              ]}
            />
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
    </div>
  );
};
