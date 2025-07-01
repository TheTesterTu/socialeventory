
import { supabase } from '@/integrations/supabase/client';

export const setupStorageBuckets = async () => {
  const results = {
    bucketsCreated: [] as string[],
    errors: [] as string[],
    existing: [] as string[]
  };

  try {
    // Check existing buckets first
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      results.errors.push(`Failed to list buckets: ${listError.message}`);
      return results;
    }

    const existingBucketNames = existingBuckets?.map(b => b.name) || [];
    console.log('Existing buckets:', existingBucketNames);

    const requiredBuckets = ['event-images', 'avatars'];

    // Check if required buckets exist
    for (const bucketName of requiredBuckets) {
      if (existingBucketNames.includes(bucketName)) {
        results.existing.push(bucketName);
        console.log(`Bucket ${bucketName} exists and is accessible`);
      } else {
        results.errors.push(`Bucket ${bucketName} is missing - please run database migrations`);
      }
    }

    // Test bucket access for existing buckets
    for (const bucketName of results.existing) {
      const accessTest = await testBucketAccess(bucketName);
      if (!accessTest.success) {
        results.errors.push(`Bucket ${bucketName} access test failed: ${accessTest.error}`);
      }
    }

  } catch (error) {
    console.error('Storage setup failed:', error);
    results.errors.push(`Storage setup failed: ${(error as Error).message}`);
  }

  return results;
};

export const testBucketAccess = async (bucketName: string) => {
  try {
    // Test file upload and delete
    const testContent = new Blob(['test'], { type: 'text/plain' });
    const testFileName = `test-${Date.now()}.txt`;

    console.log(`Testing access to bucket: ${bucketName}`);
    
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testFileName, testContent);

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    // Clean up test file
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([testFileName]);

    if (deleteError) {
      console.warn(`Failed to clean up test file: ${deleteError.message}`);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const testStorageAccess = async () => {
  const buckets = ['event-images', 'avatars'];
  const results = [];
  
  for (const bucket of buckets) {
    const result = await testBucketAccess(bucket);
    results.push({ bucket, ...result });
  }
  
  return {
    success: results.every(r => r.success),
    results
  };
};
