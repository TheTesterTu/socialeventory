
import { supabase } from '@/integrations/supabase/client';
import { setupStorageBuckets, testStorageAccess } from './storageSetup';
import { profileIntegrationService } from './profileIntegration';

export interface SetupResult {
  success: boolean;
  results: {
    storage: any;
    profile: any;
    realtime: any;
    database: any;
  };
  errors: string[];
  warnings: string[];
}

export const productionSetupService = {
  async runAutomaticSetup(): Promise<SetupResult> {
    console.log('🚀 Starting comprehensive production setup...');
    
    const results: SetupResult = {
      success: false,
      results: {
        storage: null,
        profile: null,
        realtime: null,
        database: null
      },
      errors: [],
      warnings: []
    };

    try {
      // 1. Test basic database connectivity first
      console.log('🗄️  Testing database connectivity...');
      const dbResult = await this.testDatabaseConnectivity();
      results.results.database = dbResult;
      
      if (!dbResult.success) {
        results.errors.push(`Database: ${dbResult.error}`);
        console.error('❌ Database connectivity failed, stopping setup');
        return results;
      }
      
      console.log('✅ Database connectivity OK');

      // 2. Setup and test storage buckets
      console.log('📦 Setting up storage buckets...');
      const storageResult = await setupStorageBuckets();
      results.results.storage = storageResult;
      
      if (storageResult.errors.length > 0) {
        results.errors.push(...storageResult.errors.map(e => `Storage: ${e}`));
        console.error('❌ Storage setup has errors:', storageResult.errors);
      } else {
        console.log('✅ Storage setup completed successfully');
      }

      // 3. Test comprehensive storage access
      console.log('🧪 Testing storage access...');
      const storageTestResult = await testStorageAccess();
      
      if (!storageTestResult.success) {
        results.errors.push('Storage: Comprehensive access test failed');
        storageTestResult.results.forEach(result => {
          if (!result.success) {
            results.errors.push(`Storage ${result.bucket}: ${result.error}`);
          }
        });
      }

      // 4. Setup user profile integration
      console.log('👤 Testing profile integration...');
      const profileResult = await profileIntegrationService.syncUserWithProfile();
      results.results.profile = profileResult;
      
      if (!profileResult.success && profileResult.error) {
        results.warnings.push(`Profile: ${profileResult.error}`);
      }

      // 5. Test realtime connection
      console.log('⚡ Testing realtime connection...');
      const realtimeResult = await this.testRealtimeConnection();
      results.results.realtime = realtimeResult;
      
      if (!realtimeResult.success) {
        results.warnings.push(`Realtime: ${realtimeResult.error}`);
      }

      // 6. Run comprehensive health check
      console.log('🏥 Running health check...');
      const healthCheck = await this.runHealthCheck();
      
      if (!healthCheck.success) {
        results.errors.push(...healthCheck.errors.map(e => `Health: ${e}`));
      }

      // Determine overall success
      const criticalErrors = results.errors.filter(e => 
        e.includes('Database:') || e.includes('Storage:')
      );
      
      results.success = criticalErrors.length === 0;
      
      console.log('📊 Production setup summary:', {
        success: results.success,
        errors: results.errors.length,
        warnings: results.warnings.length,
        criticalErrors: criticalErrors.length
      });

    } catch (error) {
      const errorMessage = (error as Error).message;
      results.errors.push(`Setup failed: ${errorMessage}`);
      console.error('❌ Production setup failed:', error);
    }

    return results;
  },

  async testDatabaseConnectivity(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      console.log('🔍 Testing database connection...');
      
      // Test basic query
      const { data, error } = await supabase
        .from('events')
        .select('count')
        .limit(1);
      
      if (error) {
        return { success: false, error: `Database query failed: ${error.message}` };
      }

      // Test storage metadata access
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        return { 
          success: false, 
          error: `Storage metadata access failed: ${bucketsError.message}`,
          details: { databaseWorking: true, storageMetadata: false }
        };
      }

      console.log('✅ Database connectivity test passed');
      return { 
        success: true, 
        details: { 
          databaseWorking: true, 
          storageMetadata: true,
          bucketsFound: buckets?.length || 0
        }
      };
    } catch (error) {
      console.error('❌ Database connectivity test failed:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async testRealtimeConnection(): Promise<{ success: boolean; error?: string; latency?: number }> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const timeout = setTimeout(() => {
        resolve({ success: false, error: 'Realtime connection timeout (5s)' });
      }, 5000);

      try {
        const channel = supabase.channel('production-setup-test-' + Date.now());
        
        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            clearTimeout(timeout);
            const latency = Date.now() - startTime;
            
            // Clean up
            supabase.removeChannel(channel);
            
            resolve({ 
              success: true, 
              latency 
            });
          } else if (status === 'CHANNEL_ERROR') {
            clearTimeout(timeout);
            supabase.removeChannel(channel);
            resolve({ success: false, error: 'Channel subscription error' });
          }
        });
      } catch (error) {
        clearTimeout(timeout);
        resolve({ success: false, error: (error as Error).message });
      }
    });
  },

  async runHealthCheck(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      console.log('🏥 Running comprehensive health check...');

      // Test database tables
      const criticalTables = ['events', 'profiles', 'comments'];
      for (const table of criticalTables) {
        try {
          const { error } = await supabase
            .from(table as any)
            .select('count')
            .limit(1);
          
          if (error) {
            errors.push(`Table ${table}: ${error.message}`);
          }
        } catch (err) {
          errors.push(`Table ${table}: ${(err as Error).message}`);
        }
      }

      // Test authentication
      const { error: authError } = await supabase.auth.getSession();
      if (authError) {
        errors.push(`Authentication: ${authError.message}`);
      }

      // Test storage buckets existence
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      if (storageError) {
        errors.push(`Storage access: ${storageError.message}`);
      } else {
        const requiredBuckets = ['event-images', 'avatars'];
        const existingBuckets = buckets?.map(b => b.name) || [];
        const missingBuckets = requiredBuckets.filter(name => !existingBuckets.includes(name));
        
        if (missingBuckets.length > 0) {
          errors.push(`Missing storage buckets: ${missingBuckets.join(', ')} - run database migrations`);
        }
      }

    } catch (error) {
      errors.push(`Health check failed: ${(error as Error).message}`);
    }

    console.log(`🏥 Health check completed: ${errors.length === 0 ? '✅ PASS' : '❌ ISSUES FOUND'}`);

    return {
      success: errors.length === 0,
      errors
    };
  }
};
