
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Event } from '@/lib/types';
import { getAPIConfig } from '@/services/api-config';
import { useToast } from '@/components/ui/use-toast';
import { Button } from './ui/button';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventMapProps {
  events: Event[];
  showFilters?: boolean;
  isInteractive?: boolean;
  className?: string;
}

const EventMap = ({ 
  events, 
  showFilters = false, 
  isInteractive = true,
  className = '' 
}: EventMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Fetch Mapbox token from API configurations
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const token = await getAPIConfig('mapbox_token');
        if (token) {
          setMapboxToken(token);
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      }
    };

    fetchMapboxToken();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        zoom: 12,
        center: [-73.935242, 40.730610], // Default to NYC
        interactive: isInteractive,
      });

      map.current.on('load', () => {
        setMapLoaded(true);
        
        // Try to get user location
        if (navigator.geolocation && isInteractive) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userCoords: [number, number] = [
                position.coords.longitude,
                position.coords.latitude
              ];
              setUserLocation(userCoords);
              
              if (map.current) {
                map.current.flyTo({
                  center: userCoords,
                  zoom: 12,
                  essential: true
                });
                
                // Add user location marker
                if (map.current) {
                  new mapboxgl.Marker({
                    color: '#3b82f6',
                    scale: 0.8
                  })
                    .setLngLat(userCoords)
                    .addTo(map.current)
                    .setPopup(
                      new mapboxgl.Popup({ offset: 25 })
                        .setHTML('<div class="p-2"><p class="font-medium">Your location</p></div>')
                    );
                }
              }
            },
            () => {
              // If geolocation fails, we'll keep the default center
              console.log('Geolocation permission denied or unavailable');
            }
          );
        }
      });

      // Add controls if interactive
      if (isInteractive && map.current) {
        map.current.addControl(
          new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true,
          }),
          'top-right'
        );
      }

      // Cleanup
      return () => {
        if (map.current) {
          map.current.remove();
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Map Error",
        description: "There was an error loading the map. Please try again later.",
        variant: "destructive"
      });
    }
  }, [mapboxToken, isInteractive, toast]);

  // Add event markers when events or map changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear any existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each event with valid coordinates
    events.forEach(event => {
      if (!event.location.coordinates || !map.current) return;
      
      // Validate coordinates - skip invalid ones
      const lat = event.location.coordinates[0];
      const lng = event.location.coordinates[1];
      
      if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
        console.warn(`Invalid coordinates for event ${event.id}: [${lat}, ${lng}]`);
        return;
      }
      
      // Create marker element with modern styling
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = '#8B5CF6';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '3px solid rgba(139, 92, 246, 0.3)';
      el.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.4)';
      el.style.transition = 'all 0.2s ease';

      // Hover effects
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1)';
        el.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.6)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.4)';
      });

      // Add popup with modern styling
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        className: 'custom-popup'
      })
      .setHTML(`
        <div class="p-3 space-y-2">
          <h3 class="font-bold text-lg">${event.title}</h3>
          <p class="text-sm text-muted-foreground">${event.location.address}</p>
          ${event.location.venue_name ? `<p class="text-sm font-medium">${event.location.venue_name}</p>` : ''}
          <a href="/event/${event.id}" class="text-primary hover:underline text-sm font-medium">View details</a>
        </div>
      `);

      try {
        // Create and add marker with correct coordinates order (lng, lat for Mapbox!)
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat]) // Switched order: Mapbox expects [longitude, latitude]
          .setPopup(popup);
          
        if (map.current) {
          marker.addTo(map.current);
          markers.current.push(marker);
        }
      } catch (error) {
        console.error(`Error adding marker for event ${event.id}:`, error);
      }
    });

    // Fit bounds to include all markers if there are any
    if (markers.current.length > 0 && map.current) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        
        events.forEach(event => {
          if (event.location.coordinates) {
            const lat = event.location.coordinates[0];
            const lng = event.location.coordinates[1];
            
            if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
              bounds.extend([lng, lat]);
            }
          }
        });
        
        // Include user location in bounds if available
        if (userLocation) {
          bounds.extend(userLocation);
        }
        
        // Only adjust bounds if we have valid coordinates
        if (!bounds.isEmpty()) {
          map.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
          });
        }
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    }
  }, [events, mapLoaded, userLocation]);

  const handleSearchNearby = () => {
    navigate('/nearby');
  };

  return (
    <div className={`relative w-full h-[600px] ${className}`}>
      {!mapboxToken && (
        <div className="absolute inset-0 bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10">
          <p className="text-center mb-4 text-lg">Please enter your Mapbox public token in admin settings</p>
          <p className="text-sm text-muted-foreground">
            You can get your token from{' '}
            <a 
              href="https://account.mapbox.com/access-tokens/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Mapbox Dashboard
            </a>
          </p>
        </div>
      )}
      
      {showFilters && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button 
            variant="secondary" 
            className="shadow-md flex items-center gap-2"
            onClick={handleSearchNearby}
          >
            <Search className="h-4 w-4" />
            <span>Search This Area</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-background/80 backdrop-blur shadow-md"
            onClick={() => navigate('/search')}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden border border-border/40 shadow-lg" />
      <div className="absolute inset-0 pointer-events-none rounded-xl border border-border/10" />
    </div>
  );
};

export default EventMap;
