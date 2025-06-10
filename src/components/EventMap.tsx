
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Event } from '@/lib/types';
import { getAPIConfig } from '@/services/api-config';
import { useToast } from '@/components/ui/use-toast';
import { Button } from './ui/button';
import { Search, Filter, Loader2 } from 'lucide-react'; // Added Loader2
import { Skeleton } from '@/components/ui/skeleton'; // Added Skeleton
import { useNavigate } from 'react-router-dom';

interface EventMapProps {
  events: Event[];
  showFilters?: boolean;
  isInteractive?: boolean;
  className?: string;
  userLocation?: [number, number]; // [lng, lat] format for Mapbox
  isLoadingEvents?: boolean; // Added prop for parent loading state
}

const EventMap = ({ 
  events, 
  showFilters = false, 
  isInteractive = true,
  className = '',
  userLocation,
  isLoadingEvents = false // Default to false
}: EventMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);

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
      
      // Use user location as center if available, otherwise default to a central location
      const defaultCenter: [number, number] = userLocation || [12.4964, 41.9028]; // Rome, Italy as default
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        zoom: userLocation ? 12 : 6,
        center: defaultCenter,
        interactive: isInteractive,
      });

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
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
  }, [mapboxToken, isInteractive, userLocation, toast]);

  // Handle user location marker
  useEffect(() => {
    if (!mapLoaded || !map.current || !userLocation) return;

    console.log('Adding user location marker at:', userLocation);

    // Remove existing user marker
    if (userMarker.current) {
      userMarker.current.remove();
    }

    // Add user location marker
    userMarker.current = new mapboxgl.Marker({
      color: '#3b82f6',
      scale: 1.0
    })
      .setLngLat(userLocation)
      .addTo(map.current)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML('<div class="p-2"><p class="font-medium">Your location</p></div>')
      );

    // Center map on user location
    map.current.flyTo({
      center: userLocation,
      zoom: 12,
      essential: true
    });
  }, [mapLoaded, userLocation]);

  // Add event markers when events or map changes
  useEffect(() => {
    if (!mapLoaded || !map.current) {
      console.log('Map not ready for markers');
      return;
    }

    console.log('Adding markers for events:', events);

    // Clear any existing event markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each event with valid coordinates
    events.forEach((event, index) => {
      if (!event.location.coordinates || !map.current) return;
      
      // Get coordinates - ensure we have valid numbers
      let lat = event.location.coordinates[0];
      let lng = event.location.coordinates[1];
      
      console.log(`Processing event "${event.title}" (${index}) with coordinates: lat=${lat}, lng=${lng}`);
      
      // Validate coordinates
      if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
        console.warn(`Invalid coordinates for event ${event.id}: [${lat}, ${lng}]`);
        return;
      }
      
      // Skip events with zero coordinates (likely invalid)
      if (lat === 0 && lng === 0) {
        console.warn(`Zero coordinates for event ${event.id}, skipping`);
        return;
      }
      
      // Create marker element with vibrant styling
      const el = document.createElement('div');
      el.className = 'event-marker';
      el.style.backgroundColor = '#8B5CF6';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 10px rgba(139, 92, 246, 0.5)';
      el.style.transition = 'all 0.2s ease';

      // Hover effects
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.8)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.boxShadow = '0 2px 10px rgba(139, 92, 246, 0.5)';
      });

      // Add popup with event details
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        className: 'custom-popup'
      })
      .setHTML(`
        <div class="p-3 space-y-2 min-w-[200px]">
          <h3 class="font-bold text-lg text-white">${event.title}</h3>
          <p class="text-sm text-gray-300">${event.location.address}</p>
          ${event.location.venue_name ? `<p class="text-sm font-medium text-blue-300">${event.location.venue_name}</p>` : ''}
          <div class="pt-2">
            <button onclick="window.location.href='/event/${event.id}'" class="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded text-sm font-medium">
              View Details
            </button>
          </div>
        </div>
      `);

      try {
        // Create and add marker with correct coordinates order (lng, lat for Mapbox!)
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat]) // Mapbox expects [longitude, latitude]
          .setPopup(popup);
          
        if (map.current) {
          marker.addTo(map.current);
          markers.current.push(marker);
          console.log(`✅ Added marker for event "${event.title}" at [${lng}, ${lat}]`);
        }
      } catch (error) {
        console.error(`❌ Error adding marker for event ${event.id}:`, error);
      }
    });

    console.log(`Total markers added: ${markers.current.length} out of ${events.length} events`);

    // Fit bounds to include all markers and user location if there are any events
    if (markers.current.length > 0 && map.current) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        
        // Add event coordinates to bounds
        events.forEach(event => {
          if (event.location.coordinates) {
            const lat = event.location.coordinates[0];
            const lng = event.location.coordinates[1];
            
            if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng) && !(lat === 0 && lng === 0)) {
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
      
      {/* Loading overlay */}
      {mapboxToken && (!mapLoaded || isLoadingEvents) && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-muted-foreground text-sm">
            {isLoadingEvents ? "Loading events..." : "Initializing map..."}
          </p>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden border border-border/40 shadow-lg" />
      {/* Subtle border overlay to ensure it's above map tiles but below UI elements like popups or loading overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-xl border border-border/10 z-0" />
    </div>
  );
};

export default EventMap;
