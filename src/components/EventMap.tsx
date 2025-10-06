
import React, { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Supercluster from 'supercluster';
import { Event } from '@/lib/types';
import { getAPIConfig } from '@/services/api-config';
import { useToast } from '@/components/ui/use-toast';
import { Button } from './ui/button';
import { Search, Filter, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

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
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const clusterMarkers = useRef<mapboxgl.Marker[]>([]);

  // Fetch Mapbox token from API configurations
  useEffect(() => {
    const fetchMapboxToken = async () => {
      setIsLoadingToken(true);
      try {
        const token = await getAPIConfig('mapbox_token');
        if (token) {
          setMapboxToken(token);
        } else {
          console.warn('Mapbox token not found in API configurations');
          toast({
            title: "Map Configuration Missing",
            description: "Mapbox token not configured. Please contact admin.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
        toast({
          title: "Error Loading Map",
          description: "Failed to fetch map configuration.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingToken(false);
      }
    };

    fetchMapboxToken();
  }, [toast]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      // Use user location as center if available, otherwise default to a central location
      const defaultCenter: [number, number] = userLocation || [12.4964, 41.9028]; // Rome, Italy as default
      
      // Choose modern map style based on theme with 3D terrain
      const mapStyle = theme === 'dark' 
        ? 'mapbox://styles/mapbox/navigation-night-v1' 
        : 'mapbox://styles/mapbox/streets-v12';
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        zoom: userLocation ? 12 : 6,
        center: defaultCenter,
        interactive: isInteractive,
        attributionControl: false,
      });

      // Add attribution control in bottom-right
      map.current.addControl(
        new mapboxgl.AttributionControl({
          compact: true
        }),
        'bottom-right'
      );

      map.current.on('load', () => {
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
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

        // Add geolocation control
        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
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
  }, [mapboxToken, isInteractive, userLocation, toast, theme]);

  // Handle user location marker
  useEffect(() => {
    if (!mapLoaded || !map.current || !userLocation) return;

    

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

  // Create supercluster index for clustering
  const { clusters, supercluster } = useMemo(() => {
    if (!events.length) return { clusters: [], supercluster: null };

    const points = events
      .filter(event => {
        const [lat, lng] = event.location.coordinates;
        return !isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng) && !(lat === 0 && lng === 0);
      })
      .map(event => ({
        type: 'Feature' as const,
        properties: { 
          cluster: false, 
          eventId: event.id,
          event: event 
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [event.location.coordinates[1], event.location.coordinates[0]] // [lng, lat]
        }
      }));

    const supercluster = new Supercluster({
      radius: 75,
      maxZoom: 16,
      minZoom: 0,
      minPoints: 3
    });

    supercluster.load(points);

    const bounds = map.current?.getBounds();
    const zoom = map.current?.getZoom() || 0;

    if (!bounds) return { clusters: [], supercluster };

    const clusters = supercluster.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      Math.floor(zoom)
    );

    return { clusters, supercluster };
  }, [events, mapLoaded]);

  // Add event markers with clustering when events or map changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear any existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    clusterMarkers.current.forEach(marker => marker.remove());
    clusterMarkers.current = [];

    // Add markers for clusters and individual events
    clusters.forEach((cluster) => {
      if (!map.current) return;

      const [longitude, latitude] = cluster.geometry.coordinates;
      const { cluster: isCluster, point_count: pointCount } = cluster.properties as any;

      if (isCluster) {
        // Create cluster marker
        const clusterEl = document.createElement('div');
        clusterEl.className = 'cluster-marker';
        clusterEl.style.cssText = `
          width: ${30 + (pointCount / events.length) * 40}px;
          height: ${30 + (pointCount / events.length) * 40}px;
          border-radius: 50%;
          background: linear-gradient(135deg, #16a085, #1abc9c);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: ${12 + (pointCount / events.length) * 8}px;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(22, 160, 133, 0.4);
          transition: all 0.3s ease;
        `;
        clusterEl.textContent = pointCount.toString();

        clusterEl.addEventListener('mouseenter', () => {
          clusterEl.style.transform = 'scale(1.1)';
          clusterEl.style.boxShadow = '0 6px 20px rgba(22, 160, 133, 0.6)';
        });

        clusterEl.addEventListener('mouseleave', () => {
          clusterEl.style.transform = 'scale(1)';
          clusterEl.style.boxShadow = '0 4px 12px rgba(22, 160, 133, 0.4)';
        });

        // Zoom to cluster on click
        clusterEl.addEventListener('click', () => {
          if (!map.current || !supercluster) return;
          const expansionZoom = Math.min(
            supercluster.getClusterExpansionZoom(cluster.id as number),
            16
          );
          map.current.easeTo({
            center: [longitude, latitude],
            zoom: expansionZoom,
            duration: 500
          });
        });

        const clusterMarker = new mapboxgl.Marker(clusterEl)
          .setLngLat([longitude, latitude])
          .addTo(map.current);

        clusterMarkers.current.push(clusterMarker);
        return;
      }

      // Individual event marker
      const event = cluster.properties.event as Event;
      if (!event) return;
      
      
      // Determine marker color based on event status
      const isPast = (event as any).isPast || new Date(event.endDate) < new Date();
      const markerColor = isPast ? '#9CA3AF' : '#16a085'; // Gray for past, teal for active/future
      const borderColor = isPast ? '#D1D5DB' : 'white';
      
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
        const imageUrl = eventData.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80';
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
              <img src="${imageUrl}" alt="${title}" class="w-full h-32 object-cover rounded-lg" 
                   onerror="this.src='https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'" />
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
          .setLngLat([longitude, latitude]) // Mapbox expects [longitude, latitude]
          .setPopup(popup);
          
        if (map.current) {
          marker.addTo(map.current);
          markers.current.push(marker);
        }
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });

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

    // Update clusters when map moves
    const updateClusters = () => {
      // Force re-render by triggering a state update
      if (map.current) {
        const zoom = map.current.getZoom();
        const bounds = map.current.getBounds();
        // The useMemo hook will automatically recalculate clusters
      }
    };

    map.current?.on('moveend', updateClusters);
    map.current?.on('zoomend', updateClusters);

    return () => {
      map.current?.off('moveend', updateClusters);
      map.current?.off('zoomend', updateClusters);
    };
  }, [clusters, mapLoaded, userLocation, supercluster]);

  const handleSearchNearby = () => {
    navigate('/nearby');
  };

  return (
    <div className={`relative w-full h-[600px] ${className}`}>
      {isLoadingToken && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-center text-lg">Loading map...</p>
        </div>
      )}
      
      {!isLoadingToken && !mapboxToken && (
        <div className="absolute inset-0 bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10">
          <p className="text-center mb-4 text-lg font-semibold">Map Configuration Required</p>
          <p className="text-sm text-muted-foreground max-w-md text-center">
            Mapbox token not configured. Please contact your administrator to add a Mapbox token in the admin settings.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Administrators can get a token from{' '}
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

        .cluster-marker:hover {
          z-index: 1000 !important;
        }
        
        .mapboxgl-popup {
          z-index: 1001 !important;
        }
        
        .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .mapboxgl-ctrl-group {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .mapboxgl-ctrl-group button {
          background-color: hsl(var(--card)) !important;
          color: hsl(var(--foreground)) !important;
        }

        .mapboxgl-ctrl-group button:hover {
          background-color: hsl(var(--accent)) !important;
        }
      `}</style>
    </div>
  );
};

export default EventMap;
