
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { getAPIConfig } from '@/services/api-config';

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (address: string, coordinates: [number, number], venue?: string) => void;
}

export const LocationSearch = ({ value, onChange, onLocationSelect }: LocationSearchProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedValue] = useDebounce(value, 300);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch Mapbox token from API configs
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

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedValue || debouncedValue.length < 3 || !mapboxToken) return;
      
      setLoading(true);
      try {
        const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(debouncedValue)}.json?access_token=${mapboxToken}&types=address,place,poi&limit=5`;
        
        const response = await fetch(geocodingUrl);
        
        if (!response.ok) throw new Error('Geocoding request failed');
        
        const data = await response.json();
        setSuggestions(data.features || []);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue, mapboxToken]);

  const handleSelectLocation = (location: any) => {
    const address = location.place_name;
    const coordinates: [number, number] = [
      location.geometry.coordinates[1], // lat
      location.geometry.coordinates[0]  // lng
    ];
    
    // Extract venue name if it's a POI
    const venueName = location.properties?.name || 
                     (location.place_type.includes('poi') ? location.text : undefined);
    
    onChange(address);
    onLocationSelect(address, coordinates, venueName);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for an address or venue"
        className="pl-10"
        onFocus={() => value && suggestions.length > 0 && setShowDropdown(true)}
      />
      
      {loading && (
        <div className="absolute right-3 top-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-background rounded-md shadow-lg border border-border overflow-hidden">
          <ul className="py-1">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id || suggestion.place_name}
                className="px-4 py-2 hover:bg-accent cursor-pointer"
                onClick={() => handleSelectLocation(suggestion)}
              >
                <div className="font-medium">{suggestion.text}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {suggestion.place_name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
