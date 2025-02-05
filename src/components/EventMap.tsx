
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Event } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface EventMapProps {
  events: Event[];
}

const EventMap = ({ events }: EventMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = React.useState<string>('');
  const { toast } = useToast();

  // Fetch Mapbox token from admin settings
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('setting_value')
          .eq('setting_key', 'mapbox_token')
          .single();

        if (error) throw error;
        
        if (data?.setting_value?.token) {
          setMapboxToken(data.setting_value.token);
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      }
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        zoom: 12,
        center: [-73.935242, 40.730610], // Default to NYC
      });

      // Add markers for each event
      events.forEach(event => {
        if (!event.location.coordinates) return;
        
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
            ${event.venue_name ? `<p class="text-sm font-medium">${event.venue_name}</p>` : ''}
          </div>
        `);

        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat([event.location.coordinates[1], event.location.coordinates[0]])
          .setPopup(popup)
          .addTo(map.current);
      });

      // Add navigation controls with modern styling
      map.current.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true,
        }),
        'top-right'
      );

      // Cleanup
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Map Error",
        description: "There was an error loading the map. Please try again later.",
        variant: "destructive"
      });
    }
  }, [events, mapboxToken, toast]);

  return (
    <div className="w-full h-[600px] relative rounded-xl overflow-hidden border border-border/40 shadow-lg">
      {!mapboxToken && (
        <div className="absolute inset-0 bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10">
          <p className="text-center mb-4 text-lg">Please enter your Mapbox public token to view the map</p>
          <input
            type="text"
            className="w-full max-w-md p-3 rounded-lg border bg-background/50 backdrop-blur-sm"
            placeholder="Enter Mapbox token"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <p className="text-sm text-muted-foreground mt-4">
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
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default EventMap;
