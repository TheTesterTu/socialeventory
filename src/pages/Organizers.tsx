
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, Star, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";
import { Link } from "react-router-dom";
import { analytics } from "@/services/analytics";

// Mock data for organizers
const mockOrganizers = [
  {
    id: "1",
    name: "Cultural Events Co.",
    username: "culturalco",
    bio: "Bringing communities together through arts and culture",
    location: "New York, NY",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    eventsCount: 45,
    followersCount: 2340,
    rating: 4.8,
    verified: true,
    specialties: ["Music", "Art", "Culture"],
    upcomingEvents: 8
  },
  {
    id: "2", 
    name: "Tech Meetup Masters",
    username: "techmeetups",
    bio: "Connecting tech professionals through innovative events",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    eventsCount: 67,
    followersCount: 3200,
    rating: 4.9,
    verified: true,
    specialties: ["Technology", "Networking", "Innovation"],
    upcomingEvents: 12
  },
  {
    id: "3",
    name: "Wellness Collective",
    username: "wellnesscollective", 
    bio: "Promoting health and wellness through community events",
    location: "Los Angeles, CA",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    eventsCount: 23,
    followersCount: 1580,
    rating: 4.7,
    verified: false,
    specialties: ["Health", "Wellness", "Fitness"],
    upcomingEvents: 5
  }
];

const Organizers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [organizers, setOrganizers] = useState(mockOrganizers);

  useEffect(() => {
    // Track page view
    analytics.track('organizers_page_viewed');
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredOrganizers = organizers.filter(organizer => {
    const matchesSearch = organizer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      organizer.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      organizer.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || 
      organizer.specialties.some(spec => spec.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    analytics.track('organizers_search', { query: value });
  };

  const handleCategoryFilter = (category: string) => {
    const newCategory = category === "All" ? null : category;
    setSelectedCategory(newCategory);
    analytics.track('organizers_filter', { category: newCategory });
  };

  const getOrganizerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <AppLayout
        pageTitle="Event Organizers"
        pageDescription="Discover and connect with the best event organizers in your area"
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">Loading organizers...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      pageTitle="Event Organizers"
      pageDescription="Discover and connect with the best event organizers in your area"
    >
      <SEOHead 
        title="Event Organizers - SocialEventory"
        description="Discover and connect with the best event organizers in your area. Find professionals who create memorable experiences."
        type="website"
      />
      
      <div className="space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-display font-bold gradient-text">
            Event Organizers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with experienced event organizers who bring communities together through memorable experiences
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-xl space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search organizers by name, location, or specialty..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 glass-input"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {["All", "Music", "Technology", "Art", "Food", "Sports", "Business"].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        {filteredOrganizers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizers.map((organizer, index) => (
              <motion.div
                key={organizer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center pb-4">
                    <div className="relative mx-auto mb-4">
                      <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                        <AvatarImage src={organizer.avatar} alt={organizer.name} />
                        <AvatarFallback className="text-lg font-semibold">
                          {getOrganizerInitials(organizer.name)}
                        </AvatarFallback>
                      </Avatar>
                      {organizer.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                          <Award className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{organizer.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {organizer.location}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {organizer.bio}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {organizer.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-primary">{organizer.eventsCount}</div>
                        <div className="text-muted-foreground">Events</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-primary">{organizer.followersCount}</div>
                        <div className="text-muted-foreground">Followers</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{organizer.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {organizer.upcomingEvents} upcoming
                      </div>
                    </div>

                    <Link to={`/organizer/${organizer.id}`}>
                      <Button className="w-full gradient-primary">
                        View Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No organizers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default Organizers;
