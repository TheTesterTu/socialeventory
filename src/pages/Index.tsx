
import { OptimizedAppLayout } from "@/components/layout/OptimizedAppLayout";
import { HomeHero } from "@/components/home/HomeHero";
import { QuickCategories } from "@/components/home/QuickCategories";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { EventsNearYou } from "@/components/home/EventsNearYou";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { FeaturedCreators } from "@/components/home/FeaturedCreators";
import { FeaturedBlog } from "@/components/home/FeaturedBlog";
import { PersonalizedEvents } from "@/components/home/PersonalizedEvents";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { SmartRecommendations } from "@/components/home/SmartRecommendations";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";

const Index = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { data: blogPosts = [] } = useBlogPosts();
  
  // Enable real-time events
  useRealtimeEvents();
  
  return (
    <OptimizedAppLayout 
      pageTitle="Discover Events" 
      pageDescription="Find and join exciting events in your community"
    >
      <WelcomeModal />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <HomeHero />
        
        <div className="container-padding max-w-7xl mx-auto mobile-spacing desktop-spacing section-spacing">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <QuickCategories />
          </motion.div>

          {user && (
            <>
              <Separator className="my-8 opacity-20 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <SmartRecommendations />
              </motion.div>

              <Separator className="my-8 opacity-20 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <PersonalizedEvents />
              </motion.div>
            </>
          )}

          <Separator className="my-8 opacity-20 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <FeaturedCreators />
          </motion.div>
          
          <Separator className="my-8 opacity-20 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-grid grid-cols-1 xl:grid-cols-3"
          >
            <div className="xl:col-span-2">
              <FeaturedEvents />
            </div>
            <div className="mobile-spacing desktop-spacing">
              <UpcomingEvents />
              <EventsNearYou />
            </div>
          </motion.div>

          <Separator className="my-8 opacity-20 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <FeaturedBlog posts={blogPosts} />
          </motion.div>
        </div>

        {isMobile && (
          <div className="fixed bottom-24 right-4 z-20">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="mobile-button rounded-full bg-background/80 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10 hover:bg-primary/10">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 card-padding border-primary/20 mr-4">
                <div className="mobile-spacing">
                  <h3 className="font-medium text-lg text-gradient">
                    Welcome to SocialEventory!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Discover events around you, connect with organizers, and never miss out on exciting experiences.
                  </p>
                  <div className="pt-2">
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>Tap any event card to see details</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>Use filters to find specific events</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>Create your own events easily</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </motion.div>
    </OptimizedAppLayout>
  );
};

export default Index;
