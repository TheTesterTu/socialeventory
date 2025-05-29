
import { AppLayout } from "@/components/layout/AppLayout";
import { ProductionAudit } from "@/components/audit/ProductionAudit";

const ProductionAuditPage = () => {
  return (
    <AppLayout 
      pageTitle="Production Audit | SocialEventory"
      pageDescription="Application readiness assessment for production deployment"
    >
      <div className="container mx-auto py-8 px-4">
        <ProductionAudit />
      </div>
    </AppLayout>
  );
};

export default ProductionAuditPage;
