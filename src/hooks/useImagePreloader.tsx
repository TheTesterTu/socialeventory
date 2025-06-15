
import { useState, useEffect } from 'react';

interface UseImagePreloaderOptions {
  priority?: 'high' | 'medium' | 'low';
  fallback?: string;
  placeholder?: string;
  enableWebP?: boolean;
}

export const useImagePreloader = (
  src: string, 
  options: UseImagePreloaderOptions = {}
) => {
  const { priority = 'medium', fallback, placeholder, enableWebP = true } = options;
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    const handleLoad = () => {
      setImageSrc(src);
      setIsLoading(false);
      setError(null);
    };

    const handleError = () => {
      if (fallback) {
        setImageSrc(fallback);
        setError('Primary image failed, using fallback');
      } else {
        setError('Image failed to load');
      }
      setIsLoading(false);
    };

    // Check WebP support and optimize
    if (enableWebP && src.includes('.jpg') || src.includes('.png')) {
      const canvas = document.createElement('canvas');
      const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      
      if (webpSupported) {
        const optimizedSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        img.src = optimizedSrc;
        setIsOptimized(true);
      } else {
        img.src = src;
      }
    } else {
      img.src = src;
    }

    img.onload = handleLoad;
    img.onerror = handleError;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallback, placeholder, enableWebP]);

  return { imageSrc, isLoading, error, isOptimized };
};
