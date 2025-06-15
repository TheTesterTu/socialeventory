
import { AppLayout } from "@/components/layout/AppLayout";
import { SystemCheck } from "@/components/testing/SystemCheck";
import { motion } from "framer-motion";

const SystemTest = () => {
  return (
    <AppLayout pageTitle="System Test">
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">SocialEventory System Test</h1>
          <p className="text-muted-foreground">
            Comprehensive system check to ensure all functionality is working correctly
          </p>
        </div>
        
        <SystemCheck />
      </motion.div>
    </AppLayout>
  );
};

export default SystemTest;
