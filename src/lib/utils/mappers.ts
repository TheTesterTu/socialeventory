
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
  if (!dbEvent || typeof dbEvent !== 'object') {
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
          // PostgreSQL POINT format: x=longitude, y=latitude
          const lng = safeNumber(dbEvent.coordinates.x);
          const lat = safeNumber(dbEvent.coordinates.y);
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
        // Silent coordinate parsing failure, use defaults
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

  // Handle image URL with better fallbacks and validation
  let imageUrl = safeString(dbEvent.image_url, '');
  
  // If no image or invalid image, use category-appropriate fallback
  if (!imageUrl || imageUrl.trim() === '') {
    const category = safeArray(dbEvent.category, ['Other'])[0]?.toLowerCase() || 'other';
    const categoryImages = {
      'music': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      'technology': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      'food': 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',
      'art': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
      'sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      'business': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'conference': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      'workshop': 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80',
      'meetup': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
      'entertainment': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'
    };
    imageUrl = categoryImages[category] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80';
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
    imageUrl,
    likes: safeNumber(dbEvent.likes, 0),
    attendees: safeNumber(dbEvent.attendees, 0)
  };

  return mappedEvent;
}
