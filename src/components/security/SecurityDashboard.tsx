import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { runSecurityAudit, generateSecurityReport, SecurityAuditResult } from '@/utils/securityAudit';
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const SecurityDashboard = () => {
  const [auditResults, setAuditResults] = useState<SecurityAuditResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runAudit = async () => {
    setIsRunning(true);
    try {
      const results = await runSecurityAudit();
      setAuditResults(results);
      setLastRun(new Date());
      
      const criticalIssues = results.filter(r => r.severity === 'critical').length;
      const highIssues = results.filter(r => r.severity === 'high').length;
      
      if (criticalIssues > 0) {
        toast.error(`Security audit found ${criticalIssues} critical issues!`);
      } else if (highIssues > 0) {
        toast.warning(`Security audit found ${highIssues} high priority issues`);
      } else {
        toast.success('Security audit completed - no critical issues found');
      }
    } catch (error) {
      toast.error('Failed to run security audit');
      console.error('Security audit error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const exportReport = () => {
    const report = generateSecurityReport(auditResults);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-audit-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Security report exported');
  };

  useEffect(() => {
    runAudit();
  }, []);

  const criticalCount = auditResults.filter(r => r.severity === 'critical').length;
  const highCount = auditResults.filter(r => r.severity === 'high').length;
  const passedCount = auditResults.filter(r => r.status === 'pass').length;
  const totalCount = auditResults.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Security Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and manage application security
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runAudit} 
            disabled={isRunning}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running...' : 'Run Audit'}
          </Button>
          {auditResults.length > 0 && (
            <Button onClick={exportReport} variant="outline">
              Export Report
            </Button>
          )}
        </div>
      </div>

      {lastRun && (
        <div className="text-sm text-muted-foreground">
          Last audit: {lastRun.toLocaleString()}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{passedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Audit Results</CardTitle>
        </CardHeader>
        <CardContent>
          {auditResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {isRunning ? 'Running security audit...' : 'No audit results available'}
            </div>
          ) : (
            <div className="space-y-4">
              {auditResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(result.severity) as any}>
                        {result.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {result.category}
                      </span>
                    </div>
                    <h4 className="font-medium">{result.issue}</h4>
                    <p className="text-sm text-muted-foreground">
                      {result.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};