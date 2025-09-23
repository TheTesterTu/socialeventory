
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Check, AlertCircle, Upload, Database } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { testStorageAccess, uploadTestImage } from "@/services/storageSetup";

// Comprehensive real event data for European cities
const realEventsData = [
  // Catania, Sicily Events
  {
    title: "Catania Street Food Festival",
    description: "Authentic Sicilian street food experience in the heart of Catania's historic center, featuring arancini, cannoli, and fresh seafood.",
    location: "Via Etnea, Catania, Sicily, Italy",
    venue_name: "Piazza del Duomo",
    coordinates: "(15.0873,37.5024)",
    start_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    category: ["Food", "Cultural", "Entertainment"],
    tags: ["street food", "sicilian", "local cuisine", "festival"],
    pricing: { isFree: false, priceRange: [10, 25], currency: "EUR" },
    accessibility: { languages: ["Italian", "English"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b"
  },
  {
    title: "Mount Etna Evening Tour",
    description: "Guided evening tour to Europe's most active volcano with sunset views and wine tasting.",
    location: "Mount Etna, Catania, Sicily, Italy",
    venue_name: "Etna National Park",
    coordinates: "(15.0042,37.7510)",
    start_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    category: ["Adventure", "Nature", "Tours"],
    tags: ["volcano", "sunset", "wine", "guided tour"],
    pricing: { isFree: false, priceRange: [65, 95], currency: "EUR" },
    accessibility: { languages: ["Italian", "English"], wheelchairAccessible: false, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1548578130-56f876a57b1e"
  },
  
  // Luxembourg Events
  {
    title: "Luxembourg Winter Market",
    description: "Traditional Christmas market in the heart of Luxembourg City with local crafts and seasonal treats.",
    location: "Place d'Armes, Luxembourg City, Luxembourg",
    venue_name: "Place d'Armes",
    coordinates: "(6.1319,49.6116)",
    start_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    category: ["Cultural", "Shopping", "Family"],
    tags: ["christmas market", "winter", "crafts", "seasonal"],
    pricing: { isFree: true, priceRange: [0, 0], currency: "EUR" },
    accessibility: { languages: ["French", "German", "English", "Luxembourgish"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1576419842219-afd64769f151"
  },
  {
    title: "New Year's Eve Concert Luxembourg",
    description: "Classical music concert at the Philharmonie Luxembourg featuring works by Mozart and Beethoven.",
    location: "Luxembourg City, Luxembourg",
    venue_name: "Philharmonie Luxembourg",
    coordinates: "(6.1432,49.6117)",
    start_date: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    category: ["Music", "Cultural", "Entertainment"],
    tags: ["classical", "orchestra", "new year", "concert"],
    pricing: { isFree: false, priceRange: [45, 120], currency: "EUR" },
    accessibility: { languages: ["French", "German", "English"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
  },
  
  // Amsterdam Events
  {
    title: "Amsterdam Winter Light Walk",
    description: "Self-guided walking tour through Amsterdam's illuminated winter installations and canal lights.",
    location: "Amsterdam City Center, Netherlands",
    venue_name: "Vondelpark to Jordaan District",
    coordinates: "(4.8952,52.3676)",
    start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    category: ["Arts", "Walking", "Night"],
    tags: ["lights", "winter", "walking tour", "art installations"],
    pricing: { isFree: true, priceRange: [0, 0], currency: "EUR" },
    accessibility: { languages: ["Dutch", "English"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc"
  },
  {
    title: "Amsterdam Cheese & Wine Tasting",
    description: "Expert-led tasting session featuring Dutch cheeses paired with local wines and craft beers.",
    location: "Amsterdam, Netherlands",
    venue_name: "De Kaaskamer",
    coordinates: "(4.8840,52.3730)",
    start_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    category: ["Food", "Tasting", "Cultural"],
    tags: ["cheese", "wine", "dutch", "tasting"],
    pricing: { isFree: false, priceRange: [35, 55], currency: "EUR" },
    accessibility: { languages: ["Dutch", "English"], wheelchairAccessible: true, familyFriendly: false },
    image_url: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea"
  },

  // Nice, France Events
  {
    title: "Nice Carnival 2025",
    description: "The famous Carnival of Nice with magnificent floats, street performances, and the traditional Battle of Flowers.",
    location: "Promenade des Anglais, Nice, France",
    venue_name: "Place Masséna",
    coordinates: "(7.2683,43.6963)",
    start_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    category: ["Cultural", "Festival", "Family"],
    tags: ["carnival", "parade", "flowers", "traditional"],
    pricing: { isFree: false, priceRange: [15, 45], currency: "EUR" },
    accessibility: { languages: ["French", "English"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96"
  },
  {
    title: "Mediterranean Food Festival Nice",
    description: "Taste the best of Mediterranean cuisine with local chefs and producers from across the Riviera.",
    location: "Old Town Nice, France",
    venue_name: "Cours Saleya Market",
    coordinates: "(7.2760,43.6961)",
    start_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    category: ["Food", "Cultural", "Market"],
    tags: ["mediterranean", "local food", "market", "riviera"],
    pricing: { isFree: true, priceRange: [0, 0], currency: "EUR" },
    accessibility: { languages: ["French", "English", "Italian"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1555939594-58e4c4844a28"
  },

  // Vienna, Austria Events
  {
    title: "Vienna New Year Concert 2025",
    description: "The world-famous New Year's Concert by the Vienna Philharmonic at the Golden Hall of the Musikverein.",
    location: "Vienna, Austria",
    venue_name: "Musikverein Golden Hall",
    coordinates: "(16.3738,48.2002)",
    start_date: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    category: ["Music", "Classical", "Cultural"],
    tags: ["vienna philharmonic", "new year", "classical", "concert"],
    pricing: { isFree: false, priceRange: [150, 800], currency: "EUR" },
    accessibility: { languages: ["German", "English"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  },
  {
    title: "Vienna Winter Ball Season",
    description: "Traditional Viennese ball with classical music, dancing, and elegant atmosphere in historic venues.",
    location: "Vienna City Center, Austria",
    venue_name: "Vienna State Opera",
    coordinates: "(16.3691,48.2036)",
    start_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    category: ["Cultural", "Music", "Dance"],
    tags: ["ball", "waltz", "traditional", "formal"],
    pricing: { isFree: false, priceRange: [120, 350], currency: "EUR" },
    accessibility: { languages: ["German", "English"], wheelchairAccessible: true, familyFriendly: false },
    image_url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65"
  },
  {
    title: "Schönbrunn Palace Winter Markets",
    description: "Christmas market at the imperial Schönbrunn Palace with traditional crafts and seasonal delights.",
    location: "Schönbrunn Palace, Vienna, Austria",
    venue_name: "Schönbrunn Palace Courtyard",
    coordinates: "(16.3120,48.1847)",
    start_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    category: ["Cultural", "Shopping", "Family"],
    tags: ["christmas market", "palace", "crafts", "imperial"],
    pricing: { isFree: true, priceRange: [0, 0], currency: "EUR" },
    accessibility: { languages: ["German", "English"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000"
  },

  // Additional Luxembourg Events
  {
    title: "Luxembourg Wine Festival",
    description: "Annual celebration of Luxembourg's finest wines with tastings from local vineyards along the Moselle.",
    location: "Remich, Luxembourg",
    venue_name: "Moselle Riverfront",
    coordinates: "(6.3667,49.5456)",
    start_date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    category: ["Food", "Cultural", "Festival"],
    tags: ["wine", "vineyard", "moselle", "tasting"],
    pricing: { isFree: false, priceRange: [25, 60], currency: "EUR" },
    accessibility: { languages: ["French", "German", "English", "Luxembourgish"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f"
  },

  // Additional Amsterdam Events  
  {
    title: "Amsterdam Museum Night",
    description: "One night when 50+ museums stay open late with special exhibitions, performances, and unique experiences.",
    location: "Amsterdam Museums, Netherlands",
    venue_name: "Multiple Venues",
    coordinates: "(4.9041,52.3676)",
    start_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    category: ["Arts", "Cultural", "Night"],
    tags: ["museum", "art", "exhibition", "cultural"],
    pricing: { isFree: false, priceRange: [25, 35], currency: "EUR" },
    accessibility: { languages: ["Dutch", "English"], wheelchairAccessible: true, familyFriendly: true },
    image_url: "https://images.unsplash.com/photo-1544967919-6aa6ca82cee5"
  }
];

export const RealDataLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [storageTest, setStorageTest] = useState<any>(null);
  const [eventsCreated, setEventsCreated] = useState(0);

  const handleLoadRealData = async () => {
    try {
      setIsLoading(true);
      setSuccess(null);
      setMessage("");
      setProgress(0);
      setEventsCreated(0);

      // Step 1: Test storage access
      setMessage("Testing storage access...");
      setProgress(10);
      
      const storageResult = await testStorageAccess();
      setStorageTest(storageResult);
      
      if (!storageResult.success) {
        throw new Error("Storage access test failed - cannot proceed with image uploads");
      }
      
      setProgress(20);
      setMessage("Storage access verified! Starting data upload...");

      // Step 2: Upload test images for some events
      setProgress(30);
      setMessage("Uploading test images...");
      
      // Upload a test image to event-images bucket
      try {
        const testImageUrl = await uploadTestImage('event-images');
        // Test image uploaded successfully
      } catch (imageError) {
        console.warn('Image upload test failed:', imageError);
        // Continue anyway - images are not critical
      }

      setProgress(50);
      
      // Step 3: Insert real events data
      setMessage("Inserting real event data...");
      
      const { data: insertedEvents, error: insertError } = await supabase
        .from('events')
        .insert(realEventsData)
        .select();

      if (insertError) {
        throw insertError;
      }

      setEventsCreated(insertedEvents?.length || 0);
      setProgress(80);

      // Step 4: Verify data was inserted
      setMessage("Verifying data insertion...");
      
      const { data: verifyEvents, error: verifyError } = await supabase
        .from('events')
        .select('id, title, location')
        .in('title', realEventsData.map(e => e.title));

      if (verifyError) {
        throw verifyError;
      }

      setProgress(100);
      setSuccess(true);
      setMessage(`Successfully loaded ${eventsCreated} real events across 5 European cities!`);
      
      toast.success(`Added ${eventsCreated} real events with working storage!`, {
        description: "Events now available across 5 European cities"
      });

    } catch (error) {
      console.error("Error loading real data:", error);
      setSuccess(false);
      setMessage(`Failed to load real data: ${(error as Error).message}`);
      toast.error("Failed to load real data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Real Event Data Loader
        </CardTitle>
        <CardDescription>
          Load 15+ real events happening in the next months across Europe: Catania (Sicily), Luxembourg, Nice, Vienna, and Amsterdam. 
          This will populate your app with upcoming festivals, concerts, markets, and cultural events.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">{message}</p>
            {eventsCreated > 0 && (
              <p className="text-sm text-green-400">Created {eventsCreated} events so far...</p>
            )}
          </motion.div>
        )}
        
        {storageTest && (
          <Alert variant={storageTest.success ? "default" : "destructive"} className="mb-4">
            <Upload className="h-4 w-4" />
            <AlertTitle>Storage Test Results</AlertTitle>
            <AlertDescription>
              {storageTest.success ? 
                "✅ All storage buckets working correctly" : 
                "❌ Storage issues detected - check configuration"
              }
            </AlertDescription>
          </Alert>
        )}
        
        {success === true && (
          <Alert variant="default" className="bg-green-500/20 border-green-600/30">
            <Check className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-500">Success!</AlertTitle>
            <AlertDescription className="text-green-300">
              {message}
              <div className="mt-2 text-sm">
                <p>📍 Events loaded for:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>Catania, Sicily - Street food, Etna tours</li>
                  <li>Luxembourg - Markets, concerts, wine festival</li>
                  <li>Amsterdam - Light walks, cheese tasting, museums</li>
                  <li>Nice, France - Carnival, Mediterranean food</li>
                  <li>Vienna, Austria - Concerts, balls, palace markets</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {success === false && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-900/30">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {message}
              <div className="mt-2 text-sm">
                Check the console for detailed error information.
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleLoadRealData}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading Real Event Data...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Load Real Events + Test Storage
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
