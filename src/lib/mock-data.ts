
import { Event } from "./types";

export const categories = [
  "Music",
  "Technology",
  "Sports",
  "Arts",
  "Food",
  "Business",
  "Education",
  "Entertainment",
  "Cultural",
  "Nightlife",
  "Family",
  "Outdoor"
];

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Summer Night Festival",
    description: "Join us for an amazing night of music, art, and entertainment under the stars. Multiple stages, food vendors, and interactive art installations.",
    startDate: "2024-07-15T20:00:00",
    endDate: "2024-07-16T02:00:00",
    location: {
      coordinates: [40.7829, -73.9654],
      address: "Central Park, New York",
      venue_name: "Great Lawn"
    },
    category: ["Music", "Arts", "Entertainment"],
    tags: ["live music", "food", "art", "outdoor"],
    culturalContext: "Annual summer celebration of arts and music",
    accessibility: {
      languages: ["English"],
      wheelchairAccessible: true,
      familyFriendly: true
    },
    pricing: {
      isFree: false,
      priceRange: [25, 75],
      currency: "USD"
    },
    creator: {
      id: "org123",
      type: "organizer"
    },
    verification: {
      status: "verified",
      verifiedBy: "admin"
    },
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
    likes: 156,
    attendees: 450
  },
  {
    id: "2",
    title: "Tech Conference 2024",
    description: "Annual technology conference featuring keynote speakers, workshops, and networking opportunities.",
    startDate: "2024-09-20T09:00:00",
    endDate: "2024-09-20T18:00:00",
    location: {
      coordinates: [37.7749, -122.4194],
      address: "Convention Center, San Francisco",
      venue_name: "Main Hall"
    },
    category: ["Technology", "Business", "Education"],
    tags: ["conference", "networking", "workshops"],
    accessibility: {
      languages: ["English", "Spanish"],
      wheelchairAccessible: true,
      familyFriendly: false
    },
    pricing: {
      isFree: false,
      priceRange: [299, 599],
      currency: "USD"
    },
    creator: {
      id: "org456",
      type: "organizer"
    },
    verification: {
      status: "featured"
    },
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    likes: 89,
    attendees: 300
  },
  {
    id: "3",
    title: "Mountain Trail Run",
    description: "Challenge yourself with this scenic trail run through beautiful mountain paths.",
    startDate: "2024-08-05T07:00:00",
    endDate: "2024-08-05T12:00:00",
    location: {
      coordinates: [39.7392, -104.9903],
      address: "Mountain Park, Colorado",
      venue_name: "Trail Head Center"
    },
    category: ["Sports", "Outdoor"],
    tags: ["running", "nature", "competition"],
    accessibility: {
      languages: ["English"],
      wheelchairAccessible: false,
      familyFriendly: true
    },
    pricing: {
      isFree: false,
      priceRange: [30, 50],
      currency: "USD"
    },
    creator: {
      id: "org789",
      type: "organizer"
    },
    verification: {
      status: "verified"
    },
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    likes: 45,
    attendees: 120
  }
];

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};
