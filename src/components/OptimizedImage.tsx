
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
  fallback?: string;
  placeholder?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  enableWebP?: boolean;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  priority = 'medium',
  fallback,
  placeholder,
  aspectRatio = 'auto',
  enableWebP = true,
  onLoad,
  onError
}: OptimizedImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { imageSrc, isLoading, error, isOptimized } = useImagePreloader(src, {
    priority,
    fallback,
    placeholder,
    enableWebP
  });

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    if (error) {
      onError?.(error);
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'video': return 'aspect-video';
      default: return '';
    }
  };

  return (
    <div className={cn(
      'relative overflow-hidden',
      getAspectRatioClass(),
      className
    )}>
      {(isLoading || !imageLoaded) && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      <img
        src={imageSrc || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={priority === 'high' ? 'eager' : 'lazy'}
        decoding="async"
      />
      
      {/* Performance indicator for development */}
      {import.meta.env.MODE === 'development' && isOptimized && (
        <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded">
          WebP
        </div>
      )}
    </div>
  );
};
