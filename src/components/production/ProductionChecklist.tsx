
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  category: 'security' | 'performance' | 'deployment' | 'monitoring';
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
}

const checklistItems: ChecklistItem[] = [
  {
    id: 'rls-policies',
    title: 'Row Level Security Policies',
    description: 'Database access control and user isolation',
    status: 'completed',
    category: 'security',
    priority: 'high'
  },
  {
    id: 'error-boundaries',
    title: 'Error Boundaries & Monitoring',
    description: 'Production error handling and reporting',
    status: 'completed',
    category: 'monitoring',
    priority: 'high'
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    description: 'Bundle size, caching, and loading optimization',
    status: 'completed',
    category: 'performance',
    priority: 'medium'
  },
  {
    id: 'env-variables',
    title: 'Environment Variables',
    description: 'Secure configuration management',
    status: 'in-progress',
    category: 'deployment',
    priority: 'high'
  },
  {
    id: 'external-apis',
    title: 'External API Integration',
    description: 'Sentry, Google Analytics, and other services',
    status: 'pending',
    category: 'monitoring',
    priority: 'medium'
  },
  {
    id: 'ssl-security',
    title: 'SSL & Security Headers',
    description: 'HTTPS, HSTS, and security headers',
    status: 'pending',
    category: 'security',
    priority: 'high'
  },
  {
    id: 'deployment-pipeline',
    title: 'Deployment Pipeline',
    description: 'CI/CD and automated testing',
    status: 'pending',
    category: 'deployment',
    priority: 'medium'
  },
  {
    id: 'backup-strategy',
    title: 'Backup & Recovery',
    description: 'Database backups and disaster recovery',
    status: 'pending',
    category: 'deployment',
    priority: 'low'
  }
];

export const ProductionChecklist = () => {
  const [filter, setFilter] = useState<'all' | ChecklistItem['category']>('all');

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getPriorityColor = (priority: ChecklistItem['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
    }
  };

  const getCategoryColor = (category: ChecklistItem['category']) => {
    switch (category) {
      case 'security': return 'bg-red-500/10 text-red-500';
      case 'performance': return 'bg-blue-500/10 text-blue-500';
      case 'deployment': return 'bg-green-500/10 text-green-500';
      case 'monitoring': return 'bg-purple-500/10 text-purple-500';
    }
  };

  const filteredItems = filter === 'all' 
    ? checklistItems 
    : checklistItems.filter(item => item.category === filter);

  const completionStats = {
    completed: checklistItems.filter(item => item.status === 'completed').length,
    inProgress: checklistItems.filter(item => item.status === 'in-progress').length,
    pending: checklistItems.filter(item => item.status === 'pending').length,
    total: checklistItems.length
  };

  const completionPercentage = Math.round((completionStats.completed / completionStats.total) * 100);

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🚀 Production Readiness Checklist</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {completionStats.completed}/{completionStats.total} Complete
              </span>
              <div className={`text-2xl font-bold ${completionPercentage >= 80 ? 'text-green-500' : completionPercentage >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                {completionPercentage}%
              </div>
            </div>
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({checklistItems.length})
            </Button>
            {['security', 'performance', 'deployment', 'monitoring'].map(category => (
              <Button
                key={category}
                variant={filter === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(category as ChecklistItem['category'])}
                className={filter === category ? getCategoryColor(category as ChecklistItem['category']) : ''}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)} ({checklistItems.filter(item => item.category === category).length})
              </Button>
            ))}
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(item.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <Badge variant={getPriorityColor(item.priority)} className="text-xs">
                        {item.priority}
                      </Badge>
                      <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {item.actionUrl && (
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-green-500/20">
        <CardHeader>
          <CardTitle className="text-green-600">🎯 Ready for Production</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p className="font-medium">Current Status: {completionPercentage >= 80 ? '✅ Production Ready' : completionPercentage >= 60 ? '⚡ Almost Ready' : '🔄 In Progress'}</p>
            <p className="text-muted-foreground">
              {completionPercentage >= 80 
                ? 'Your application meets production standards! Complete remaining items for optimal performance.'
                : 'Focus on high-priority security and deployment items before going live.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
