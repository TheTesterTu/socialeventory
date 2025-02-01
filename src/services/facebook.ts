import { Event } from "@/lib/types";

const FB_API_VERSION = 'v18.0';
const FB_BASE_URL = `https://graph.facebook.com/${FB_API_VERSION}`;

export async function fetchFacebookEvents(location: string, radius: number = 1000): Promise<Event[]> {
  try {
    const response = await fetch(
      `${FB_BASE_URL}/search?type=event&q=${location}&distance=${radius}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`
    );
    const data = await response.json();
    
    return data.data.map((event: any) => ({
      id: event.id,
      title: event.name,
      description: event.description || '',
      startDate: event.start_time,
      endDate: event.end_time || event.start_time,
      location: {
        coordinates: [event.place?.location?.latitude || 0, event.place?.location?.longitude || 0],
        address: event.place?.name || '',
        venue: event.place?.location?.street || ''
      },
      category: ['Social'],
      tags: [],
      culturalContext: '',
      accessibility: {
        languages: ['en'],
        wheelchairAccessible: false,
        familyFriendly: true
      },
      pricing: {
        isFree: true
      },
      creator: {
        id: '1',
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