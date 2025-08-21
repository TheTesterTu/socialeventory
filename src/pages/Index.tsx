
import { useEffect } from "react";
import { AppLayoutWithBoundary } from "@/components/layout/AppLayoutWithBoundary";
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { QuickCategories } from "@/components/home/QuickCategories";
import { EventsNearYou } from "@/components/home/EventsNearYou";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";

import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import { isDevelopment } from "@/utils/productionConfig";

const Index = () => {
  const { isConnected } = useRealtimeEvents();

  useEffect(() => {
    if (isConnected && isDevelopment()) {
      console.log('🔴 Real-time connection established on Index page');
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="SocialEventory - Discover Amazing Events Near You"
        description="Find and share the best local events. Connect with your community through concerts, workshops, cultural events and more."
      />
      
      {/* Hero without any container constraints */}
      <HomeHero />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-background"
      >
        <div className="container mx-auto px-4 py-8 space-y-12">
          <QuickCategories />
          <FeaturedEvents />
          <EventsNearYou />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
