
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface GeolocationState {
  coordinates: { lat: number; lng: number } | null;
  isLoading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    isLoading: true,
    error: null,
  });
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by this browser';
      setState(prev => ({ ...prev, error, isLoading: false }));
      toast({
        title: "Location Error",
        description: error,
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setState({ coordinates, isLoading: false, error: null });
        toast({
          title: "Location found!",
          description: "Now showing events near you.",
        });
      },
      (error) => {
        const errorMessage = error.message || 'Failed to get your location';
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    ...state,
    getCurrentLocation,
  };
};
