
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Check, AlertCircle, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const SampleEventsLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const handleLoadEvents = async () => {
    try {
      setIsLoading(true);
      setSuccess(null);
      setMessage("");
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 10;
          if (next >= 90) {
            clearInterval(interval);
            return 90;
          }
          return next;
        });
      }, 300);

      // Call the Supabase Edge Function to load sample events
      const response = await fetch(
        "https://afdkepzhghdoeyjncnah.supabase.co/functions/v1/insert-sample-events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: "admin-ui",
            locations: ["sicily", "luxembourg", "amsterdam", "nice"]
          }),
        }
      );

      clearInterval(interval);
      setProgress(100);
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setMessage(`Successfully added ${data.count || "multiple"} sample events across Sicily, Luxembourg, Amsterdam, and Nice`);
        toast.success(`Added ${data.count || "multiple"} sample events to test the map and location features`);
      } else {
        throw new Error(data.message || "Failed to add sample events");
      }
    } catch (error) {
      console.error("Error loading sample events:", error);
      setSuccess(false);
      setMessage(error.message || "Failed to add sample events");
      toast.error("Error loading sample events");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Sample Events Loader
        </CardTitle>
        <CardDescription>
          Load realistic sample events for testing in Sicily, Luxembourg, Amsterdam, and Nice, France. 
          These events will populate your "Near You", "Upcoming", and trending sections.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">Loading sample events across multiple locations...</p>
          </motion.div>
        )}
        
        {success === true && (
          <Alert variant="default" className="bg-green-500/20 border-green-600/30">
            <Check className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-500">Success</AlertTitle>
            <AlertDescription className="text-green-300">
              {message}
            </AlertDescription>
          </Alert>
        )}
        
        {success === false && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-900/30">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleLoadEvents}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading Sample Events...
            </>
          ) : (
            "Load Sample Events for Testing"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
