
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

import { useTopOrganizers } from "@/hooks/useTopOrganizers";

const Organizers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { organizers = [], loading: isLoading } = useTopOrganizers();

  useEffect(() => {
    // Track page view
    analytics.track('organizers_page_viewed');
  }, []);

  const filteredOrganizers = organizers.filter(organizer => {
    const matchesSearch = organizer.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
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
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'OR';
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
          
          <div className="text-sm text-muted-foreground">
            Showing {organizers.length} verified event organizers
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
                       <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                         <Award className="h-3 w-3 text-white" />
                       </div>
                     </div>
                     
                     <div className="space-y-2">
                       <h3 className="font-semibold text-lg">{organizer.name}</h3>
                       <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                         <MapPin className="h-3 w-3" />
                         {organizer.role}
                       </p>
                     </div>
                  </CardHeader>

                   <CardContent className="space-y-4">
                     <p className="text-sm text-muted-foreground line-clamp-2">
                       Event organizer passionate about creating memorable experiences.
                     </p>

                     <div className="flex flex-wrap gap-1">
                       <Badge variant="secondary" className="text-xs">
                         {organizer.type}
                       </Badge>
                     </div>

                     <div className="grid grid-cols-2 gap-4 text-sm">
                       <div className="text-center">
                         <div className="font-semibold text-primary">{organizer.events}</div>
                         <div className="text-muted-foreground">Events</div>
                       </div>
                       <div className="text-center">
                         <div className="font-semibold text-primary">{organizer.events * 12}</div>
                         <div className="text-muted-foreground">Likes</div>
                       </div>
                     </div>

                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-1">
                         <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                         <span className="text-sm font-medium">5.0</span>
                       </div>
                       <div className="flex items-center gap-1 text-sm text-muted-foreground">
                         <Calendar className="h-3 w-3" />
                         Active organizer
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
