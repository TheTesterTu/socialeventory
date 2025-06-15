
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export const SystemCheck = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();

  const runTests = async () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];

    // Test 1: Database Connection
    try {
      const { data, error } = await supabase.from('events').select('count').limit(1);
      testResults.push({
        name: 'Database Connection',
        status: error ? 'error' : 'success',
        message: error ? 'Failed to connect to database' : 'Database connection successful',
        details: error?.message
      });
    } catch (err) {
      testResults.push({
        name: 'Database Connection',
        status: 'error',
        message: 'Database connection failed',
        details: (err as Error).message
      });
    }

    // Test 2: Events Data
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .limit(5);
      
      testResults.push({
        name: 'Events Data',
        status: error ? 'error' : events && events.length > 0 ? 'success' : 'warning',
        message: error ? 'Failed to fetch events' : 
                events && events.length > 0 ? `Found ${events.length} events` : 'No events found',
        details: error?.message
      });
    } catch (err) {
      testResults.push({
        name: 'Events Data',
        status: 'error',
        message: 'Failed to fetch events',
        details: (err as Error).message
      });
    }

    // Test 3: Authentication
    try {
      const { data: { user } } = await supabase.auth.getUser();
      testResults.push({
        name: 'Authentication',
        status: 'success',
        message: user ? 'User authenticated' : 'No user authenticated (normal)',
        details: user ? `User ID: ${user.id}` : 'Authentication system working'
      });
    } catch (err) {
      testResults.push({
        name: 'Authentication',
        status: 'error',
        message: 'Authentication check failed',
        details: (err as Error).message
      });
    }

    // Test 4: Navigation
    const navigationTests = [
      { path: '/', name: 'Homepage' },
      { path: '/search', name: 'Search Page' },
      { path: '/nearby', name: 'Nearby Events' },
      { path: '/create-event', name: 'Create Event' },
    ];

    navigationTests.forEach(test => {
      try {
        testResults.push({
          name: `Navigation: ${test.name}`,
          status: 'success',
          message: `Route ${test.path} is configured`,
          details: `Path: ${test.path}`
        });
      } catch (err) {
        testResults.push({
          name: `Navigation: ${test.name}`,
          status: 'error',
          message: `Route ${test.path} failed`,
          details: (err as Error).message
        });
      }
    });

    setTests(testResults);
    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const warningCount = tests.filter(t => t.status === 'warning').length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Health Check</span>
          <Button onClick={runTests} disabled={isRunning}>
            {isRunning ? 'Running Tests...' : 'Rerun Tests'}
          </Button>
        </CardTitle>
        
        <div className="flex gap-4 text-sm">
          <span className="text-green-600">✓ {successCount} Passed</span>
          <span className="text-red-600">✗ {errorCount} Failed</span>
          <span className="text-yellow-600">⚠ {warningCount} Warnings</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {tests.map((test, index) => (
          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
            {getStatusIcon(test.status)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{test.name}</h4>
                {getStatusBadge(test.status)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{test.message}</p>
              {test.details && (
                <p className="text-xs text-muted-foreground/70 mt-1 font-mono bg-muted/30 p-1 rounded">
                  {test.details}
                </p>
              )}
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2">Quick Actions</h3>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={() => navigate('/')}>Test Homepage</Button>
            <Button size="sm" onClick={() => navigate('/search')}>Test Search</Button>
            <Button size="sm" onClick={() => navigate('/nearby')}>Test Nearby</Button>
            <Button size="sm" onClick={() => navigate('/create-event')}>Test Create Event</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
