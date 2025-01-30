import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Event } from '@/lib/types';

interface EventMapProps {
  events: Event[];
}

const EventMap = ({ events }: EventMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = React.useState<string>('');

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 12,
      center: [-73.935242, 40.730610], // Default to NYC
    });

    // Add markers for each event
    events.forEach(event => {
      const { coordinates } = event.location;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = '#8B5CF6';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';

      // Add popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${event.title}</h3>
            <p class="text-sm">${event.location.address}</p>
          </div>
        `);

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([coordinates[1], coordinates[0]])
        .setPopup(popup)
        .addTo(map.current);
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [events, mapboxToken]);

  return (
    <div className="w-full h-[600px] relative rounded-lg overflow-hidden">
      {!mapboxToken && (
        <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-10">
          <p className="text-center mb-2">Please enter your Mapbox public token to view the map</p>
          <input
            type="text"
            className="w-full max-w-md p-2 rounded border"
            placeholder="Enter Mapbox token"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default EventMap;