
import { useEffect, useState } from 'react';
import { useUnifiedEvents } from '@/hooks/useUnifiedEvents';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Database, Users, Calendar } from 'lucide-react';

interface CheckResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

type TableName = 'events' | 'profiles' | 'event_likes' | 'event_attendees' | 'comments' | 'categories' | 'notifications' | 'saved_events' | 'blog_posts' | 'admin_settings' | 'api_configurations' | 'facebook_integration' | 'saved_locations';

export const PipelineCheck = () => {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const { user } = useAuth();
  const { data: events, isLoading: eventsLoading, error: eventsError } = useUnifiedEvents({
    limit: 5
  });

  useEffect(() => {
    runPipelineChecks();
  }, [user]);

  const runPipelineChecks = async () => {
    setIsChecking(true);
    const results: CheckResult[] = [];

    // Check 1: Supabase Connection
    try {
      const { data, error } = await supabase.from('events').select('count').limit(1);
      if (error) throw error;
      results.push({
        name: 'Supabase Connection',
        status: 'success',
        message: 'Database connection working',
        details: { connected: true }
      });
    } catch (error: any) {
      results.push({
        name: 'Supabase Connection',
        status: 'error',
        message: 'Database connection failed',
        details: { error: error.message }
      });
    }

    // Check 2: Events Data
    if (eventsError) {
      results.push({
        name: 'Events Data',
        status: 'error',
        message: 'Failed to load events',
        details: { error: eventsError.message }
      });
    } else if (eventsLoading) {
      results.push({
        name: 'Events Data',
        status: 'warning',
        message: 'Events still loading...',
        details: { loading: true }
      });
    } else {
      results.push({
        name: 'Events Data',
        status: events && events.length > 0 ? 'success' : 'warning',
        message: events && events.length > 0 ? `${events.length} events loaded` : 'No events found',
        details: { count: events?.length || 0, events: events?.slice(0, 2) }
      });
    }

    // Check 3: Authentication
    results.push({
      name: 'Authentication',
      status: user ? 'success' : 'warning',
      message: user ? `Authenticated as ${user.email}` : 'Not authenticated',
      details: { user: user ? { id: user.id, email: user.email } : null }
    });

    // Check 4: Database Tables
    try {
      const tables: TableName[] = ['events', 'profiles', 'event_likes', 'event_attendees', 'comments'];
      const tableChecks = await Promise.all(
        tables.map(async (tableName) => {
          try {
            const { count, error } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });
            if (error) throw error;
            return { table: tableName, count: count || 0, status: 'success' as const };
          } catch (error: any) {
            return { table: tableName, count: 0, status: 'error' as const, error: error.message };
          }
        })
      );

      const failedTables = tableChecks.filter(check => check.status === 'error');
      if (failedTables.length === 0) {
        results.push({
          name: 'Database Tables',
          status: 'success',
          message: 'All tables accessible',
          details: { tables: tableChecks }
        });
      } else {
        results.push({
          name: 'Database Tables',
          status: 'error',
          message: `${failedTables.length} tables failed`,
          details: { failed: failedTables, all: tableChecks }
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Database Tables',
        status: 'error',
        message: 'Failed to check tables',
        details: { error: error.message }
      });
    }

    // Check 5: Real-time Connection
    try {
      const channel = supabase.channel('pipeline-test');
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout')), 5000);
        channel.subscribe((status) => {
          clearTimeout(timeout);
          if (status === 'SUBSCRIBED') {
            resolve();
          } else if (status === 'CHANNEL_ERROR') {
            reject(new Error('Channel error'));
          }
        });
      });
      
      results.push({
        name: 'Real-time Connection',
        status: 'success',
        message: 'Real-time subscriptions working',
        details: { realtime: true }
      });
      
      supabase.removeChannel(channel);
    } catch (error: any) {
      results.push({
        name: 'Real-time Connection',
        status: 'warning',
        message: 'Real-time connection issues',
        details: { error: error.message }
      });
    }

    setChecks(results);
    setIsChecking(false);
  };

  const getStatusIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: CheckResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <Card className="mb-6 border-2 border-dashed border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Pipeline Health Check
          {isChecking && <span className="text-sm font-normal text-muted-foreground">(Checking...)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <div className="font-medium">{check.name}</div>
                  <div className="text-sm text-muted-foreground">{check.message}</div>
                </div>
              </div>
              <Badge className={getStatusColor(check.status)}>
                {check.status}
              </Badge>
            </div>
          ))}
        </div>
        
        {!isChecking && (
          <button
            onClick={runPipelineChecks}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Re-run Checks
          </button>
        )}
      </CardContent>
    </Card>
  );
};
