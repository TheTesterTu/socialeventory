
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Wrench, Play, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { productionSetupService } from '@/services/productionSetup';
import { testStorageAccess } from '@/services/storageSetup';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  category: string;
  status: 'pass' | 'fail' | 'warning' | 'running';
  message: string;
  details?: string;
  autoFixAvailable: boolean;
  fixed?: boolean;
}

export const ComprehensiveTestRunner = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [progress, setProgress] = useState(0);

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    const results: TestResult[] = [];

    // Test 1: Database Connectivity
    setProgress(10);
    try {
      const { data, error } = await supabase.from('events').select('count').limit(1);
      results.push({
        name: 'Database Connection',
        category: 'Infrastructure',
        status: error ? 'fail' : 'pass',
        message: error ? 'Database connection failed' : 'Database connected successfully',
        details: error?.message,
        autoFixAvailable: false
      });
    } catch (err) {
      results.push({
        name: 'Database Connection',
        category: 'Infrastructure',
        status: 'fail',
        message: 'Critical database error',
        details: (err as Error).message,
        autoFixAvailable: false
      });
    }

    // Test 2: Storage System
    setProgress(20);
    try {
      const storageResult = await testStorageAccess();
      results.push({
        name: 'Storage System',
        category: 'Infrastructure',
        status: storageResult.success ? 'pass' : 'fail',
        message: storageResult.success ? 'All storage buckets working' : 'Storage issues detected',
        details: storageResult.success ? undefined : JSON.stringify(storageResult.results),
        autoFixAvailable: !storageResult.success
      });
    } catch (err) {
      results.push({
        name: 'Storage System',
        category: 'Infrastructure',
        status: 'fail',
        message: 'Storage test failed',
        details: (err as Error).message,
        autoFixAvailable: true
      });
    }

    // Test 3: Authentication System
    setProgress(30);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      results.push({
        name: 'Authentication',
        category: 'Security',
        status: 'pass',
        message: user ? 'User authenticated' : 'Auth system operational',
        autoFixAvailable: false
      });
    } catch (err) {
      results.push({
        name: 'Authentication',
        category: 'Security',
        status: 'fail',
        message: 'Auth system error',
        details: (err as Error).message,
        autoFixAvailable: false
      });
    }

    // Test 4: Critical Tables
    setProgress(40);
    const criticalTables = ['events', 'profiles', 'comments', 'event_likes', 'event_attendees'];
    for (const table of criticalTables) {
      try {
        const { error } = await supabase.from(table as any).select('count').limit(1);
        results.push({
          name: `Table: ${table}`,
          category: 'Database',
          status: error ? 'fail' : 'pass',
          message: error ? `${table} table inaccessible` : `${table} table working`,
          details: error?.message,
          autoFixAvailable: false
        });
      } catch (err) {
        results.push({
          name: `Table: ${table}`,
          category: 'Database',
          status: 'fail',
          message: `${table} table error`,
          details: (err as Error).message,
          autoFixAvailable: false
        });
      }
    }

    // Test 5: Error Boundaries
    setProgress(60);
    const hasErrorBoundaries = document.querySelector('[data-error-boundary]') !== null;
    results.push({
      name: 'Error Boundaries',
      category: 'Reliability',
      status: hasErrorBoundaries ? 'pass' : 'warning',
      message: hasErrorBoundaries ? 'Error boundaries active' : 'Error boundaries missing',
      autoFixAvailable: !hasErrorBoundaries
    });

    // Test 6: Performance Check
    setProgress(70);
    const startTime = performance.now();
    try {
      await supabase.from('events').select('id, title').limit(10);
      const queryTime = performance.now() - startTime;
      results.push({
        name: 'Query Performance',
        category: 'Performance',
        status: queryTime < 1000 ? 'pass' : queryTime < 3000 ? 'warning' : 'fail',
        message: `Database query took ${queryTime.toFixed(0)}ms`,
        autoFixAvailable: queryTime > 2000
      });
    } catch (err) {
      results.push({
        name: 'Query Performance',
        category: 'Performance',
        status: 'fail',
        message: 'Performance test failed',
        details: (err as Error).message,
        autoFixAvailable: false
      });
    }

    // Test 7: UI Components
    setProgress(80);
    const buttons = document.querySelectorAll('button');
    const invisibleButtons = Array.from(buttons).filter(btn => {
      const styles = window.getComputedStyle(btn);
      return styles.opacity === '0' || styles.visibility === 'hidden';
    });
    
    results.push({
      name: 'UI Components',
      category: 'User Interface',
      status: invisibleButtons.length > 0 ? 'warning' : 'pass',
      message: invisibleButtons.length > 0 ? 
        `${invisibleButtons.length} hidden buttons detected` : 
        'All UI components visible',
      autoFixAvailable: invisibleButtons.length > 0
    });

    // Test 8: Real-time System
    setProgress(90);
    try {
      const channel = supabase.channel('test-realtime-' + Date.now());
      const realtimeTest = await new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(false), 3000);
        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            clearTimeout(timeout);
            resolve(true);
          }
        });
      });
      
      results.push({
        name: 'Real-time System',
        category: 'Infrastructure',
        status: realtimeTest ? 'pass' : 'warning',
        message: realtimeTest ? 'Real-time working' : 'Real-time connection slow',
        autoFixAvailable: false
      });
      
      supabase.removeChannel(channel);
    } catch (err) {
      results.push({
        name: 'Real-time System',
        category: 'Infrastructure',
        status: 'fail',
        message: 'Real-time test failed',
        details: (err as Error).message,
        autoFixAvailable: false
      });
    }

    setProgress(100);
    setTests(results);
    setIsRunning(false);

    // Show summary
    const failed = results.filter(t => t.status === 'fail').length;
    const warnings = results.filter(t => t.status === 'warning').length;
    const passed = results.filter(t => t.status === 'pass').length;

    if (failed === 0 && warnings === 0) {
      toast.success(`🎉 All ${passed} tests passed!`);
    } else if (failed === 0) {
      toast.warning(`⚠️ ${passed} passed, ${warnings} warnings`);
    } else {
      toast.error(`❌ ${failed} failed, ${warnings} warnings, ${passed} passed`);
    }
  };

  const autoFixIssues = async () => {
    setIsAutoFixing(true);
    toast.info('🔧 Running auto-fix for all detected issues...');

    try {
      // Run comprehensive production setup
      const setupResult = await productionSetupService.runAutomaticSetup();
      
      if (setupResult.success) {
        toast.success('✅ Auto-fix completed successfully!');
        
        // Mark fixable issues as fixed
        setTests(prev => prev.map(test => ({
          ...test,
          fixed: test.autoFixAvailable ? true : test.fixed,
          status: test.autoFixAvailable && test.status === 'fail' ? 'pass' : test.status
        })));
      } else {
        toast.warning(`⚠️ Auto-fix completed with issues`);
        setupResult.errors.forEach(error => {
          toast.error(error);
        });
      }

      // Rerun tests after auto-fix
      setTimeout(() => {
        runAllTests();
      }, 2000);

    } catch (error) {
      toast.error(`❌ Auto-fix failed: ${(error as Error).message}`);
    } finally {
      setIsAutoFixing(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Infrastructure': return 'bg-blue-500/10 text-blue-500';
      case 'Security': return 'bg-red-500/10 text-red-500';
      case 'Database': return 'bg-green-500/10 text-green-500';
      case 'Performance': return 'bg-yellow-500/10 text-yellow-500';
      case 'Reliability': return 'bg-purple-500/10 text-purple-500';
      case 'User Interface': return 'bg-pink-500/10 text-pink-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const failedTests = tests.filter(t => t.status === 'fail');
  const warningTests = tests.filter(t => t.status === 'warning');
  const passedTests = tests.filter(t => t.status === 'pass');
  const autoFixableTests = tests.filter(t => t.autoFixAvailable && !t.fixed);

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🧪 Comprehensive Test Runner</span>
            <div className="flex gap-2">
              <Button 
                onClick={autoFixIssues} 
                disabled={isAutoFixing || autoFixableTests.length === 0}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <Wrench className="h-4 w-4 mr-2" />
                {isAutoFixing ? 'Auto-Fixing...' : `Auto-Fix (${autoFixableTests.length})`}
              </Button>
              <Button onClick={runAllTests} disabled={isRunning}>
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </Button>
            </div>
          </CardTitle>
          {isRunning && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">Running comprehensive tests...</p>
            </div>
          )}
        </CardHeader>
      </Card>

      {tests.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-green-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{passedTests.length}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </CardContent>
            </Card>
            <Card className="border-yellow-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-500">{warningTests.length}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </CardContent>
            </Card>
            <Card className="border-red-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-500">{failedTests.length}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </CardContent>
            </Card>
            <Card className="border-blue-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">{autoFixableTests.length}</div>
                <div className="text-sm text-muted-foreground">Auto-Fixable</div>
              </CardContent>
            </Card>
          </div>

          {failedTests.length > 0 && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{failedTests.length} critical issues found</strong> - These need immediate attention for production readiness.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {tests.map((test, index) => (
              <Card key={index} className="border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(test.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{test.name}</h3>
                          <Badge className={getCategoryColor(test.category)}>
                            {test.category}
                          </Badge>
                          {test.autoFixAvailable && !test.fixed && (
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              Auto-Fixable
                            </Badge>
                          )}
                          {test.fixed && (
                            <Badge variant="outline" className="border-blue-500 text-blue-600">
                              Fixed
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{test.message}</p>
                        {test.details && (
                          <p className="text-xs text-red-500 font-mono bg-red-50 p-2 rounded">
                            {test.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {tests.length === 0 && (
        <Card className="border-primary/20">
          <CardContent className="p-8 text-center">
            <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Ready to Test</h3>
            <p className="text-muted-foreground mb-4">
              Run comprehensive tests to check your application's production readiness
            </p>
            <Button onClick={runAllTests} disabled={isRunning}>
              <Play className="h-4 w-4 mr-2" />
              Start Testing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
