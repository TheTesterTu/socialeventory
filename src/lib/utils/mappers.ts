
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
  console.log('Mapping database event:', dbEvent);
  
  if (!dbEvent || typeof dbEvent !== 'object') {
    throw new Error('Invalid database event data');
  }

  // Handle accessibility JSON data with proper type checking
  const accessibilityData = dbEvent.accessibility as Json;
  let languages: string[] = ['en'];
  let wheelchairAccessible = false;
  let familyFriendly = true;

  // Safely access accessibility properties
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

  // Safely access pricing properties
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
      // Handle PostgreSQL point format: "(x,y)" or {x: number, y: number}
      if (typeof dbEvent.coordinates === 'string') {
        // Parse string format "(x,y)"
        const match = dbEvent.coordinates.match(/\(([^,]+),([^)]+)\)/);
        if (match) {
          const lat = safeNumber(match[1]);
          const lng = safeNumber(match[2]);
          if (lat !== 0 || lng !== 0) {
            coordinates = [lat, lng];
          }
        }
      } else if (typeof dbEvent.coordinates === 'object' && dbEvent.coordinates !== null) {
        // Handle object format {x: number, y: number}
        if ('x' in dbEvent.coordinates && 'y' in dbEvent.coordinates) {
          const lat = safeNumber(dbEvent.coordinates.x);
          const lng = safeNumber(dbEvent.coordinates.y);
          if (lat !== 0 || lng !== 0) {
            coordinates = [lat, lng];
          }
        }
        // Handle array format [lat, lng]
        else if (Array.isArray(dbEvent.coordinates) && dbEvent.coordinates.length >= 2) {
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
  
  console.log('Final coordinates:', coordinates);

  // Safely map all properties with proper validation
  const mappedEvent: Event = {
    id: safeString(dbEvent.id),
    title: safeString(dbEvent.title, 'Untitled Event'),
    description: safeString(dbEvent.description),
    startDate: safeString(dbEvent.start_date),
    endDate: safeString(dbEvent.end_date || dbEvent.start_date),
    location: {
      coordinates,
      address: safeString(dbEvent.location),
      venue_name: safeString(dbEvent.venue_name)
    },
    category: safeArray(dbEvent.category),
    tags: safeArray(dbEvent.tags),
    culturalContext: safeString(dbEvent.cultural_context),
    accessibility: {
      languages,
      wheelchairAccessible,
      familyFriendly
    },
    pricing: {
      isFree,
      priceRange,
      currency
    },
    creator: {
      id: safeString(dbEvent.created_by),
      type: 'user' as const
    },
    verification: {
      status: (dbEvent.verification_status === 'verified' || dbEvent.verification_status === 'featured') 
        ? dbEvent.verification_status as 'verified' | 'featured'
        : 'pending' as const
    },
    imageUrl: safeString(dbEvent.image_url),
    likes: safeNumber(dbEvent.likes),
    attendees: safeNumber(dbEvent.attendees)
  };
  
  // Validate required fields
  if (!mappedEvent.id) {
    throw new Error('Event must have a valid ID');
  }
  
  console.log('Mapped event:', mappedEvent);
  return mappedEvent;
}

/**
 * Maps mock event data to the application Event interface
 */
export function mapMockEventToEvent(mockEvent: any): Event {
  if (!mockEvent || typeof mockEvent !== 'object') {
    throw new Error('Invalid mock event data');
  }

  return {
    id: safeString(mockEvent.id),
    title: safeString(mockEvent.title, 'Untitled Event'),
    description: safeString(mockEvent.description),
    startDate: safeString(mockEvent.start_date),
    endDate: safeString(mockEvent.end_date || mockEvent.start_date),
    location: {
      coordinates: [0, 0] as [number, number],
      address: safeString(mockEvent.location),
      venue_name: safeString(mockEvent.venue_name)
    },
    category: safeArray(mockEvent.category),
    tags: safeArray(mockEvent.tags),
    accessibility: {
      languages: ['en'],
      wheelchairAccessible: false,
      familyFriendly: true
    },
    pricing: {
      isFree: true,
      priceRange: [0, 0] as [number, number],
      currency: 'USD'
    },
    creator: {
      id: safeString(mockEvent.created_by),
      type: 'user' as const
    },
    verification: {
      status: 'pending' as const
    },
    imageUrl: safeString(mockEvent.image_url),
    likes: safeNumber(mockEvent.likes),
    attendees: safeNumber(mockEvent.attendees)
  };
}
