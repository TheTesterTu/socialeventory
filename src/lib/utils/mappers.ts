
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
 * Maps mock event format to the application Event interface
 */
export function mapMockEventToEvent(mockEvent: any): Event {
  console.log('Mapping mock event:', mockEvent);
  
  if (!mockEvent || typeof mockEvent !== 'object') {
    throw new Error('Invalid mock event data');
  }

  // Default coordinates for mock events
  const coordinates: [number, number] = [37.7749, -122.4194]; // San Francisco default

  const mappedEvent: Event = {
    id: safeString(mockEvent.id),
    title: safeString(mockEvent.title, 'Untitled Event'),
    description: safeString(mockEvent.description),
    startDate: safeString(mockEvent.start_date),
    endDate: safeString(mockEvent.end_date || mockEvent.start_date),
    location: {
      coordinates,
      address: safeString(mockEvent.location, 'Location not specified'),
      venue_name: safeString(mockEvent.venue_name)
    },
    category: safeArray(mockEvent.category, ['Other']),
    tags: safeArray(mockEvent.tags),
    accessibility: {
      languages: ['en'],
      wheelchairAccessible: false,
      familyFriendly: true
    },
    pricing: {
      isFree: true,
      currency: 'USD'
    },
    creator: {
      id: safeString(mockEvent.created_by || 'mock-creator'),
      type: 'user' as const
    },
    verification: {
      status: (mockEvent.verification_status as any) || 'verified'
    },
    imageUrl: safeString(mockEvent.image_url),
    likes: safeNumber(mockEvent.likes),
    attendees: safeNumber(mockEvent.attendees)
  };

  console.log('Final mapped mock event:', mappedEvent);
  return mappedEvent;
}

/**
 * Maps database event format to the application Event interface
 */
export function mapDatabaseEventToEvent(dbEvent: any): Event {
  console.log('Mapping database event:', dbEvent);
  
  if (!dbEvent || typeof dbEvent !== 'object') {
    throw new Error('Invalid database event data');
  }

  // Handle accessibility JSON data with proper type checking
  const accessibilityData = dbEvent.accessibility as Json;
  let languages: string[] = ['en'];
  let wheelchairAccessible = false;
  let familyFriendly = true;

  if (typeof accessibilityData === 'object' && accessibilityData !== null) {
    if (Array.isArray((accessibilityData as any).languages)) {
      languages = (accessibilityData as any).languages as string[];
    }
    wheelchairAccessible = Boolean((accessibilityData as any).wheelchairAccessible);
    familyFriendly = Boolean((accessibilityData as any).familyFriendly);
  }

  // Handle pricing JSON data with proper type checking
  const pricingData = dbEvent.pricing as Json;
  let isFree = true;
  let priceRange: [number, number] | undefined = undefined;
  let currency: string | undefined = undefined;

  if (typeof pricingData === 'object' && pricingData !== null) {
    isFree = Boolean((pricingData as any).isFree);
    if (Array.isArray((pricingData as any).priceRange) && (pricingData as any).priceRange.length >= 2) {
      priceRange = [
        safeNumber((pricingData as any).priceRange[0]),
        safeNumber((pricingData as any).priceRange[1])
      ];
    }
    if (typeof (pricingData as any).currency === 'string') {
      currency = (pricingData as any).currency as string;
    }
  }

  // Handle coordinates properly - different formats from database
  let coordinates: [number, number] = [0, 0];
  
  if (dbEvent.coordinates) {
    console.log('Processing coordinates:', dbEvent.coordinates, typeof dbEvent.coordinates);
    
    try {
      if (typeof dbEvent.coordinates === 'string') {
        const match = dbEvent.coordinates.match(/\(([^,]+),([^)]+)\)/);
        if (match) {
          const lat = safeNumber(match[1]);
          const lng = safeNumber(match[2]);
          if (lat !== 0 || lng !== 0) {
            coordinates = [lat, lng];
          }
        }
      } else if (typeof dbEvent.coordinates === 'object' && dbEvent.coordinates !== null) {
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
      console.warn('Error parsing coordinates:', error);
      coordinates = [0, 0];
    }
  }

  // Safely map all properties with proper validation
  const mappedEvent: Event = {
    id: safeString(dbEvent.id),
    title: safeString(dbEvent.title, 'Untitled Event'),
    description: safeString(dbEvent.description),
    startDate: safeString(dbEvent.start_date),
    endDate: safeString(dbEvent.end_date),
    location: {
      coordinates,
      address: safeString(dbEvent.location, 'Location not specified'),
      venue_name: safeString(dbEvent.venue_name)
    },
    category: safeArray(dbEvent.category, ['Other']),
    tags: safeArray(dbEvent.tags),
    accessibility: {
      languages,
      wheelchairAccessible,
      familyFriendly
    },
    pricing: {
      isFree,
      priceRange,
      currency: currency || 'USD'
    },
    creator: {
      id: safeString(dbEvent.created_by),
      type: 'user' as const
    },
    verification: {
      status: (dbEvent.verification_status as any) || 'pending'
    },
    imageUrl: safeString(dbEvent.image_url),
    likes: safeNumber(dbEvent.likes),
    attendees: safeNumber(dbEvent.attendees)
  };

  console.log('Final mapped event:', mappedEvent);
  return mappedEvent;
}
