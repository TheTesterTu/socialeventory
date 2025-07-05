
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const SampleDataLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const sampleEvents = [
    {
      title: "Tech Meetup 2025",
      description: "Join us for an exciting tech meetup featuring the latest in AI and web development.",
      location: "San Francisco, CA",
      venue_name: "Tech Hub Downtown",
      start_date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
      end_date: new Date(Date.now() + 86400000 * 7 + 7200000).toISOString(), // +2 hours
      category: ["Technology", "Networking"],
      tags: ["ai", "web-dev", "networking"],
      coordinates: "(37.7749, -122.4194)",
      accessibility: {
        languages: ["en"],
        wheelchairAccessible: true,
        familyFriendly: false
      },
      pricing: {
        isFree: true,
        currency: "USD"
      },
      is_featured: true,
      image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Summer Music Festival",
      description: "A three-day outdoor music festival featuring local and international artists.",
      location: "Austin, TX",
      venue_name: "Riverside Park",
      start_date: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days from now
      end_date: new Date(Date.now() + 86400000 * 16).toISOString(), // +3 days
      category: ["Music", "Festival"],
      tags: ["music", "festival", "outdoor"],
      coordinates: "(30.2672, -97.7431)",
      accessibility: {
        languages: ["en", "es"],
        wheelchairAccessible: true,
        familyFriendly: true
      },
      pricing: {
        isFree: false,
        currency: "USD",
        priceRange: [75, 150]
      },
      is_featured: true,
      image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Art & Wine Evening",
      description: "An elegant evening combining fine art exhibition with wine tasting.",
      location: "New York, NY",
      venue_name: "Metropolitan Gallery",
      start_date: new Date(Date.now() + 86400000 * 21).toISOString(), // 21 days from now
      end_date: new Date(Date.now() + 86400000 * 21 + 14400000).toISOString(), // +4 hours
      category: ["Art", "Culture", "Food & Drink"],
      tags: ["art", "wine", "culture"],
      coordinates: "(40.7128, -74.0060)",
      accessibility: {
        languages: ["en"],
        wheelchairAccessible: true,
        familyFriendly: false
      },
      pricing: {
        isFree: false,
        currency: "USD",
        priceRange: [45, 85]
      },
      is_featured: false,
      image_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const loadSampleData = async () => {
    if (!user) {
      toast.error('Please sign in to load sample data');
      return;
    }

    setIsLoading(true);
    
    try {
      const eventsWithCreator = sampleEvents.map(event => ({
        ...event,
        created_by: user.id
      }));

      const { data, error } = await supabase
        .from('events')
        .insert(eventsWithCreator)
        .select();

      if (error) throw error;

      toast.success(`Successfully loaded ${data.length} sample events!`);
      console.log('✅ Sample events loaded:', data);
    } catch (error: any) {
      console.error('❌ Error loading sample data:', error);
      toast.error(`Failed to load sample data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllData = async () => {
    if (!user) {
      toast.error('Please sign in to clear data');
      return;
    }

    if (!confirm('Are you sure you want to delete ALL events? This cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('created_by', user.id);

      if (error) throw error;

      toast.success('All your events have been deleted');
    } catch (error: any) {
      console.error('❌ Error clearing data:', error);
      toast.error(`Failed to clear data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <Card className="mb-6 border-2 border-dashed border-purple-200 bg-purple-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Sample Data Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={loadSampleData}
            disabled={isLoading || !user}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Load Sample Events
          </Button>
          
          <Button
            onClick={clearAllData}
            disabled={isLoading || !user}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Events
          </Button>
        </div>
        
        {!user && (
          <p className="text-sm text-muted-foreground mt-3">
            Please sign in to manage sample data
          </p>
        )}
      </CardContent>
    </Card>
  );
};
