import { getAPIConfig } from '@/services/api-config';

// Centralized geocoding service
export const geocodingService = {
  async searchPlaces(query: string, limit = 5): Promise<any[]> {
    try {
      const mapboxToken = await getAPIConfig('MAPBOX_TOKEN');
      if (!mapboxToken) {
        throw new Error('Mapbox token not configured');
      }

      const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&types=address,place,poi&limit=${limit}`;
      
      const response = await fetch(geocodingUrl);
      
      if (!response.ok) {
        throw new Error(`Geocoding request failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }
};