export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  category: string;
  organizer: string;
  likes: number;
  attendees: number;
}

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Summer Night Festival",
    description: "Join us for an amazing night of music, art, and entertainment under the stars. Multiple stages, food vendors, and interactive art installations.",
    date: "2024-07-15T20:00:00",
    location: "Central Park, New York",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
    category: "Music",
    organizer: "City Events",
    likes: 156,
    attendees: 450
  },
  {
    id: "2",
    title: "Tech Conference 2024",
    description: "Annual technology conference featuring keynote speakers, workshops, and networking opportunities.",
    date: "2024-09-20T09:00:00",
    location: "Convention Center, San Francisco",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    category: "Technology",
    organizer: "TechHub",
    likes: 89,
    attendees: 300
  },
  {
    id: "3",
    title: "Mountain Trail Run",
    description: "Challenge yourself with this scenic trail run through beautiful mountain paths.",
    date: "2024-08-05T07:00:00",
    location: "Mountain Park, Colorado",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    category: "Sports",
    organizer: "Trail Runners Club",
    likes: 45,
    attendees: 120
  }
];

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};

export const categories = [
  "Music",
  "Technology",
  "Sports",
  "Arts",
  "Food",
  "Business",
  "Education",
  "Entertainment"
];