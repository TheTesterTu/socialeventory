import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';
import { Event } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { Button } from './ui/button';
import { Search, Filter, Loader2, Layers, Locate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventMapProps {
  events: Event[];
  showFilters?: boolean;
  isInteractive?: boolean;
  className?: string;
  userLocation?: [number, number]; // [lng, lat]
}

// HSL helper to read theme tokens at runtime
const cssVar = (name: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? `hsl(${v})` : fallback;
};

const EventMap = ({
  events,
  showFilters = false,
  isInteractive = true,
  className = '',
  userLocation,
}: EventMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewVersion, setViewVersion] = useState(0); // bumps on move/zoom
  const { toast } = useToast();
  const navigate = useNavigate();
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const didInitialFitRef = useRef(false);

  // Initialize map (once per theme/interactivity change)
  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    try {
      const defaultCenter: [number, number] = userLocation || [10.5, 47.5]; // Central Europe

      setMapLoaded(false);

      const mapStyle = {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      };

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyle as any,
        zoom: userLocation ? 11 : 4,
        center: defaultCenter,
        interactive: isInteractive,
        attributionControl: false,
        cooperativeGestures: false,
      });

      map.current.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

      const onLoad = () => setMapLoaded(true);
      const bumpView = () => setViewVersion(v => v + 1);

      map.current.on('load', onLoad);
      map.current.on('moveend', bumpView);
      map.current.on('zoomend', bumpView);
      map.current.on('error', e => console.error('Map error:', e));

      if (isInteractive && map.current) {
        map.current.addControl(
          new maplibregl.NavigationControl({ showCompass: true, showZoom: true, visualizePitch: false }),
          'top-right'
        );
        map.current.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
          }),
          'top-right'
        );
      }

      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: 'Map Error',
        description: 'There was an error loading the map.',
        variant: 'destructive',
      });
    }
  }, [isInteractive]); // do not depend on userLocation -> avoid re-init on geolocation tick

  // User location marker
  useEffect(() => {
    if (!mapLoaded || !map.current || !userLocation) return;
    if (userMarkerRef.current) userMarkerRef.current.remove();

    const userEl = document.createElement('div');
    userEl.style.cssText = `
      width: 18px; height: 18px; background: #2563eb; border-radius: 50%;
      border: 3px solid white; box-shadow: 0 2px 10px rgba(37,99,235,.6); position: relative;
    `;
    const pulse = document.createElement('div');
    pulse.style.cssText = `
      position:absolute;inset:-6px;border-radius:50%;background:#2563eb;opacity:.25;
      animation: se-pulse 2s ease-out infinite;pointer-events:none;
    `;
    userEl.appendChild(pulse);

    userMarkerRef.current = new maplibregl.Marker(userEl).setLngLat(userLocation).addTo(map.current);
  }, [mapLoaded, userLocation]);

  // Build supercluster index (only when events change)
  const supercluster = useMemo(() => {
    const points = events
      .filter(e => {
        const c = e.location?.coordinates;
        if (!c) return false;
        const [lat, lng] = c;
        return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
      })
      .map(e => ({
        type: 'Feature' as const,
        properties: { cluster: false, eventId: e.id, event: e },
        geometry: { type: 'Point' as const, coordinates: [e.location.coordinates[1], e.location.coordinates[0]] },
      }));

    const sc = new Supercluster({ radius: 60, maxZoom: 16, minZoom: 0, minPoints: 2 });
    sc.load(points);
    return sc;
  }, [events]);

  // Compute visible clusters from current viewport
  const clusters = useMemo(() => {
    if (!mapLoaded || !map.current) return [];
    const b = map.current.getBounds();
    const z = Math.floor(map.current.getZoom());
    return supercluster.getClusters([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], z);
  }, [supercluster, mapLoaded, viewVersion]);

  // Render markers
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const primary = cssVar('--primary', 'hsl(16 90% 55%)');
    const muted = '#9CA3AF';

    clusters.forEach(c => {
      if (!map.current) return;
      const [lng, lat] = c.geometry.coordinates;
      const props: any = c.properties;

      if (props.cluster) {
        const count: number = props.point_count;
        const size = Math.min(70, 32 + Math.log2(count + 1) * 8);
        const el = document.createElement('div');
        el.style.cssText = `
          width:${size}px;height:${size}px;border-radius:9999px;
          background:${primary};color:white;display:flex;align-items:center;justify-content:center;
          font-weight:700;font-size:${Math.max(12, size / 3)}px;cursor:pointer;
          border:3px solid white;box-shadow:0 6px 24px hsl(var(--primary)/.45),0 0 0 6px hsl(var(--primary)/.18);
          transition: transform .2s ease;
        `;
        el.textContent = String(count);
        el.onmouseenter = () => (el.style.transform = 'scale(1.08)');
        el.onmouseleave = () => (el.style.transform = 'scale(1)');
        el.onclick = () => {
          if (!map.current) return;
          const expansion = Math.min(supercluster.getClusterExpansionZoom(props.cluster_id), 16);
          map.current.easeTo({ center: [lng, lat], zoom: expansion, duration: 600 });
        };
        const marker = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map.current);
        markersRef.current.push(marker);
        return;
      }

      // Single event pin
      const event: Event = props.event;
      const isPast = (event as any).isPast || new Date(event.endDate) < new Date();
      const color = isPast ? muted : primary;

      const el = document.createElement('div');
      el.style.cssText = `
        width:34px;height:42px;cursor:pointer;position:relative;
        filter: drop-shadow(0 6px 10px rgba(0,0,0,.25));
        transition: transform .15s ease;
      `;
      el.innerHTML = `
        <svg viewBox="0 0 32 40" width="34" height="42" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.2 0 0 7 0 15.6 0 27 16 40 16 40s16-13 16-24.4C32 7 24.8 0 16 0z"
                fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="16" cy="15" r="5" fill="white"/>
        </svg>
      `;
      el.onmouseenter = () => (el.style.transform = 'translateY(-3px) scale(1.05)');
      el.onmouseleave = () => (el.style.transform = 'translateY(0) scale(1)');

      const eventDate = new Date(event.startDate).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      });
      const safeTitle = (event.title || 'Untitled').replace(/</g, '&lt;');
      const safeAddr = (event.location?.address || '').replace(/</g, '&lt;');
      const img = event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=70';

      const popup = new maplibregl.Popup({ offset: 36, className: 'event-popup', closeButton: true, maxWidth: '300px' })
        .setHTML(`
          <div style="width:280px;font-family:inherit">
            <img src="${img}" alt="" style="width:100%;height:128px;object-fit:cover;border-radius:8px 8px 0 0" onerror="this.style.display='none'"/>
            <div style="padding:12px 14px 14px">
              <div style="font-weight:700;font-size:15px;line-height:1.3;color:#111;margin-bottom:6px">${safeTitle}</div>
              <div style="font-size:12px;color:#555;margin-bottom:2px">${eventDate}</div>
              <div style="font-size:12px;color:#777;margin-bottom:10px">${safeAddr}</div>
              <a href="/event/${event.id}" style="display:block;text-align:center;background:${color};color:white;padding:8px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none">
                ${isPast ? 'View past event' : 'View details'}
              </a>
            </div>
          </div>
        `);

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current);
      markersRef.current.push(marker);
    });
  }, [clusters, mapLoaded, supercluster]);

  // Initial fit-to-events (only once when events first arrive)
  useEffect(() => {
    if (!mapLoaded || !map.current || didInitialFitRef.current) return;
    if (!events.length) return;

    const bounds = new maplibregl.LngLatBounds();
    let added = 0;
    events.forEach(e => {
      const c = e.location?.coordinates;
      if (!c) return;
      const [lat, lng] = c;
      if (Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0)) {
        bounds.extend([lng, lat]);
        added++;
      }
    });
    if (userLocation) bounds.extend(userLocation);
    if (added > 0 && !bounds.isEmpty()) {
      map.current.fitBounds(bounds, { padding: 60, maxZoom: 12, duration: 800 });
      didInitialFitRef.current = true;
    }
  }, [events, mapLoaded, userLocation]);

  const handleResetView = useCallback(() => {
    if (!map.current || !events.length) return;
    const bounds = new maplibregl.LngLatBounds();
    events.forEach(e => {
      const c = e.location?.coordinates;
      if (!c) return;
      const [lat, lng] = c;
      if (Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0)) bounds.extend([lng, lat]);
    });
    if (!bounds.isEmpty()) map.current.fitBounds(bounds, { padding: 60, maxZoom: 12, duration: 700 });
  }, [events]);

  return (
    <div className={`relative w-full h-full min-h-[500px] ${className}`}>
      {!mapLoaded && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10 rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      )}

      {showFilters && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="shadow-lg backdrop-blur-md bg-background/85 hover:bg-background gap-2"
            onClick={() => navigate('/nearby')}
          >
            <Search className="h-4 w-4" />
            <span>Search this area</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="shadow-lg backdrop-blur-md bg-background/85 hover:bg-background"
            onClick={() => navigate('/search')}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      )}

      {events.length > 0 && (
        <div className="absolute bottom-6 left-4 z-10 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="shadow-lg backdrop-blur-md bg-background/85 hover:bg-background gap-2"
            onClick={handleResetView}
          >
            <Locate className="h-4 w-4" />
            <span>Fit all events</span>
          </Button>
          <div className="px-3 py-1.5 rounded-md bg-background/85 backdrop-blur-md shadow-lg text-xs font-medium text-foreground border border-border/50">
            <Layers className="h-3 w-3 inline mr-1.5" />
            {events.length} {events.length === 1 ? 'event' : 'events'}
          </div>
        </div>
      )}

      <div ref={mapContainer} className="absolute inset-0 rounded-xl overflow-hidden border border-border/30 shadow-xl" />

      <style>{`
        @keyframes se-pulse {
          0% { transform: scale(0.8); opacity: .5; }
          70% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .maplibregl-popup-content {
          padding: 0 !important; border-radius: 12px !important; overflow: hidden !important;
          box-shadow: 0 10px 40px rgba(0,0,0,.18) !important;
        }
        .maplibregl-popup-close-button {
          padding: 4px 8px !important; font-size: 18px !important; color: white !important;
          right: 4px !important; top: 4px !important; background: rgba(0,0,0,.35) !important;
          border-radius: 9999px !important; line-height: 1 !important;
        }
        .maplibregl-ctrl-group {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          box-shadow: 0 4px 14px rgba(0,0,0,.12) !important;
          border-radius: 10px !important; overflow: hidden;
        }
        .maplibregl-ctrl-group button {
          background-color: hsl(var(--card)) !important;
          color: hsl(var(--foreground)) !important;
        }
        .maplibregl-ctrl-group button:hover { background-color: hsl(var(--accent)) !important; }
      `}</style>
    </div>
  );
};

export default EventMap;
