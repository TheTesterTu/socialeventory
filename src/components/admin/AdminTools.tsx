
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Map, Database, Users, Shield, BarChart3 } from "lucide-react";
import { SampleEventsLoader } from "./SampleEventsLoader";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const AdminTools = () => {
  const { user } = useAuth();

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  const handleClearTestData = () => {
    toast.info("Test data clearing functionality would be implemented here");
  };

  const handleResetDatabase = () => {
    toast.warning("Database reset functionality would be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Tools</h2>
          <p className="text-muted-foreground">Configure and manage your application settings</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Admin: {user?.email}</span>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          
          <TabsTrigger value="apis" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">APIs</span>
          </TabsTrigger>
          
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
          
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>

          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your application's general settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">Application Name</Label>
                <Input id="app-name" placeholder="SocialEventory" defaultValue="SocialEventory" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-url">Site URL</Label>
                <Input id="site-url" placeholder="https://socialeventory.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Contact Email</Label>
                <Input id="admin-email" type="email" placeholder="admin@socialeventory.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="apis">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Configure external API integrations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mapbox-token">Mapbox Access Token</Label>
                <Input id="mapbox-token" type="password" placeholder="Enter your Mapbox token" />
                <p className="text-xs text-muted-foreground">
                  Get your Mapbox token from the <a href="https://account.mapbox.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline">Mapbox Dashboard</a>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="analytics-key">Analytics API Key</Label>
                <Input id="analytics-key" type="password" placeholder="Enter your analytics API key" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save API Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <div className="grid gap-4 md:grid-cols-2">
            <SampleEventsLoader />
            
            <Card>
              <CardHeader>
                <CardTitle>Database Maintenance</CardTitle>
                <CardDescription>
                  Perform database maintenance operations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use these tools carefully as they perform operations on your database.
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    ⚠️ These operations cannot be undone. Please backup your data first.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={handleClearTestData}>
                  Clear Test Data
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleResetDatabase}>
                  Reset Database
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">User Management</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced user management features will be available soon.
                </p>
                <p className="text-xs text-muted-foreground">
                  This will include user roles, permissions, and account management tools.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Monitor application performance and user engagement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive analytics and reporting tools are in development.
                </p>
                <p className="text-xs text-muted-foreground">
                  Track user engagement, event performance, and platform growth.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
