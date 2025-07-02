
import { supabase } from '@/integrations/supabase/client';

export const setupStorageBuckets = async () => {
  const results = {
    bucketsCreated: [] as string[],
    errors: [] as string[],
    existing: [] as string[]
  };

  try {
    console.log('🔍 Starting storage bucket setup...');
    
    // First, try to list existing buckets
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Failed to list buckets:', listError);
      results.errors.push(`Failed to list buckets: ${listError.message}`);
      return results;
    }

    const existingBucketNames = existingBuckets?.map(b => b.name) || [];
    console.log('📦 Found existing buckets:', existingBucketNames);

    const requiredBuckets = ['event-images', 'avatars'];

    // Check each required bucket
    for (const bucketName of requiredBuckets) {
      if (existingBucketNames.includes(bucketName)) {
        console.log(`✅ Bucket ${bucketName} exists`);
        results.existing.push(bucketName);
        
        // Test actual bucket access
        const accessTest = await testBucketAccess(bucketName);
        if (!accessTest.success) {
          console.error(`❌ Bucket ${bucketName} access failed:`, accessTest.error);
          results.errors.push(`Bucket ${bucketName} access failed: ${accessTest.error}`);
        } else {
          console.log(`✅ Bucket ${bucketName} access test passed`);
        }
      } else {
        console.log(`❌ Bucket ${bucketName} is missing`);
        results.errors.push(`Bucket ${bucketName} is missing - check database migration status`);
      }
    }

    // If no buckets exist, there might be a database connection issue
    if (existingBucketNames.length === 0) {
      results.errors.push('No storage buckets found - database connection or migration issue');
    }

  } catch (error) {
    console.error('❌ Storage setup failed:', error);
    results.errors.push(`Storage setup failed: ${(error as Error).message}`);
  }

  console.log('📊 Storage setup results:', {
    existing: results.existing.length,
    errors: results.errors.length
  });

  return results;
};

export const testBucketAccess = async (bucketName: string) => {
  try {
    console.log(`🧪 Testing bucket access: ${bucketName}`);
    
    // Create a small test file
    const testContent = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in bytes
    const testFileName = `test-access-${Date.now()}.txt`;

    // Test upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testFileName, testContent, {
        contentType: 'text/plain',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error(`Upload test failed for ${bucketName}:`, uploadError);
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    console.log(`✅ Upload test passed for ${bucketName}`);

    // Test download/public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(testFileName);
    
    if (!publicUrlData?.publicUrl) {
      return { success: false, error: 'Failed to get public URL' };
    }

    console.log(`✅ Public URL test passed for ${bucketName}`);

    // Clean up test file
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([testFileName]);

    if (deleteError) {
      console.warn(`⚠️ Failed to clean up test file in ${bucketName}:`, deleteError.message);
    } else {
      console.log(`🧹 Cleanup successful for ${bucketName}`);
    }

    return { success: true };
  } catch (error) {
    console.error(`❌ Bucket access test failed for ${bucketName}:`, error);
    return { success: false, error: (error as Error).message };
  }
};

export const testStorageAccess = async () => {
  console.log('🚀 Starting comprehensive storage access test...');
  
  const buckets = ['event-images', 'avatars'];
  const results = [];
  
  for (const bucket of buckets) {
    const result = await testBucketAccess(bucket);
    results.push({ bucket, ...result });
    
    if (result.success) {
      console.log(`✅ ${bucket}: PASS`);
    } else {
      console.log(`❌ ${bucket}: FAIL - ${result.error}`);
    }
  }
  
  const allPassed = results.every(r => r.success);
  console.log(`📊 Storage test summary: ${allPassed ? '✅ ALL PASS' : '❌ SOME FAILED'}`);
  
  return {
    success: allPassed,
    results
  };
};

// Helper function to create missing buckets (if needed)
export const createMissingBuckets = async () => {
  console.log('🔧 Attempting to create missing storage buckets...');
  
  const results = {
    created: [] as string[],
    errors: [] as string[]
  };

  // Note: Bucket creation is handled by SQL migrations
  // This function is for reference and debugging
  results.errors.push('Bucket creation must be done via SQL migrations - check database setup');
  
  return results;
};
