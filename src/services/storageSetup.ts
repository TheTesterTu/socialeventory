
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

    const requiredBuckets = [
      { 
        name: 'event-images', 
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760 // 10MB
      },
      { 
        name: 'avatars', 
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB
      }
    ];

    for (const bucket of requiredBuckets) {
      if (existingBucketNames.includes(bucket.name)) {
        results.existing.push(bucket.name);
        console.log(`Bucket ${bucket.name} already exists`);
        continue;
      }

      console.log(`Creating bucket: ${bucket.name}`);
      const { error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        allowedMimeTypes: bucket.allowedMimeTypes,
        fileSizeLimit: bucket.fileSizeLimit
      });

      if (error) {
        console.error(`Failed to create ${bucket.name}:`, error);
        results.errors.push(`Failed to create ${bucket.name}: ${error.message}`);
      } else {
        results.bucketsCreated.push(bucket.name);
        console.log(`Successfully created bucket: ${bucket.name}`);
      }
    }

    // Test bucket access after creation
    for (const bucketName of [...results.bucketsCreated, ...results.existing]) {
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
