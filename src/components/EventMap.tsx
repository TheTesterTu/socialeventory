
import { useEffect, useRef, useState } from 'react'; // Removed React
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Event } from '@/lib/types';
import { getAPIConfig } from '@/services/api-config';
import { useToast } from '@/components/ui/use-toast';
import { Button } from './ui/button';
import { Search, Filter, Loader2 } from 'lucide-react';
// import { Skeleton } from '@/components/ui/skeleton'; // Removed unused Skeleton
import { useNavigate } from 'react-router-dom';
import Supercluster from 'supercluster';

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
  const markers = useRef<mapboxgl.Marker[]>([]); // Will now store both single and cluster markers
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [clusterer, setClusterer] = useState<Supercluster | null>(null);
  const [pointsToRender, setPointsToRender] = useState<any[]>([]); // GeoJSON features (points or clusters)

  // Initialize/Update Supercluster when events change
  useEffect(() => {
    if (!events) return;

    const geoJsonPoints = events
      .filter(event => event.location?.coordinates && event.location.coordinates.length === 2 && !isNaN(event.location.coordinates[0]) && !isNaN(event.location.coordinates[1]))
      .map(event => ({
      type: 'Feature' as const,
      properties: {
        cluster: false,
        eventId: event.id,
        title: event.title,
        eventData: event, // Store full event data for single point rendering
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [event.location.coordinates[1], event.location.coordinates[0]], // [lng, lat]
      },
    }));

    const sc = new Supercluster({
      radius: 75, // Cluster radius in pixels, increased for better visual grouping
      maxZoom: 16, // Max zoom to cluster points on
      minZoom: 0, // Min zoom to cluster points on
    });

    sc.load(geoJsonPoints);
    setClusterer(sc);
    console.log('Supercluster initialized/updated with points:', geoJsonPoints.length);

  }, [events]);

  const updateMarkers = () => {
    if (!map.current || !clusterer || !mapLoaded) {
      // console.log('Map, clusterer, or mapLoaded not ready for updating markers.');
      return;
    }

    const bounds = map.current.getBounds();
    const zoom = map.current.getZoom();

    if (!bounds) {
      // console.warn('Map bounds not available yet.');
      setPointsToRender([]); // Clear points if bounds are not available
      return;
    }

    try {
      const clusters = clusterer.getClusters(
        [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
        Math.floor(zoom)
      );
      setPointsToRender(clusters);
      // console.log(`Updating markers for zoom: ${zoom}, bounds: ${JSON.stringify(bounds)}, found clusters/points: ${clusters.length}`);
    } catch (e) {
      console.error("Error getting clusters:", e);
      setPointsToRender([]);
    }
  };

  // Update markers when map view changes or clusterer is ready
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Initial update when clusterer is ready and map is loaded
    if (clusterer) {
      updateMarkers();
    }

    const handleMapViewChange = () => {
      // console.log('Map view changed, updating markers...');
      updateMarkers();
    };

    map.current.on('moveend', handleMapViewChange);
    map.current.on('zoomend', handleMapViewChange);
    // Using 'idle' might be better to avoid too many updates during rapid changes
    // map.current.on('idle', handleMapViewChange);


    return () => {
      if (map.current) {
        map.current.off('moveend', handleMapViewChange);
        map.current.off('zoomend', handleMapViewChange);
        // map.current.off('idle', handleMapViewChange);
      }
    };
  }, [mapLoaded, clusterer]); // Rerun if mapLoaded or clusterer changes

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

  // Render markers for pointsToRender (clusters or single events)
  useEffect(() => {
    if (!mapLoaded || !map.current || !clusterer) {
      // console.log('Map or clusterer not ready for rendering pointsToRender');
      return;
    }

    // console.log('Rendering pointsToRender:', pointsToRender.length);

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    pointsToRender.forEach(point => {
      const coordinates = point.geometry.coordinates as [number, number]; // [lng, lat]
      
      if (point.properties.cluster) {
        // It's a cluster
        const clusterId = point.id;
        const pointCount = point.properties.point_count;

        const el = document.createElement('div');
        el.className = 'cluster-marker';
        el.textContent = pointCount.toString();
        el.style.width = `${30 + (pointCount / geoJsonPoints.length) * 20}px`; // Example dynamic size
        el.style.height = `${30 + (pointCount / geoJsonPoints.length) * 20}px`;
        el.style.backgroundColor = '#f0abfc'; // Purple for clusters
        el.style.color = '#581c87'; // Dark purple text
        el.style.borderRadius = '50%';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.fontWeight = 'bold';
        el.style.cursor = 'pointer';
        el.style.border = '2px solid #581c87';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';

        const marker = new mapboxgl.Marker(el)
          .setLngLat(coordinates)
          .addTo(map.current!);

        el.addEventListener('click', () => {
          if (map.current && clusterer) {
            try {
              const expansionZoom = clusterer.getClusterExpansionZoom(clusterId as number);
              map.current.flyTo({ center: coordinates, zoom: expansionZoom });
            } catch(e) {
              console.error("Error getting cluster expansion zoom", e);
               map.current.flyTo({ center: coordinates, zoom: map.current.getZoom() + 2 }); // Fallback zoom
            }
          }
        });
        markers.current.push(marker);

      } else {
        // It's a single event point
        const event = point.properties.eventData as Event;
        if (!event) return;

        const el = document.createElement('div');
        el.className = 'event-marker';
        el.style.backgroundColor = '#8B5CF6'; // Original purple for single events
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 10px rgba(139, 92, 246, 0.5)';
        el.style.transition = 'all 0.2s ease';
        el.style.transformOrigin = 'center center';

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
          el.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.boxShadow = '0 2px 10px rgba(139, 92, 246, 0.5)';
        });

        const popup = new mapboxgl.Popup({ offset: 25, className: 'custom-popup' })
          .setHTML(`
            <div class="p-3 space-y-2 min-w-[200px]">
              <h3 class="font-bold text-lg">${event.title}</h3> {/* text-white removed */}
              <p class="text-sm">${event.location.address}</p> {/* text-gray-300 removed */}
              ${event.location.venue_name ? `<p class="text-sm font-medium">${event.location.venue_name}</p>` : ''} {/* text-blue-300 removed */}
              <div class="pt-2">
                <button onclick="window.location.href='/events/${event.id}'" class="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 rounded text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map.current!);
        markers.current.push(marker);
      }
    });

    // The fitBounds logic might need adjustment or be removed if clustering handles zoom/view well.
    // For now, commenting out to prevent conflicts with cluster zoom behavior.
    /*
    if (markers.current.length > 0 && map.current) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        pointsToRender.forEach(point => {
          bounds.extend(point.geometry.coordinates as [number, number]);
        });
        if (userLocation) {
          bounds.extend(userLocation);
        }
        if (!bounds.isEmpty()) {
          map.current.fitBounds(bounds, { padding: 75, maxZoom: 15 });
        }
      } catch (error) {
        console.error('Error fitting bounds to pointsToRender:', error);
      }
    }
    */

  }, [pointsToRender, mapLoaded, clusterer, userLocation]); // Rerun when pointsToRender changes

  // Helper to get geoJsonPoints, used for cluster marker sizing. Could be optimized.
  const geoJsonPoints = events
    .filter(event => event.location?.coordinates && event.location.coordinates.length === 2 && !isNaN(event.location.coordinates[0]) && !isNaN(event.location.coordinates[1]))
    .map(event => ({
      type: 'Feature' as const,
      properties: { /* ... */ },
      geometry: { type: 'Point' as const, coordinates: [event.location.coordinates[1], event.location.coordinates[0]] },
  }));


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
