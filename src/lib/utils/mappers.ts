
import { Event } from "@/lib/types";
import { Json } from "@/integrations/supabase/types";

/**
 * Safely extracts string value from unknown data
 */
const safeString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
};

/**
 * Safely extracts number value from unknown data
 */
const safeNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return !isNaN(parsed) ? parsed : fallback;
  }
  return fallback;
};

/**
 * Safely extracts array from unknown data
 */
const safeArray = (value: unknown, fallback: any[] = []): any[] => {
  return Array.isArray(value) ? value : fallback;
};

/**
 * Maps database event format to the application Event interface
 */
export function mapDatabaseEventToEvent(dbEvent: any): Event {
  console.log('🔄 Mapping database event:', dbEvent);
  
  if (!dbEvent || typeof dbEvent !== 'object') {
    console.error('❌ Invalid database event data:', dbEvent);
    throw new Error('Invalid database event data');
  }

  // Handle coordinates with multiple fallback strategies
  let coordinates: [number, number] = [37.7749, -122.4194]; // Default to San Francisco
  
  if (dbEvent.coordinates) {
    try {
      if (typeof dbEvent.coordinates === 'string') {
        // Handle PostGIS point format like "(37.7749,-122.4194)"
        const match = dbEvent.coordinates.match(/\(([^,]+),([^)]+)\)/);
        if (match) {
          const lat = safeNumber(match[1]);
          const lng = safeNumber(match[2]);
          if (lat !== 0 || lng !== 0) {
            coordinates = [lat, lng];
          }
        }
      } else if (typeof dbEvent.coordinates === 'object' && dbEvent.coordinates !== null) {
        // Handle different coordinate object formats
        if ('x' in dbEvent.coordinates && 'y' in dbEvent.coordinates) {
          const lat = safeNumber(dbEvent.coordinates.x);
          const lng = safeNumber(dbEvent.coordinates.y);
          if (lat !== 0 || lng !== 0) {
            coordinates = [lat, lng];
          }
        } else if (Array.isArray(dbEvent.coordinates) && dbEvent.coordinates.length >= 2) {
          const lat = safeNumber(dbEvent.coordinates[0]);
          const lng = safeNumber(dbEvent.coordinates[1]);
          if (lat !== 0 || lng !== 0) {
            coordinates = [lat, lng];
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Error parsing coordinates, using default:', error);
    }
  }

  // Handle accessibility with proper fallbacks
  const accessibilityData = dbEvent.accessibility as Json;
  let accessibility = {
    languages: ['en'],
    wheelchairAccessible: false,
    familyFriendly: true
  };

  if (typeof accessibilityData === 'object' && accessibilityData !== null) {
    if (Array.isArray((accessibilityData as any).languages)) {
      accessibility.languages = (accessibilityData as any).languages;
    }
    if (typeof (accessibilityData as any).wheelchairAccessible === 'boolean') {
      accessibility.wheelchairAccessible = (accessibilityData as any).wheelchairAccessible;
    }
    if (typeof (accessibilityData as any).familyFriendly === 'boolean') {
      accessibility.familyFriendly = (accessibilityData as any).familyFriendly;
    }
  }

  // Handle pricing with proper fallbacks
  const pricingData = dbEvent.pricing as Json;
  let pricing = {
    isFree: true,
    currency: 'USD'
  };

  if (typeof pricingData === 'object' && pricingData !== null) {
    if (typeof (pricingData as any).isFree === 'boolean') {
      pricing.isFree = (pricingData as any).isFree;
    }
    if (typeof (pricingData as any).currency === 'string') {
      pricing.currency = (pricingData as any).currency;
    }
    if (Array.isArray((pricingData as any).priceRange) && (pricingData as any).priceRange.length >= 2) {
      (pricing as any).priceRange = [
        safeNumber((pricingData as any).priceRange[0]),
        safeNumber((pricingData as any).priceRange[1])
      ];
    }
  }

  const mappedEvent: Event = {
    id: safeString(dbEvent.id),
    title: safeString(dbEvent.title, 'Untitled Event'),
    description: safeString(dbEvent.description, 'No description available'),
    startDate: safeString(dbEvent.start_date),
    endDate: safeString(dbEvent.end_date),
    location: {
      coordinates,
      address: safeString(dbEvent.location, 'Location not specified'),
      venue_name: safeString(dbEvent.venue_name, '')
    },
    category: safeArray(dbEvent.category, ['Other']),
    tags: safeArray(dbEvent.tags, []),
    accessibility,
    pricing,
    creator: {
      id: safeString(dbEvent.created_by, 'unknown'),
      type: 'user' as const
    },
    verification: {
      status: (dbEvent.verification_status as any) || 'pending'
    },
    imageUrl: safeString(dbEvent.image_url, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'),
    likes: safeNumber(dbEvent.likes, 0),
    attendees: safeNumber(dbEvent.attendees, 0)
  };

  console.log('✅ Successfully mapped event:', mappedEvent.id, mappedEvent.title);
  return mappedEvent;
}
