
import { supabase } from '@/integrations/supabase/client';
import { setupStorageBuckets } from './storageSetup';
import { profileIntegrationService } from './profileIntegration';

export interface SetupResult {
  success: boolean;
  results: {
    storage: any;
    profile: any;
    realtime: any;
  };
  errors: string[];
}

export const productionSetupService = {
  async runAutomaticSetup(): Promise<SetupResult> {
    console.log('🚀 Starting automatic production setup...');
    
    const results: SetupResult = {
      success: false,
      results: {
        storage: null,
        profile: null,
        realtime: null
      },
      errors: []
    };

    try {
      // 1. Setup storage buckets
      console.log('📦 Checking storage buckets...');
      const storageResult = await setupStorageBuckets();
      results.results.storage = storageResult;
      
      if (storageResult.errors.length > 0) {
        results.errors.push(...storageResult.errors.map(e => `Storage: ${e}`));
      }

      // 2. Setup user profile integration
      console.log('👤 Testing profile integration...');
      const profileResult = await profileIntegrationService.syncUserWithProfile();
      results.results.profile = profileResult;
      
      if (!profileResult.success && profileResult.error) {
        results.errors.push(`Profile: ${profileResult.error}`);
      }

      // 3. Test realtime connection
      console.log('⚡ Testing realtime connection...');
      const realtimeResult = await this.testRealtimeConnection();
      results.results.realtime = realtimeResult;
      
      if (!realtimeResult.success) {
        results.errors.push(`Realtime: ${realtimeResult.error}`);
      }

      // 4. Run comprehensive health check
      console.log('🏥 Running health check...');
      const healthCheck = await this.runHealthCheck();
      
      if (!healthCheck.success) {
        results.errors.push(...healthCheck.errors.map(e => `Health: ${e}`));
      }

      results.success = results.errors.length === 0;
      
      console.log('✅ Production setup completed', {
        success: results.success,
        errorCount: results.errors.length
      });

    } catch (error) {
      const errorMessage = (error as Error).message;
      results.errors.push(`Setup failed: ${errorMessage}`);
      console.error('❌ Production setup failed:', error);
    }

    return results;
  },

  async testRealtimeConnection(): Promise<{ success: boolean; error?: string; latency?: number }> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const timeout = setTimeout(() => {
        resolve({ success: false, error: 'Realtime connection timeout' });
      }, 5000);

      try {
        const channel = supabase.channel('production-setup-test');
        
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
      // Test database connection
      const { error: dbError } = await supabase
        .from('events')
        .select('count')
        .limit(1);
      
      if (dbError) {
        errors.push(`Database connection: ${dbError.message}`);
      }

      // Test authentication
      const { error: authError } = await supabase.auth.getSession();
      if (authError) {
        errors.push(`Authentication: ${authError.message}`);
      }

      // Test storage access
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      if (storageError) {
        errors.push(`Storage access: ${storageError.message}`);
      } else {
        const requiredBuckets = ['event-images', 'avatars'];
        const existingBuckets = buckets?.map(b => b.name) || [];
        const missingBuckets = requiredBuckets.filter(name => !existingBuckets.includes(name));
        
        if (missingBuckets.length > 0) {
          errors.push(`Missing storage buckets: ${missingBuckets.join(', ')}`);
        }
      }

    } catch (error) {
      errors.push(`Health check failed: ${(error as Error).message}`);
    }

    return {
      success: errors.length === 0,
      errors
    };
  }
};
