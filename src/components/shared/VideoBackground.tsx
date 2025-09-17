import { useState, useEffect } from "react";

interface VideoBackgroundProps {
  className?: string;
  fallbackImage?: string;
  children?: React.ReactNode;
}

export const VideoBackground = ({ 
  className = "", 
  fallbackImage = "https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  children 
}: VideoBackgroundProps) => {
  const [useVideo, setUseVideo] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if user prefers reduced motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setUseVideo(false);
    }
  }, []);

  const handleVideoError = () => {
    setUseVideo(false);
  };

  const handleVideoLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 w-full h-full">
        {useVideo ? (
          <video
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            onError={handleVideoError}
            onLoadedData={handleVideoLoad}
          >
            <source src="https://cdn.pixabay.com/video/2022/12/11/142759-778749885_large.mp4" type="video/mp4" />
            <source src="https://cdn.pixabay.com/video/2021/03/28/70019-535917103_large.mp4" type="video/mp4" />
          </video>
        ) : null}
        
        {/* Fallback image - always rendered for smooth loading */}
        <img
          src={fallbackImage}
          alt="Background"
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            useVideo && isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary-dark/25 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>
      
      {children}
    </div>
  );
};