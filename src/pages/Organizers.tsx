
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SearchBar } from "@/components/SearchBar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for organizers
const organizersData = [
  {
    id: "1",
    name: "EventMasters Group",
    avatar: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2274&auto=format&fit=crop",
    bio: "Professional event planning company with 10+ years of experience in corporate and social events.",
    rating: 4.8,
    eventCount: 145,
    featured: true,
    location: "New York, NY",
    categories: ["Corporate", "Wedding", "Conference"],
    verified: true
  },
  {
    id: "2",
    name: "Community Events Collective",
    avatar: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop",
    bio: "Grass-roots organization dedicated to bringing the community together through inclusive events.",
    rating: 4.6,
    eventCount: 92,
    featured: true,
    location: "Portland, OR",
    categories: ["Community", "Cultural", "Festival"],
    verified: true
  },
  {
    id: "3",
    name: "Tech Meetup Organizers",
    avatar: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    bio: "Bringing technology enthusiasts together through workshops, hackathons, and networking events.",
    rating: 4.7,
    eventCount: 78,
    featured: false,
    location: "San Francisco, CA",
    categories: ["Tech", "Workshop", "Networking"],
    verified: true
  },
  {
    id: "4",
    name: "Artistic Ventures",
    avatar: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=2071&auto=format&fit=crop",
    bio: "Celebrating art and creativity through exhibitions, performances, and interactive experiences.",
    rating: 4.5,
    eventCount: 64,
    featured: false,
    location: "Austin, TX",
    categories: ["Art", "Performance", "Exhibition"],
    verified: false
  },
  {
    id: "5",
    name: "Foodie Experiences",
    avatar: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
    bio: "Culinary events, food festivals, and cooking workshops for food enthusiasts.",
    rating: 4.9,
    eventCount: 103,
    featured: true,
    location: "Chicago, IL",
    categories: ["Food", "Festival", "Workshop"],
    verified: true
  },
  {
    id: "6",
    name: "Outdoor Adventure Club",
    avatar: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop",
    bio: "Connecting nature lovers through hiking trips, camping events, and outdoor activities.",
    rating: 4.7,
    eventCount: 87,
    featured: false,
    location: "Denver, CO",
    categories: ["Outdoor", "Sports", "Adventure"],
    verified: true
  }
];

const Organizers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrganizers, setFilteredOrganizers] = useState(organizersData);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredOrganizers(organizersData);
      return;
    }
    
    const filtered = organizersData.filter(
      (organizer) =>
        organizer.name.toLowerCase().includes(query.toLowerCase()) ||
        organizer.bio.toLowerCase().includes(query.toLowerCase()) ||
        organizer.location.toLowerCase().includes(query.toLowerCase()) ||
        organizer.categories.some(cat => cat.toLowerCase().includes(query.toLowerCase()))
    );
    
    setFilteredOrganizers(filtered);
  };

  return (
    <AppLayout
      pageTitle="Event Organizers"
      pageDescription="Discover the top event creators and organizers in your community"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="glass-panel p-4 rounded-xl mb-8">
          <SearchBar 
            onSearch={handleSearch} 
            initialValue={searchQuery} 
            placeholder="Search organizers by name, category, or location..."
          />
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Organizers</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganizers.map((organizer) => (
                <OrganizerCard key={organizer.id} organizer={organizer} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="featured" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganizers
                .filter((organizer) => organizer.featured)
                .map((organizer) => (
                  <OrganizerCard key={organizer.id} organizer={organizer} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="verified" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganizers
                .filter((organizer) => organizer.verified)
                .map((organizer) => (
                  <OrganizerCard key={organizer.id} organizer={organizer} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Become an Organizer</h2>
              <p className="text-muted-foreground">
                Start creating your own events and build your community. It's free to get started!
              </p>
            </div>
            <Button onClick={() => navigate('/create-event')} className="w-full md:w-auto">
              Create Your First Event
            </Button>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

interface OrganizerProps {
  organizer: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    rating: number;
    eventCount: number;
    featured: boolean;
    location: string;
    categories: string[];
    verified: boolean;
  };
}

const OrganizerCard = ({ organizer }: OrganizerProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage src={organizer.avatar} alt={organizer.name} />
                <AvatarFallback>{organizer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-1">
                  {organizer.name}
                  {organizer.verified && (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {organizer.location}
                </CardDescription>
              </div>
            </div>
            {organizer.featured && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Featured
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="py-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">{organizer.bio}</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {organizer.categories.map((category) => (
              <Badge key={category} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-border/50 pt-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{organizer.eventCount} events</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{organizer.rating} rating</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/organizer/${organizer.id}`)}
          >
            View
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default Organizers;
