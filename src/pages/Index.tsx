
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { QuickCategories } from "@/components/home/QuickCategories";
import { EventsNearYou } from "@/components/home/EventsNearYou";
import { SEOHead } from "@/components/seo/SEOHead";
import { QueryErrorBoundary } from "@/components/error/QueryErrorBoundary";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { PageLoader } from "@/components/loading/PageLoader";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="SocialEventory - Discover Amazing Events Near You"
        description="Find and share the best local events. Connect with your community through concerts, workshops, cultural events and more."
      />
      
      {/* Hero without any container constraints */}
      <HomeHero />
      
      <QueryErrorBoundary>
        <Suspense fallback={<PageLoader message="Loading events..." />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-background"
          >
            <div className="container mx-auto px-4 py-8 space-y-12">
              <QuickCategories />
              <FeaturedEvents />
              <EventsNearYou />
            </div>
          </motion.div>
        </Suspense>
      </QueryErrorBoundary>
    </div>
  );
};

export default Index;
