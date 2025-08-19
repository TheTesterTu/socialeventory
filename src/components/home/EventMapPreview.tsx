import React from 'react';
import { MapPin } from 'lucide-react';
import { Event } from '@/lib/types';

interface EventMapPreviewProps {
  events: Event[];
  className?: string;
}

const EventMapPreview = ({ events, className = '' }: EventMapPreviewProps) => {
  // Create a simple visual representation of events on a map
  const validEvents = events.filter(event => 
    event.location.coordinates && 
    !isNaN(event.location.coordinates[0]) && 
    !isNaN(event.location.coordinates[1])
  );

  return (
    <div className={`relative w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-border/20 overflow-hidden ${className}`}>
      {/* Map background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
          <pattern id="map-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#map-grid)" />
        </svg>
      </div>

      {/* Event markers */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {validEvents.slice(0, 8).map((event, index) => {
            // Distribute events in a grid-like pattern for visual appeal
            const row = Math.floor(index / 4);
            const col = index % 4;
            const x = 20 + col * 20; // 20%, 40%, 60%, 80%
            const y = 30 + row * 40; // 30%, 70%
            
            return (
              <div
                key={event.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className="relative">
                  <MapPin 
                    className="h-6 w-6 text-primary drop-shadow-lg transition-all duration-200 group-hover:scale-110" 
                    fill="currentColor"
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {event.title.length > 20 ? `${event.title.slice(0, 20)}...` : event.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium text-gray-700 shadow-lg">
        {validEvents.length} events
      </div>

      {/* Fallback when no events */}
      {validEvents.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No events with location data</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventMapPreview;