
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
  priority?: 'high' | 'medium' | 'low';
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

export const OptimizedImage = React.memo(({
  src,
  alt,
  className,
  fallback = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  aspectRatio,
  priority = 'medium',
  loading = 'lazy',
  width,
  height
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
      setHasError(true);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  };

  const aspectRatioClass = {
    'square': 'aspect-square',
    'video': 'aspect-video', 
    'portrait': 'aspect-[3/4]'
  }[aspectRatio || ''] || '';

  return (
    <div className={cn(
      'relative overflow-hidden bg-muted',
      aspectRatioClass,
      className
    )}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      
      <img
        src={imgSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError ? 'opacity-75' : '',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        width={width}
        height={height}
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
});
