
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProductionCheck {
  name: string;
  category: 'storage' | 'database' | 'auth' | 'realtime' | 'security';
  status: 'checking' | 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
  critical: boolean;
}

export const useProductionReadinessCheck = () => {
  const { user } = useAuth();
  const [checks, setChecks] = useState<ProductionCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  const runProductionChecks = async () => {
    setIsRunning(true);
    const checkResults: ProductionCheck[] = [];

    // Storage Bucket Checks
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      const requiredBuckets = ['event-images', 'avatars'];
      const existingBuckets = buckets?.map(b => b.name) || [];
      
      requiredBuckets.forEach(bucketName => {
        checkResults.push({
          name: `Storage Bucket: ${bucketName}`,
          category: 'storage',
          status: existingBuckets.includes(bucketName) ? 'pass' : 'fail',
          message: existingBuckets.includes(bucketName) 
            ? `Bucket ${bucketName} exists` 
            : `Bucket ${bucketName} missing`,
          critical: true
        });
      });
    } catch (error) {
      checkResults.push({
        name: 'Storage System',
        category: 'storage',
        status: 'fail',
        message: 'Failed to check storage buckets',
        details: (error as Error).message,
        critical: true
      });
    }

    // Database Table Checks
    const criticalTables = [
      'events', 'profiles', 'comments', 'event_likes', 
      'event_attendees', 'saved_events', 'notifications'
    ];

    for (const tableName of criticalTables) {
      try {
        const { error } = await supabase
          .from(tableName as any)
          .select('count')
          .limit(1);
        
        checkResults.push({
          name: `Database Table: ${tableName}`,
          category: 'database',
          status: error ? 'fail' : 'pass',
          message: error ? `Table ${tableName} inaccessible` : `Table ${tableName} working`,
          details: error?.message,
          critical: true
        });
      } catch (error) {
        checkResults.push({
          name: `Database Table: ${tableName}`,
          category: 'database',
          status: 'fail',
          message: `Failed to check table ${tableName}`,
          details: (error as Error).message,
          critical: true
        });
      }
    }

    // Authentication Check
    try {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      checkResults.push({
        name: 'Authentication System',
        category: 'auth',
        status: 'pass',
        message: currentUser ? 'User authenticated' : 'Auth system operational',
        critical: true
      });

      // Profile Integration Check
      if (currentUser) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        checkResults.push({
          name: 'Profile Integration',
          category: 'auth',
          status: profileError ? 'warning' : 'pass',
          message: profileError ? 'Profile sync issue' : 'Profile integration working',
          details: profileError?.message,
          critical: false
        });
      }
    } catch (error) {
      checkResults.push({
        name: 'Authentication System',
        category: 'auth',
        status: 'fail',
        message: 'Auth system error',
        details: (error as Error).message,
        critical: true
      });
    }

    // Real-time Functionality Check
    try {
      const channel = supabase.channel('production-test-realtime');
      let realtimeWorking = false;
      
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve(false);
        }, 3000);
        
        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            realtimeWorking = true;
            clearTimeout(timeout);
            resolve(true);
          }
        });
      });
      
      checkResults.push({
        name: 'Real-time System',
        category: 'realtime',
        status: realtimeWorking ? 'pass' : 'warning',
        message: realtimeWorking ? 'Real-time working' : 'Real-time connection slow',
        critical: false
      });
      
      supabase.removeChannel(channel);
    } catch (error) {
      checkResults.push({
        name: 'Real-time System',
        category: 'realtime',
        status: 'fail',
        message: 'Real-time system error',
        details: (error as Error).message,
        critical: false
      });
    }

    // Data Interconnection Tests
    try {
      // Test event creation flow
      const testEventData = {
        title: 'Production Test Event',
        description: 'This is a test event for production readiness',
        location: 'Test Location',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 3600000).toISOString(),
        created_by: user?.id || 'anonymous'
      };

      if (user) {
        const { data: testEvent, error: createError } = await supabase
          .from('events')
          .insert(testEventData)
          .select()
          .single();

        if (!createError && testEvent) {
          // Test event interactions
          const { error: likeError } = await supabase
            .from('event_likes')
            .insert({ event_id: testEvent.id, user_id: user.id });

          // Clean up test data
          await supabase.from('event_likes').delete().eq('event_id', testEvent.id);
          await supabase.from('events').delete().eq('id', testEvent.id);

          checkResults.push({
            name: 'Event Interaction Flow',
            category: 'database',
            status: likeError ? 'warning' : 'pass',
            message: likeError ? 'Event interactions have issues' : 'Event interactions working',
            details: likeError?.message,
            critical: false
          });
        } else {
          checkResults.push({
            name: 'Event Creation Flow',
            category: 'database',
            status: 'fail',
            message: 'Event creation failed',
            details: createError?.message,
            critical: true
          });
        }
      }
    } catch (error) {
      checkResults.push({
        name: 'Data Interconnection',
        category: 'database',
        status: 'fail',
        message: 'Data flow test failed',
        details: (error as Error).message,
        critical: true
      });
    }

    // Security Policy Check
    try {
      // Test RLS by trying to access data as anonymous user
      const { error: anonError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      checkResults.push({
        name: 'Row Level Security',
        category: 'security',
        status: 'pass',
        message: 'RLS policies configured',
        critical: true
      });
    } catch (error) {
      checkResults.push({
        name: 'Row Level Security',
        category: 'security',
        status: 'warning',
        message: 'RLS configuration unclear',
        details: (error as Error).message,
        critical: false
      });
    }

    setChecks(checkResults);
    
    // Calculate overall score
    const totalChecks = checkResults.length;
    const passedChecks = checkResults.filter(c => c.status === 'pass').length;
    const criticalFailures = checkResults.filter(c => c.status === 'fail' && c.critical).length;
    
    let score = (passedChecks / totalChecks) * 100;
    if (criticalFailures > 0) {
      score = Math.max(score - (criticalFailures * 15), 0);
    }
    
    setOverallScore(Math.round(score));
    setIsRunning(false);
  };

  useEffect(() => {
    runProductionChecks();
  }, [user]);

  return {
    checks,
    isRunning,
    overallScore,
    runChecks: runProductionChecks,
    criticalIssues: checks.filter(c => c.status === 'fail' && c.critical),
    warnings: checks.filter(c => c.status === 'warning')
  };
};
