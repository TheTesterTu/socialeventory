
import { Event } from "@/lib/types";
import { Json } from "@/integrations/supabase/types";

/**
 * Maps database event format to the application Event interface
 */
export function mapDatabaseEventToEvent(dbEvent: any): Event {
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
      languages: Array.isArray((dbEvent.accessibility as Json)?.languages) 
        ? ((dbEvent.accessibility as Json)?.languages as string[]) 
        : ['en'],
      wheelchairAccessible: Boolean((dbEvent.accessibility as Json)?.wheelchairAccessible),
      familyFriendly: Boolean((dbEvent.accessibility as Json)?.familyFriendly)
    },
    pricing: {
      isFree: Boolean((dbEvent.pricing as Json)?.isFree),
      priceRange: Array.isArray((dbEvent.pricing as Json)?.priceRange) 
        ? ((dbEvent.pricing as Json)?.priceRange as [number, number]) 
        : undefined,
      currency: (dbEvent.pricing as Json)?.currency as string
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
      venue_name: ''
    },
    category: mockEvent.category || [],
    tags: [],
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
      id: '',
      type: 'user'
    },
    verification: {
      status: (mockEvent.verification_status || 'pending') as 'pending' | 'verified' | 'featured'
    },
    imageUrl: mockEvent.image_url || '',
    likes: 0,
    attendees: 0
  };
}
