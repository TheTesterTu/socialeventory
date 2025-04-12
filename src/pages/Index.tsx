
import { AppLayout } from "@/components/layout/AppLayout";
import { HomeHero } from "@/components/home/HomeHero";
import { QuickCategories } from "@/components/home/QuickCategories";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { EventsNearYou } from "@/components/home/EventsNearYou";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <AppLayout showTopBar={true}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-10"
      >
        <HomeHero />
        
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
      </motion.div>
    </AppLayout>
  );
};

export default Index;
