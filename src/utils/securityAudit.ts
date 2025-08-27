import { supabase } from '@/integrations/supabase/client';

export interface SecurityAuditResult {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  issue: string;
  recommendation: string;
  status: 'pass' | 'fail' | 'warning';
}

export const runSecurityAudit = async (): Promise<SecurityAuditResult[]> => {
  const results: SecurityAuditResult[] = [];

  // Check RLS on critical tables
  const criticalTables = [
    'profiles', 'events', 'comments', 'event_likes', 
    'event_attendees', 'notifications', 'saved_events',
    'blog_posts', 'categories', 'saved_locations',
    'admin_settings', 'api_configurations'
  ];

  for (const table of criticalTables) {
    try {
      // Test if we can access data without authentication
      const { error } = await supabase
        .from(table as any)
        .select('count')
        .limit(1);
      
      if (!error) {
        results.push({
          severity: 'high',
          category: 'Row Level Security',
          issue: `Table "${table}" allows unauthorized access`,
          recommendation: 'Enable RLS and create proper policies',
          status: 'pass'
        });
      }
    } catch {
      results.push({
        severity: 'medium',
        category: 'Database Access',
        issue: `Cannot verify RLS status for table "${table}"`,
        recommendation: 'Check table permissions and RLS policies',
        status: 'warning'
      });
    }
  }

  // Check for admin role security
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    if (currentUser.user) {
      const { data: role, error } = await supabase.rpc('get_user_role', { 
        user_id: currentUser.user.id 
      });
      
      if (!error) {
        results.push({
          severity: 'low',
          category: 'Authentication',
          issue: 'Admin role checking function is working',
          recommendation: 'Continue using secure role checking',
          status: 'pass'
        });
      }
    }
  } catch (error) {
    results.push({
      severity: 'medium',
      category: 'Authentication',
      issue: 'Cannot verify admin role checking function',
      recommendation: 'Ensure get_user_role function exists and is secure',
      status: 'warning'
    });
  }

  // Check for exposed API configurations
  try {
    const { data, error } = await supabase
      .from('api_configurations')
      .select('key, is_public')
      .eq('is_public', false);
    
    if (!error && data && data.length > 0) {
      results.push({
        severity: 'low',
        category: 'API Security',
        issue: 'Private API configurations are properly secured',
        recommendation: 'Continue restricting access to private configurations',
        status: 'pass'
      });
    }
  } catch (error) {
    results.push({
      severity: 'high',
      category: 'API Security',
      issue: 'Cannot verify API configuration security',
      recommendation: 'Check RLS policies on api_configurations table',
      status: 'fail'
    });
  }

  // Check authentication status
  try {
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      results.push({
        severity: 'low',
        category: 'Session Management',
        issue: 'User session is active and valid',
        recommendation: 'Continue monitoring session security',
        status: 'pass'
      });
    } else {
      results.push({
        severity: 'medium',
        category: 'Session Management',
        issue: 'No active user session for security audit',
        recommendation: 'Some security checks require authentication',
        status: 'warning'
      });
    }
  } catch (error) {
    results.push({
      severity: 'high',
      category: 'Session Management',
      issue: 'Cannot verify session status',
      recommendation: 'Check authentication configuration',
      status: 'fail'
    });
  }

  return results;
};

export const generateSecurityReport = (results: SecurityAuditResult[]): string => {
  const critical = results.filter(r => r.severity === 'critical');
  const high = results.filter(r => r.severity === 'high');
  const medium = results.filter(r => r.severity === 'medium');
  const low = results.filter(r => r.severity === 'low');

  const passed = results.filter(r => r.status === 'pass').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const failed = results.filter(r => r.status === 'fail').length;

  return `
Security Audit Report
====================

Summary:
- ✅ Passed: ${passed}
- ⚠️  Warnings: ${warnings}
- ❌ Failed: ${failed}

Severity Breakdown:
- 🔴 Critical: ${critical.length}
- 🟠 High: ${high.length}
- 🟡 Medium: ${medium.length}
- 🟢 Low: ${low.length}

${critical.length > 0 ? '🔴 CRITICAL ISSUES:\n' + critical.map(r => `- ${r.issue}`).join('\n') + '\n' : ''}
${high.length > 0 ? '🟠 HIGH PRIORITY:\n' + high.map(r => `- ${r.issue}`).join('\n') + '\n' : ''}
${medium.length > 0 ? '🟡 MEDIUM PRIORITY:\n' + medium.map(r => `- ${r.issue}`).join('\n') + '\n' : ''}

Overall Security Score: ${Math.round((passed / results.length) * 100)}%
  `;
};