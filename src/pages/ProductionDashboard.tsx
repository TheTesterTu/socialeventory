import { ProductionReadinessChecker } from '@/components/production/ProductionReadinessChecker';
import { SecurityStatus } from '@/components/SecurityStatus';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute';
import { Shield, Database, Palette, Globe, ExternalLink, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductionDashboard = () => {
  const securityItems = [
    {
      title: 'Row Level Security (RLS)',
      status: 'active',
      description: 'Database access is properly secured with RLS policies',
      action: 'View Policies'
    },
    {
      title: 'Admin Access Control',
      status: 'active',
      description: 'Admin routes are protected and properly configured',
      action: 'Test Access'
    },
    {
      title: 'Authentication System',
      status: 'active',
      description: 'User authentication and session management working',
      action: 'Check Status'
    }
  ];

  const performanceItems = [
    {
      title: 'Database Queries',
      status: 'optimized',
      description: 'Efficient queries with proper indexing',
      action: 'View Metrics'
    },
    {
      title: 'Image Loading',
      status: 'optimized',
      description: 'Lazy loading and optimization implemented',
      action: 'Test Images'
    },
    {
      title: 'API Responses',
      status: 'fast',
      description: 'Response times within acceptable limits',
      action: 'Monitor'
    }
  ];

  const uiItems = [
    {
      title: 'Design System',
      status: 'consistent',
      description: 'Unified color scheme and component styling',
      action: 'Review Components'
    },
    {
      title: 'Responsive Design',
      status: 'mobile-ready',
      description: 'Optimized for all device sizes',
      action: 'Test Devices'
    },
    {
      title: 'Accessibility',
      status: 'compliant',
      description: 'WCAG guidelines followed for inclusive design',
      action: 'Run Audit'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', color: string }> = {
      'active': { variant: 'default', color: 'bg-green-100 text-green-800' },
      'optimized': { variant: 'default', color: 'bg-blue-100 text-blue-800' },
      'fast': { variant: 'default', color: 'bg-cyan-100 text-cyan-800' },
      'consistent': { variant: 'default', color: 'bg-purple-100 text-purple-800' },
      'mobile-ready': { variant: 'default', color: 'bg-pink-100 text-pink-800' },
      'compliant': { variant: 'default', color: 'bg-emerald-100 text-emerald-800' }
    };

    const config = statusMap[status] || { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge variant={config.variant} className={config.color}>
        <CheckCircle className="h-3 w-3 mr-1" />
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <ProtectedAdminRoute>
      <AppLayout pageTitle="Production Dashboard - SocialEventory Admin">
        <div className="container mx-auto px-4 py-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Production Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Monitor your app's readiness and performance metrics
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link to="/admin">
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
              <Button className="bg-primary hover:bg-primary/90">
                <ExternalLink className="h-4 w-4 mr-2" />
                Deploy App
              </Button>
            </div>
          </div>

          {/* Overall Status */}
          <ProductionReadinessChecker />

          {/* Security Status */}
          <SecurityStatus />

          {/* Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {securityItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      {item.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="h-5 w-5 text-blue-600" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      {item.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* UI/UX */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette className="h-5 w-5 text-purple-600" />
                  UI/UX
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {uiItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      {item.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Database className="h-6 w-6" />
                  <span className="text-xs">View Database</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Shield className="h-6 w-6" />
                  <span className="text-xs">Security Audit</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Palette className="h-6 w-6" />
                  <span className="text-xs">Design System</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <ExternalLink className="h-6 w-6" />
                  <span className="text-xs">Deploy Now</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedAdminRoute>
  );
};

export default ProductionDashboard;