
import { supabase } from '@/integrations/supabase/client';

export const setupStorageBuckets = async () => {
  const results = {
    bucketsCreated: [] as string[],
    errors: [] as string[]
  };

  try {
    // Check existing buckets
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    const existingBucketNames = existingBuckets?.map(b => b.name) || [];

    const requiredBuckets = [
      { name: 'event-images', public: true },
      { name: 'avatars', public: true }
    ];

    for (const bucket of requiredBuckets) {
      if (!existingBucketNames.includes(bucket.name)) {
        const { error } = await supabase.storage.createBucket(bucket.name, {
          public: bucket.public,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          fileSizeLimit: 5242880 // 5MB
        });

        if (error) {
          results.errors.push(`Failed to create ${bucket.name}: ${error.message}`);
        } else {
          results.bucketsCreated.push(bucket.name);
        }
      }
    }
  } catch (error) {
    results.errors.push(`Storage setup failed: ${(error as Error).message}`);
  }

  return results;
};

export const testStorageAccess = async () => {
  try {
    // Test file upload and delete
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const testFileName = `test-${Date.now()}.txt`;

    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(testFileName, testFile);

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    // Clean up test file
    await supabase.storage
      .from('event-images')
      .remove([testFileName]);

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
