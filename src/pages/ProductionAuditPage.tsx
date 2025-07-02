
import { OptimizedAppLayout } from "@/components/layout/OptimizedAppLayout";
import { ProductionAudit } from "@/components/audit/ProductionAudit";
import { ProductionReadiness } from "@/components/testing/ProductionReadiness";
import { SystemCheck } from "@/components/testing/SystemCheck";
import { SecurityAudit } from "@/components/security/SecurityAudit";
import { ProductionChecklist } from "@/components/production/ProductionChecklist";
import { ComprehensiveTestRunner } from "@/components/admin/ComprehensiveTestRunner";
import { ErrorBoundaryFix } from "@/components/admin/ErrorBoundaryFix";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProductionAuditPage = () => {
  return (
    <OptimizedAppLayout 
      pageTitle="Production Audit" 
      pageDescription="Complete production readiness assessment"
    >
      <ErrorBoundaryFix>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Production Audit Dashboard
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive assessment of application readiness for production deployment
            </p>
          </div>

          <Tabs defaultValue="test-runner" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="test-runner">Test Runner</TabsTrigger>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="readiness">Readiness</TabsTrigger>
              <TabsTrigger value="audit">Feature Audit</TabsTrigger>
              <TabsTrigger value="system">System Check</TabsTrigger>
            </TabsList>

            <TabsContent value="test-runner" className="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>🧪 Comprehensive Test Runner & Auto-Fix</CardTitle>
                </CardHeader>
                <CardContent>
                  <ComprehensiveTestRunner />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="checklist" className="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>📋 Production Readiness Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductionChecklist />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>🔒 Security Audit</CardTitle>
                </CardHeader>
                <CardContent>
                  <SecurityAudit />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="readiness" className="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>🎯 Live Production Readiness Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductionReadiness />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="space-y-6">
              <ProductionAudit />
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>⚙️ System Health Check</CardTitle>
                </CardHeader>
                <CardContent>
                  <SystemCheck />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ErrorBoundaryFix>
    </OptimizedAppLayout>
  );
};

export default ProductionAuditPage;
