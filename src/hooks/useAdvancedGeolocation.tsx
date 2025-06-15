
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watchPosition?: boolean;
}

interface GeolocationData {
  coordinates: { lat: number; lng: number } | null;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useAdvancedGeolocation = (options: GeolocationOptions = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 15000,
    maximumAge = 60000,
    watchPosition = false
  } = options;

  const [state, setState] = useState<GeolocationData>({
    coordinates: null,
    accuracy: null,
    altitude: null,
    heading: null,
    speed: null,
    isLoading: false,
    error: null,
    lastUpdated: null
  });

  const { toast } = useToast();

  const updatePosition = useCallback((position: GeolocationPosition) => {
    const { coords } = position;
    setState(prev => ({
      ...prev,
      coordinates: {
        lat: coords.latitude,
        lng: coords.longitude
      },
      accuracy: coords.accuracy,
      altitude: coords.altitude,
      heading: coords.heading,
      speed: coords.speed,
      isLoading: false,
      error: null,
      lastUpdated: new Date()
    }));
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Errore nella geolocalizzazione';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Accesso alla posizione negato. Abilita la geolocalizzazione nelle impostazioni.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Posizione non disponibile';
        break;
      case error.TIMEOUT:
        errorMessage = 'Timeout nella richiesta di posizione';
        break;
    }

    setState(prev => ({
      ...prev,
      error: errorMessage,
      isLoading: false
    }));

    toast({
      title: "Errore Geolocalizzazione",
      description: errorMessage,
      variant: "destructive"
    });
  }, [toast]);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      const error = 'Geolocalizzazione non supportata da questo browser';
      setState(prev => ({ ...prev, error, isLoading: false }));
      toast({
        title: "Geolocalizzazione non supportata",
        description: error,
        variant: "destructive"
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      updatePosition,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge, updatePosition, handleError, toast]);

  // Watch position if enabled
  useEffect(() => {
    if (!watchPosition || !navigator.geolocation) return;

    setState(prev => ({ ...prev, isLoading: true }));

    const watchId = navigator.geolocation.watchPosition(
      updatePosition,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [watchPosition, enableHighAccuracy, timeout, maximumAge, updatePosition, handleError]);

  // Get initial position
  useEffect(() => {
    if (!watchPosition) {
      getCurrentPosition();
    }
  }, [watchPosition, getCurrentPosition]);

  const requestPermission = useCallback(async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state;
      } catch (error) {
        console.warn('Permission API not available');
        return 'prompt';
      }
    }
    return 'prompt';
  }, []);

  return {
    ...state,
    getCurrentPosition,
    requestPermission
  };
};
