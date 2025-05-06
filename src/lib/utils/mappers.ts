
import { Event } from "@/lib/types";
import { Json } from "@/integrations/supabase/types";

/**
 * Maps database event format to the application Event interface
 */
export function mapDatabaseEventToEvent(dbEvent: any): Event {
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
    if (Array.isArray((pricingData as any).priceRange)) {
      priceRange = (pricingData as any).priceRange as [number, number];
    }
    if (typeof (pricingData as any).currency === 'string') {
      currency = (pricingData as any).currency as string;
    }
  }

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description || '',
    startDate: dbEvent.start_date,
    endDate: dbEvent.end_date || dbEvent.start_date,
    location: {
      coordinates: dbEvent.coordinates ? 
        [parseFloat(dbEvent.coordinates.x || 0), parseFloat(dbEvent.coordinates.y || 0)] : 
        [0, 0],
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
