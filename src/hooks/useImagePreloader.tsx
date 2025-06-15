
import { useState, useEffect, useCallback } from 'react';

interface UseImagePreloaderOptions {
  priority?: 'high' | 'medium' | 'low';
  placeholder?: string;
  fallback?: string;
  enableWebP?: boolean;
}

export const useImagePreloader = (src: string, options: UseImagePreloaderOptions = {}) => {
  const {
    priority = 'medium',
    placeholder = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    fallback = placeholder,
    enableWebP = true
  } = options;

  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const preloadImage = useCallback((url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      
      // Set loading attribute based on priority
      if (priority === 'high') {
        img.loading = 'eager';
      } else {
        img.loading = 'lazy';
      }
      
      img.src = url;
    });
  }, [priority]);

  const getOptimizedImageUrl = useCallback((originalUrl: string): string => {
    if (!enableWebP || !originalUrl.includes('unsplash.com')) {
      return originalUrl;
    }

    // Add WebP format and optimization parameters for Unsplash images
    const url = new URL(originalUrl);
    url.searchParams.set('fm', 'webp');
    url.searchParams.set('q', '80');
    url.searchParams.set('fit', 'crop');
    
    return url.toString();
  }, [enableWebP]);

  useEffect(() => {
    if (!src) {
      setImageSrc(fallback);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const optimizedSrc = getOptimizedImageUrl(src);

    preloadImage(optimizedSrc)
      .then(() => {
        setImageSrc(optimizedSrc);
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback to original image if WebP fails
        if (optimizedSrc !== src) {
          return preloadImage(src);
        }
        throw new Error('Both optimized and original image failed');
      })
      .then(() => {
        if (imageSrc !== src) {
          setImageSrc(src);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setImageSrc(fallback);
        setIsLoading(false);
      });
  }, [src, fallback, preloadImage, getOptimizedImageUrl]);

  return {
    imageSrc,
    isLoading,
    error,
    isOptimized: imageSrc.includes('fm=webp')
  };
};
