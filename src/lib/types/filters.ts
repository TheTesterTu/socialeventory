export interface EventFilters {
  accessibility?: {
    wheelchairAccessible?: boolean;
    familyFriendly?: boolean;
    languages?: string[];
  };
  pricing?: {
    isFree?: boolean;
    maxPrice?: number;
  };
  culturalContext?: string[];
  location?: {
    radius?: number;
    coordinates?: [number, number];
  };
}