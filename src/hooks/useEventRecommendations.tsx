
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/lib/types';
import { mapDatabaseEventToEvent } from '@/lib/utils/mappers';
import { useMemo } from 'react';

interface RecommendationFactors {
  userInterests: string[];
  attendedEvents: string[];
  savedEvents: string[];
  location?: { lat: number; lng: number };
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
}

export const useEventRecommendations = (factors: RecommendationFactors) => {
  const { user } = useAuth();

  const { data: recommendations = [], isLoading, error } = useQuery({
    queryKey: ['event-recommendations', user?.id, factors],
    queryFn: async () => {
      if (!user) return [];

      // Get base events
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .gt('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(50);

      if (error) throw error;

      const mappedEvents = events?.map(mapDatabaseEventToEvent) || [];
      
      // Apply recommendation algorithm
      return calculateRecommendationScores(mappedEvents, factors);
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    recommendations,
    isLoading,
    error
  };
};

// Recommendation scoring algorithm
function calculateRecommendationScores(
  events: Event[], 
  factors: RecommendationFactors
): Event[] {
  const scoredEvents = events.map(event => {
    let score = 0;

    // Category matching (40% weight)
    const categoryMatch = event.category.some(cat => 
      factors.userInterests.some(interest => 
        interest.toLowerCase().includes(cat.toLowerCase()) ||
        cat.toLowerCase().includes(interest.toLowerCase())
      )
    );
    if (categoryMatch) score += 40;

    // Location proximity (30% weight)
    if (factors.location && event.location.coordinates) {
      const distance = calculateDistance(
        factors.location.lat,
        factors.location.lng,
        event.location.coordinates[0],
        event.location.coordinates[1]
      );
      
      // Closer events get higher scores (max 30 points for events within 5km)
      if (distance <= 5000) score += 30;
      else if (distance <= 15000) score += 20;
      else if (distance <= 30000) score += 10;
    }

    // Time preference (15% weight)
    if (factors.preferredTimeOfDay) {
      const eventHour = new Date(event.startDate).getHours();
      const matchesTimePreference = (
        (factors.preferredTimeOfDay === 'morning' && eventHour >= 6 && eventHour < 12) ||
        (factors.preferredTimeOfDay === 'afternoon' && eventHour >= 12 && eventHour < 18) ||
        (factors.preferredTimeOfDay === 'evening' && eventHour >= 18 && eventHour < 24)
      );
      if (matchesTimePreference) score += 15;
    }

    // Event popularity (10% weight)
    const popularityScore = Math.min(event.attendees / 10, 10);
    score += popularityScore;

    // Free events get slight boost (5% weight)
    if (event.pricing.isFree) score += 5;

    return { ...event, recommendationScore: score };
  });

  // Sort by score and return top recommendations
  return scoredEvents
    .sort((a, b) => (b.recommendationScore || 0) - (a.recommendationScore || 0))
    .slice(0, 10);
}

// Haversine formula for distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}
