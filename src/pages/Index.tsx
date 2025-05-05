
import { AppLayout } from "@/components/layout/AppLayout";
import { HomeHero } from "@/components/home/HomeHero";
import { QuickCategories } from "@/components/home/QuickCategories";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { EventsNearYou } from "@/components/home/EventsNearYou";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { FeaturedCreators } from "@/components/home/FeaturedCreators";
import { FeaturedBlog } from "@/components/home/FeaturedBlog";
import { blogPosts } from "@/lib/mock-data/blog-data";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <AppLayout 
      pageTitle="Discover Events" 
      pageDescription="Find and join exciting events in your community"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto"
      >
        <HomeHero />
        
        <div className="space-y-16 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <QuickCategories />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <FeaturedCreators />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2">
              <FeaturedEvents />
            </div>
            <div className="space-y-8">
              <UpcomingEvents />
              <EventsNearYou />
            </div>
          </motion.div>

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
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-background/80 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10 hover:bg-primary/10">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Welcome to SocialEventory!</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover events around you, connect with organizers, and never miss out on exciting experiences.
                  </p>
                  <div className="pt-2">
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>Click on any event card to see details</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>Use filters to find specific events</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>Create your own events with the + button</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default Index;
