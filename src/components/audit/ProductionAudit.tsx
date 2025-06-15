
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react";
import { DataSourceAudit } from "./DataSourceAudit";

interface AuditItem {
  name: string;
  status: 'complete' | 'partial' | 'missing' | 'pending';
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface AuditSection {
  title: string;
  items: AuditItem[];
  progress: number;
}

export const ProductionAudit = () => {
  const auditSections: AuditSection[] = [
    {
      title: "🎨 UI/UX & Design",
      progress: 90,
      items: [
        { name: "Responsive Design", status: 'complete', description: "Mobile-first design implemented", priority: 'high' },
        { name: "Loading States", status: 'complete', description: "PageLoader and skeleton components", priority: 'high' },
        { name: "Error States", status: 'complete', description: "Error boundaries and fallbacks", priority: 'high' },
        { name: "Color Consistency", status: 'partial', description: "Theme colors defined, some hardcoded values remain", priority: 'medium' },
        { name: "Component Architecture", status: 'partial', description: "Refactored social actions, more opportunities exist", priority: 'medium' },
        { name: "Accessibility", status: 'partial', description: "Basic ARIA labels, needs keyboard navigation", priority: 'medium' },
        { name: "Dark/Light Theme", status: 'complete', description: "Theme provider implemented", priority: 'medium' },
        { name: "Animation & Transitions", status: 'complete', description: "Framer Motion integrated", priority: 'low' },
      ]
    },
    {
      title: "👤 User Management",
      progress: 75,
      items: [
        { name: "Authentication", status: 'complete', description: "Supabase Auth with Google/Email", priority: 'high' },
        { name: "User Profiles", status: 'complete', description: "Profile creation and editing", priority: 'high' },
        { name: "Profile Pictures", status: 'complete', description: "Image upload to Supabase Storage", priority: 'medium' },
        { name: "User Preferences", status: 'partial', description: "Basic settings, needs expansion", priority: 'medium' },
        { name: "Account Verification", status: 'missing', description: "Email verification flow", priority: 'medium' },
      ]
    },
    {
      title: "📅 Event Management",
      progress: 90,
      items: [
        { name: "Event Creation", status: 'complete', description: "Full CRUD with image upload", priority: 'high' },
        { name: "Event Discovery", status: 'complete', description: "Search, filters, categories", priority: 'high' },
        { name: "Event Details", status: 'complete', description: "Comprehensive event pages", priority: 'high' },
        { name: "Event Images", status: 'complete', description: "Image upload and display", priority: 'high' },
        { name: "Event Interactions", status: 'complete', description: "Like, attend, comment", priority: 'high' },
        { name: "Event Verification", status: 'partial', description: "Admin verification system needed", priority: 'medium' },
      ]
    },
    {
      title: "💬 Community Features",
      progress: 90,
      items: [
        { name: "Event Comments", status: 'complete', description: "Real-time commenting system", priority: 'high' },
        { name: "Event Chat", status: 'complete', description: "Live chat with modal integration", priority: 'high' },
        { name: "User Notifications", status: 'complete', description: "Real-time notification system", priority: 'medium' },
        { name: "Social Sharing", status: 'complete', description: "Web Share API integrated for native sharing.", priority: 'medium' },
        { name: "Following System", status: 'missing', description: "Follow users/organizers", priority: 'low' },
      ]
    },
    {
      title: "🔧 Technical Infrastructure",
      progress: 85,
      items: [
        { name: "Database Schema", status: 'complete', description: "Supabase tables with RLS", priority: 'high' },
        { name: "File Storage", status: 'complete', description: "Supabase Storage buckets", priority: 'high' },
        { name: "Error Handling", status: 'complete', description: "Global error boundaries", priority: 'high' },
        { name: "Performance Optimization", status: 'complete', description: "React Query caching", priority: 'high' },
        { name: "SEO Optimization", status: 'complete', description: "Meta tags and structured data", priority: 'medium' },
        { name: "Security", status: 'partial', description: "RLS policies, needs audit", priority: 'high' },
      ]
    },
    {
      title: "🚀 Production Readiness",
      progress: 65,
      items: [
        { name: "Environment Config", status: 'complete', description: "Supabase environment setup", priority: 'high' },
        { name: "Error Monitoring", status: 'missing', description: "Need Sentry or similar", priority: 'high' },
        { name: "Analytics", status: 'partial', description: "Basic page views and key user interactions are tracked", priority: 'medium' },
        { name: "Content Moderation", status: 'missing', description: "Report/flag system", priority: 'medium' },
        { name: "Terms & Privacy", status: 'partial', description: "Pages exist, need legal review", priority: 'high' },
        { name: "GDPR Compliance", status: 'missing', description: "Data protection measures", priority: 'high' },
      ]
    }
  ];

  const getStatusIcon = (status: AuditItem['status']) => {
    switch (status) {
      case 'complete': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'partial': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'missing': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: AuditItem['status']) => {
    switch (status) {
      case 'complete': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'partial': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'missing': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'pending': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const overallProgress = Math.round(
    auditSections.reduce((acc, section) => acc + section.progress, 0) / auditSections.length
  );

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">🎯 Production Readiness Audit</CardTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <span className="text-sm font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <DataSourceAudit />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {auditSections.map((section) => (
          <Card key={section.title} className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <Badge variant="outline">{section.progress}%</Badge>
              </div>
              <Progress value={section.progress} className="h-1" />
            </CardHeader>
            <CardContent className="space-y-3">
              {section.items.map((item) => (
                <div key={item.name} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  {getStatusIcon(item.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{item.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(item.status)}`}
                      >
                        {item.status}
                      </Badge>
                      <Badge 
                        variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
