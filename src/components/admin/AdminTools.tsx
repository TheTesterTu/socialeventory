
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SampleEventsLoader } from "./SampleEventsLoader";
import { RealDataLoader } from "./RealDataLoader";
import { Settings, Database, Upload } from "lucide-react";

export const AdminTools = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Admin Tools</h2>
      </div>
      
      <Tabs defaultValue="real-data" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="real-data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Real Data Loader
          </TabsTrigger>
          <TabsTrigger value="sample-data" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Sample Events
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="real-data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real Event Data & Storage Test</CardTitle>
              <CardDescription>
                Load actual events from Catania, Luxembourg, and Amsterdam while testing storage functionality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RealDataLoader />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sample-data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sample Events</CardTitle>
              <CardDescription>
                Load sample events for testing purposes across multiple locations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SampleEventsLoader />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
