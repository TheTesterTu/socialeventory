
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, Users, Star, Award, Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock organizer data
const mockOrganizer = {
  id: "1",
  name: "Cultural Events Co.",
  username: "culturalco",
  bio: "We are passionate about bringing communities together through arts, culture, and meaningful experiences. With over 5 years of experience organizing events, we specialize in creating memorable moments that celebrate diversity and creativity.",
  location: "New York, NY",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop",
  eventsCount: 45,
  followersCount: 2340,
  followingCount: 156,
  rating: 4.8,
  verified: true,
  specialties: ["Music", "Art", "Culture", "Community"],
  upcomingEvents: 8,
  completedEvents: 37,
  yearsActive: 5,
  socialLinks: {
    website: "https://culturalco.events",
    instagram: "@culturalco",
    twitter: "@culturalco"
  }
};


const OrganizerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <AppLayout pageTitle={mockOrganizer.name}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline" 
          size="sm" 
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-64 rounded-xl overflow-hidden"
        >
          <img
            src={mockOrganizer.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-xl -mt-20 relative z-10"
        >
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-background">
                <AvatarImage src={mockOrganizer.avatar} alt={mockOrganizer.name} />
                <AvatarFallback className="text-2xl">
                  {mockOrganizer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {mockOrganizer.verified && (
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                  <Award className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {mockOrganizer.name}
                  {mockOrganizer.verified && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Verified
                    </Badge>
                  )}
                </h1>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {mockOrganizer.location}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {mockOrganizer.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-primary">{mockOrganizer.eventsCount}</div>
                  <div className="text-muted-foreground">Events</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-primary">{mockOrganizer.followersCount}</div>
                  <div className="text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-primary">{mockOrganizer.rating}</div>
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    Rating
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button className="gradient-primary">
                Follow
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {mockOrganizer.bio}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Upcoming Events", value: mockOrganizer.upcomingEvents, icon: Calendar },
            { label: "Completed Events", value: mockOrganizer.completedEvents, icon: Award },
            { label: "Years Active", value: mockOrganizer.yearsActive, icon: Star },
            { label: "Total Attendees", value: "5.2K", icon: Users }
          ].map((stat, index) => (
            <Card key={stat.label} className="glass-card text-center">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center py-8">
                No events to display for this organizer.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default OrganizerProfile;
