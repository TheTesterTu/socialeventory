
import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { QuickCategories } from "@/components/home/QuickCategories";
import { EventsNearYou } from "@/components/home/EventsNearYou";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import { ProductionReadyBanner } from "@/components/ProductionReadyBanner";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";

const Index = () => {
  const { isConnected } = useRealtimeEvents();

  useEffect(() => {
    if (isConnected) {
      console.log('🔴 Real-time connection established');
    }
  }, [isConnected]);

  return (
    <AppLayout>
      <SEOHead 
        title="SocialEventory - Discover Amazing Events Near You"
        description="Find and share the best local events. Connect with your community through concerts, workshops, cultural events and more."
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <div className="container mx-auto px-4 py-8 space-y-12">
          <ProductionReadyBanner />
          
          <HomeHero />
          
          <QuickCategories />
          
          <FeaturedEvents />
          
          <EventsNearYou />
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Index;
