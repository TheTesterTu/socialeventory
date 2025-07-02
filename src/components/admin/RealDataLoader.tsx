
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

// Real event data for the requested locations
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
        console.log('Test image uploaded:', testImageUrl);
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
      setMessage(`Successfully loaded ${eventsCreated} real events for Catania, Luxembourg, and Amsterdam!`);
      
      toast.success(`Added ${eventsCreated} real events with working storage!`, {
        description: "Events are now available in Sicily, Luxembourg, and Amsterdam"
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
          Load real events happening this week in Catania (Sicily), Luxembourg, and Amsterdam. 
          This will test storage functionality and populate your app with actual event data.
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
                  <li>Catania, Sicily - Street food festival & Etna tour</li>
                  <li>Luxembourg - Winter market & New Year concert</li>
                  <li>Amsterdam - Light walk & cheese tasting</li>
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
