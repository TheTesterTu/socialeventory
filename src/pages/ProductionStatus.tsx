
import { AppLayout } from "@/components/layout/AppLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { ProductionReadinessDashboard } from "@/components/ProductionReadinessDashboard";
import { motion } from "framer-motion";

const ProductionStatus = () => {
  return (
    <AppLayout pageTitle="Production Status">
      <SEOHead 
        title="Production Status - SocialEventory"
        description="Check the production readiness status of SocialEventory"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gradient">Production Status</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive check of all systems and integrations
            </p>
          </div>
          
          <ProductionReadinessDashboard />
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default ProductionStatus;
