
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
  userLocation?: [number, number]; // [lng, lat] format for Mapbox
}

const EventMap = ({ 
  events, 
  showFilters = false, 
  isInteractive = true,
  className = '',
  userLocation
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
        style: 'mapbox://styles/mapbox/light-v11',
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

    // Create custom user location marker element
    const userEl = document.createElement('div');
    userEl.className = 'user-location-marker';
    userEl.style.width = '16px';
    userEl.style.height = '16px';
    userEl.style.backgroundColor = '#2563eb';
    userEl.style.borderRadius = '50%';
    userEl.style.border = '3px solid white';
    userEl.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.4)';
    userEl.style.cursor = 'pointer';

    // Add pulse animation
    const pulseEl = document.createElement('div');
    pulseEl.style.position = 'absolute';
    pulseEl.style.top = '-3px';
    pulseEl.style.left = '-3px';
    pulseEl.style.width = '22px';
    pulseEl.style.height = '22px';
    pulseEl.style.borderRadius = '50%';
    pulseEl.style.backgroundColor = '#2563eb';
    pulseEl.style.opacity = '0.3';
    pulseEl.style.animation = 'pulse 2s infinite';
    userEl.appendChild(pulseEl);

    // Add user location marker
    userMarker.current = new mapboxgl.Marker(userEl)
      .setLngLat(userLocation)
      .addTo(map.current)
      .setPopup(
        new mapboxgl.Popup({ offset: 25, className: 'user-popup' })
          .setHTML('<div class="p-2 font-medium text-blue-600">Your location</div>')
      );
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
      
      // Create improved marker element
      const el = document.createElement('div');
      el.className = 'event-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '3px solid white';
      el.style.backgroundColor = '#16a085';
      el.style.boxShadow = '0 4px 12px rgba(22, 160, 133, 0.4)';
      el.style.transition = 'all 0.3s ease';
      el.style.position = 'relative';

      // Add inner dot for better visibility
      const innerDot = document.createElement('div');
      innerDot.style.position = 'absolute';
      innerDot.style.top = '50%';
      innerDot.style.left = '50%';
      innerDot.style.transform = 'translate(-50%, -50%)';
      innerDot.style.width = '8px';
      innerDot.style.height = '8px';
      innerDot.style.backgroundColor = 'white';
      innerDot.style.borderRadius = '50%';
      el.appendChild(innerDot);

      // Hover effects
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.3)';
        el.style.boxShadow = '0 6px 20px rgba(22, 160, 133, 0.6)';
        el.style.zIndex = '1000';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.boxShadow = '0 4px 12px rgba(22, 160, 133, 0.4)';
        el.style.zIndex = '1';
      });

      // Add popup with event details
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        className: 'event-popup',
        closeButton: false,
        closeOnClick: false
      })
      .setHTML(`
        <div class="p-4 space-y-3 min-w-[240px] bg-white rounded-lg shadow-lg">
          <div class="space-y-2">
            <h3 class="font-bold text-lg text-gray-900 line-clamp-2">${event.title}</h3>
            <p class="text-sm text-gray-600">${event.location.address}</p>
            ${event.location.venue_name ? `<p class="text-sm font-medium text-primary">${event.location.venue_name}</p>` : ''}
          </div>
          <div class="pt-2 border-t border-gray-100">
            <button 
              onclick="window.location.href='/event/${event.id}'" 
              class="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
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
            className="shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white flex items-center gap-2"
            onClick={handleSearchNearby}
          >
            <Search className="h-4 w-4" />
            <span>Search This Area</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
            onClick={() => navigate('/search')}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden border border-border/20 shadow-lg" />
      
      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default EventMap;
