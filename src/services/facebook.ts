
import { Event } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

const FB_API_VERSION = 'v18.0';
const FB_BASE_URL = `https://graph.facebook.com/${FB_API_VERSION}`;

export async function fetchFacebookEvents(location: string, radius: number = 1000): Promise<Event[]> {
  try {
    const response = await fetch(
      `${FB_BASE_URL}/search?type=event&q=${location}&distance=${radius}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`
    );
    const data = await response.json();
    
    return data.data.map((event: any) => ({
      id: uuidv4(), // Generate a valid UUID for each Facebook event
      title: event.name,
      description: event.description || '',
      startDate: event.start_time,
      endDate: event.end_time || event.start_time,
      location: {
        coordinates: [event.place?.location?.latitude || 0, event.place?.location?.longitude || 0],
        address: event.place?.location?.street || '',
        venue_name: event.place?.name || ''
      },
      category: ['Social'],
      tags: [],
      accessibility: {
        languages: ['en'],
        wheelchairAccessible: false,
        familyFriendly: true
      },
      pricing: {
        isFree: true,
        priceRange: undefined,
        currency: undefined
      },
      creator: {
        id: uuidv4(),
        type: 'user'
      },
      verification: {
        status: 'pending'
      },
      imageUrl: event.cover?.source || '/placeholder.svg',
      likes: 0,
      attendees: event.attending_count || 0
    }));
  } catch (error) {
    console.error('Error fetching Facebook events:', error);
    return [];
  }
}
