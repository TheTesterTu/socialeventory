
export interface Location {
  coordinates: [number, number];
  address: string;
  venue_name: string; // Changed from optional to required since it's used in multiple places
}

export interface AccessibilityInfo {
  languages: string[];
  wheelchairAccessible: boolean;
  familyFriendly: boolean;
}

export interface Pricing {
  isFree: boolean;
  priceRange?: [number, number];
  currency?: string;
}

export interface Creator {
  id: string;
  type: 'user' | 'venue' | 'organizer';
}

export interface Verification {
  status: 'pending' | 'verified' | 'featured';
  verifiedBy?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: Location;
  category: string[];
  tags: string[];
  culturalContext?: string;
  accessibility: AccessibilityInfo;
  pricing: Pricing;
  creator: Creator;
  verification: Verification;
  imageUrl: string;
  likes: number;
  attendees: number;
  isPast?: boolean; // Add flag for past events
}

export interface EventStory {
  eventId: string;
  content: {
    type: 'photo' | 'video' | 'text';
    media?: string;
    caption?: string;
  };
  duration: number;
  creator: string;
  timestamp: string;
}

export interface SearchParams {
  coordinates?: [number, number];
  radius?: number;
  dateRange?: [string, string];
  filters?: {
    categories?: string[];
    priceRange?: [number, number];
    accessibility?: Partial<AccessibilityInfo>;
  };
}
