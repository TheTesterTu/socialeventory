
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Shield, Cloud, Zap, User } from 'lucide-react';
import { useProductionReadinessCheck } from '@/hooks/useProductionReadinessCheck';

const categoryIcons = {
  storage: Cloud,
  database: Database,
  auth: User,
  realtime: Zap,
  security: Shield
};

export const ProductionReadinessDashboard = () => {
  const { checks, isRunning, overallScore, runChecks, criticalIssues, warnings } = useProductionReadinessCheck();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const groupedChecks = checks.reduce((acc, check) => {
    if (!acc[check.category]) acc[check.category] = [];
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, typeof checks>);

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🚀 Production Readiness Score</span>
            <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
          </CardTitle>
          <Progress value={overallScore} className="h-3" />
          <div className="flex gap-4 text-sm">
            {criticalIssues.length > 0 && (
              <span className="text-red-600">⚠️ {criticalIssues.length} Critical Issues</span>
            )}
            {warnings.length > 0 && (
              <span className="text-yellow-600">⚡ {warnings.length} Warnings</span>
            )}
            <Button onClick={runChecks} disabled={isRunning} size="sm" className="ml-auto">
              {isRunning ? 'Checking...' : 'Rerun Checks'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Critical Issues Alert */}
      {criticalIssues.length > 0 && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Critical Issues Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalIssues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-red-500/10 rounded">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <div className="font-medium">{issue.name}</div>
                    <div className="text-sm text-red-600">{issue.message}</div>
                    {issue.details && (
                      <div className="text-xs text-red-500/70 font-mono">{issue.details}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Checks by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedChecks).map(([category, categoryChecks]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          const categoryScore = Math.round(
            (categoryChecks.filter(c => c.status === 'pass').length / categoryChecks.length) * 100
          );

          return (
            <Card key={category} className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Icon className="h-4 w-4" />
                  <span className="capitalize">{category}</span>
                  <Badge variant="outline" className={getScoreColor(categoryScore)}>
                    {categoryScore}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categoryChecks.map((check, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded bg-background/50">
                    {getStatusIcon(check.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{check.name}</span>
                        {check.critical && (
                          <Badge variant="destructive" className="text-xs">Critical</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{check.message}</p>
                      {check.details && (
                        <p className="text-xs text-red-500 font-mono">{check.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Production Deployment Checklist */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>📋 Pre-Deployment Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">✅ Completed</h4>
              <ul className="text-sm space-y-1 text-green-600">
                <li>• Storage buckets configured</li>
                <li>• Row Level Security enabled</li>
                <li>• Real-time functionality working</li>
                <li>• User authentication system</li>
                <li>• Event management system</li>
                <li>• Comment and interaction system</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">🔄 Recommended Next Steps</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Set up error monitoring (Sentry)</li>
                <li>• Configure custom domain</li>
                <li>• Add content moderation</li>
                <li>• Implement email notifications</li>
                <li>• Add analytics tracking</li>
                <li>• Legal pages review</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
