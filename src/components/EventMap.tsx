
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
    userEl.style.cssText = `
      width: 20px;
      height: 20px;
      background-color: #2563eb;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
      cursor: pointer;
      position: relative;
      z-index: 10;
    `;

    // Add pulse animation
    const pulseEl = document.createElement('div');
    pulseEl.style.cssText = `
      position: absolute;
      top: -3px;
      left: -3px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background-color: #2563eb;
      opacity: 0.3;
      animation: pulse 2s infinite;
      pointer-events: none;
    `;
    userEl.appendChild(pulseEl);

    // Add user location marker
    userMarker.current = new mapboxgl.Marker(userEl)
      .setLngLat(userLocation)
      .addTo(map.current)
      .setPopup(
        new mapboxgl.Popup({ 
          offset: 25, 
          className: 'user-popup',
          closeButton: true,
          closeOnClick: false
        })
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
      
      // Determine marker color based on event status
      const isPast = (event as any).isPast || new Date(event.endDate) < new Date();
      const markerColor = isPast ? '#6B7280' : '#16a085'; // Gray for past, teal for active/future
      const borderColor = isPast ? '#9CA3AF' : 'white';
      
      // Create improved marker element with status-based styling
      const el = document.createElement('div');
      el.className = `event-marker ${isPast ? 'past-event' : 'active-event'}`;
      el.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        border: 3px solid ${borderColor};
        background-color: ${markerColor};
        box-shadow: 0 4px 12px ${isPast ? 'rgba(107, 114, 128, 0.3)' : 'rgba(22, 160, 133, 0.4)'};
        transition: all 0.2s ease;
        position: relative;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        ${isPast ? 'opacity: 0.7;' : ''}
      `;

      // Add inner dot for better visibility
      const innerDot = document.createElement('div');
      innerDot.style.cssText = `
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
        pointer-events: none;
      `;
      el.appendChild(innerDot);

      // Fixed hover effects - no transform to prevent movement
      el.addEventListener('mouseenter', () => {
        el.style.boxShadow = '0 6px 20px rgba(22, 160, 133, 0.6)';
        el.style.zIndex = '1000';
        el.style.borderWidth = '4px';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.boxShadow = '0 4px 12px rgba(22, 160, 133, 0.4)';
        el.style.zIndex = '5';
        el.style.borderWidth = '3px';
      });

      // Create safe popup content with proper data validation
      const createPopupContent = (eventData: Event) => {
        // Safely extract and validate event data
        const title = eventData.title || 'Untitled Event';
        const address = eventData.location?.address || 'Location not specified';
        const venueName = eventData.location?.venue_name || '';
        const eventId = eventData.id || '';
        const imageUrl = eventData.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87';
        const isPast = (eventData as any).isPast || new Date(eventData.endDate) < new Date();
        const eventDate = new Date(eventData.startDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        return `
          <div class="p-4 space-y-3 min-w-[280px] bg-white rounded-lg shadow-lg">
            <div class="space-y-3">
              <img src="${imageUrl}" alt="${title}" class="w-full h-32 object-cover rounded-lg" />
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-lg text-gray-900 line-clamp-2 flex-1">${title}</h3>
                  ${isPast ? '<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Past</span>' : ''}
                </div>
                <p class="text-sm text-gray-600">${eventDate}</p>
                <p class="text-sm text-gray-600">${address}</p>
                ${venueName ? `<p class="text-sm font-medium text-primary">${venueName}</p>` : ''}
              </div>
            </div>
            <div class="pt-2 border-t border-gray-100">
              <button 
                onclick="window.location.href='/event/${eventId}'" 
                class="w-full ${isPast ? 'bg-gray-500 hover:bg-gray-600' : 'bg-primary hover:bg-primary/90'} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ${isPast ? 'View Past Event' : 'View Details'}
              </button>
            </div>
          </div>
        `;
      };

      // Add popup with event details
      const popup = new mapboxgl.Popup({ 
        offset: 30,
        className: 'event-popup',
        closeButton: true,
        closeOnClick: false
      })
      .setHTML(createPopupContent(event));

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
      <style>{`
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
        
        .event-marker:hover {
          z-index: 1000 !important;
        }
        
        .mapboxgl-popup {
          z-index: 1001 !important;
        }
        
        .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 8px !important;
        }
      `}</style>
    </div>
  );
};

export default EventMap;
