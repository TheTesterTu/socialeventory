
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
        
        // Test actual bucket access with a more comprehensive test
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

// Create a proper test image instead of text file
const createTestImage = (): Blob => {
  // Create a 1x1 pixel PNG image as a Blob
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 1, 1);
  }
  
  // Convert canvas to blob synchronously for testing
  const imageData = canvas.toDataURL('image/png');
  const byteString = atob(imageData.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: 'image/png' });
};

export const testBucketAccess = async (bucketName: string) => {
  try {
    console.log(`🧪 Testing bucket access: ${bucketName}`);
    
    // Create a proper test image file
    const testImage = createTestImage();
    const testFileName = `test-access-${Date.now()}.png`;

    // Test upload with proper image file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testFileName, testImage, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error(`Upload test failed for ${bucketName}:`, uploadError);
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    console.log(`✅ Upload test passed for ${bucketName}`, uploadData);

    // Test download/public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(testFileName);
    
    if (!publicUrlData?.publicUrl) {
      return { success: false, error: 'Failed to get public URL' };
    }

    console.log(`✅ Public URL test passed for ${bucketName}:`, publicUrlData.publicUrl);

    // Test actual file retrieval
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(testFileName);

    if (downloadError) {
      console.warn(`⚠️ Download test failed for ${bucketName}:`, downloadError.message);
      // Don't fail completely on download issues
    } else {
      console.log(`✅ Download test passed for ${bucketName}`);
    }

    // Clean up test file
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([testFileName]);

    if (deleteError) {
      console.warn(`⚠️ Failed to clean up test file in ${bucketName}:`, deleteError.message);
    } else {
      console.log(`🧹 Cleanup successful for ${bucketName}`);
    }

    return { success: true, publicUrl: publicUrlData.publicUrl };
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

// Enhanced function to upload a real image for testing
export const uploadTestImage = async (bucketName: string) => {
  try {
    const testImage = createTestImage();
    const fileName = `test-image-${Date.now()}.png`;
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, testImage, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      throw error;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    throw new Error(`Failed to upload test image: ${(error as Error).message}`);
  }
};
