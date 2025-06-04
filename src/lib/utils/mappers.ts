import { Event } from "@/lib/types";
import { Json } from "@/integrations/supabase/types";

/**
 * Maps database event format to the application Event interface
 */
export function mapDatabaseEventToEvent(dbEvent: any): Event {
  console.log('Mapping database event:', dbEvent);
  
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
      priceRange = [(pricingData as any).priceRange[0], (pricingData as any).priceRange[1]];
    }
    if (typeof (pricingData as any).currency === 'string') {
      currency = (pricingData as any).currency as string;
    }
  }

  // Handle coordinates properly - different formats from database
  let coordinates: [number, number] = [0, 0];
  
  if (dbEvent.coordinates) {
    console.log('Processing coordinates:', dbEvent.coordinates, typeof dbEvent.coordinates);
    
    // Handle PostgreSQL point format: "(x,y)" or {x: number, y: number}
    if (typeof dbEvent.coordinates === 'string') {
      // Parse string format "(x,y)"
      const match = dbEvent.coordinates.match(/\(([^,]+),([^)]+)\)/);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        if (!isNaN(lat) && !isNaN(lng)) {
          coordinates = [lat, lng];
        }
      }
    } else if (typeof dbEvent.coordinates === 'object' && dbEvent.coordinates !== null) {
      // Handle object format {x: number, y: number}
      if ('x' in dbEvent.coordinates && 'y' in dbEvent.coordinates) {
        const lat = parseFloat(dbEvent.coordinates.x);
        const lng = parseFloat(dbEvent.coordinates.y);
        if (!isNaN(lat) && !isNaN(lng)) {
          coordinates = [lat, lng];
        }
      }
      // Handle array format [lat, lng]
      else if (Array.isArray(dbEvent.coordinates) && dbEvent.coordinates.length >= 2) {
        const lat = parseFloat(dbEvent.coordinates[0]);
        const lng = parseFloat(dbEvent.coordinates[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          coordinates = [lat, lng];
        }
      }
    }
  }
  
  console.log('Final coordinates:', coordinates);

  const mappedEvent: Event = {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description || '',
    startDate: dbEvent.start_date,
    endDate: dbEvent.end_date || dbEvent.start_date,
    location: {
      coordinates,
      address: dbEvent.location || '',
      venue_name: dbEvent.venue_name || ''
    },
    category: dbEvent.category || [],
    tags: dbEvent.tags || [],
    culturalContext: dbEvent.cultural_context || '',
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
      id: dbEvent.created_by || '',
      type: 'user'
    },
    verification: {
      status: (dbEvent.verification_status || 'pending') as 'pending' | 'verified' | 'featured'
    },
    imageUrl: dbEvent.image_url || '',
    likes: dbEvent.likes || 0,
    attendees: dbEvent.attendees || 0
  };
  
  console.log('Mapped event:', mappedEvent);
  return mappedEvent;
}

/**
 * Maps mock event data to the application Event interface
 */
export function mapMockEventToEvent(mockEvent: any): Event {
  return {
    id: mockEvent.id,
    title: mockEvent.title,
    description: mockEvent.description || '',
    startDate: mockEvent.start_date,
    endDate: mockEvent.end_date || mockEvent.start_date,
    location: {
      coordinates: [0, 0],
      address: mockEvent.location || '',
      venue_name: mockEvent.venue_name || ''
    },
    category: mockEvent.category || [],
    tags: mockEvent.tags || [],
    accessibility: {
      languages: ['en'],
      wheelchairAccessible: false,
      familyFriendly: true
    },
    pricing: {
      isFree: true,
      priceRange: [0, 0],
      currency: 'USD'
    },
    creator: {
      id: mockEvent.created_by || '',
      type: 'user'
    },
    verification: {
      status: (mockEvent.verification_status || 'pending') as 'pending' | 'verified' | 'featured'
    },
    imageUrl: mockEvent.image_url || '',
    likes: mockEvent.likes || 0,
    attendees: mockEvent.attendees || 0
  };
}
