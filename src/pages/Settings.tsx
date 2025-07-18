
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AdminTools } from "@/components/admin/AdminTools";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser } from "@/utils/adminAccess";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const Settings = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <AppLayout pageTitle="Settings" pageDescription="Manage your account and application preferences">
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Link to="/profile/edit">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </Link>
        </div>
        
        <Separator className="my-4" />
        
        <Tabs defaultValue="preferences" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="preferences">App Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the app looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-sm text-muted-foreground">Show more content in less space</p>
                  </div>
                  <Switch id="compact-view" />
                </div>
                <Separator className="my-2 opacity-30" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="animations">Enable Animations</Label>
                    <p className="text-sm text-muted-foreground">Show animations throughout the app</p>
                  </div>
                  <Switch id="animations" defaultChecked />
                </div>
                <Separator className="my-2 opacity-30" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme</p>
                  </div>
                  <Switch id="dark-mode" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
            
            <Card className="glass-panel mt-6">
              <CardHeader>
                <CardTitle>Event Preferences</CardTitle>
                <CardDescription>
                  Customize how you interact with events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="default-calendar">Default Calendar View</Label>
                    <p className="text-sm text-muted-foreground">Choose the default calendar view</p>
                  </div>
                  <select id="default-calendar" className="h-10 rounded-md border border-input px-3 py-2 bg-background">
                    <option value="month">Month</option>
                    <option value="week">Week</option>
                    <option value="day">Day</option>
                  </select>
                </div>
                <Separator className="my-2 opacity-30" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="default-radius">Default Search Radius</Label>
                    <p className="text-sm text-muted-foreground">Set default search radius for nearby events</p>
                  </div>
                  <select id="default-radius" className="h-10 rounded-md border border-input px-3 py-2 bg-background">
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="20">20 km</option>
                    <option value="50">50 km</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Event Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Control what you want to be notified about
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="event-invites">Event Invites</Label>
                    <p className="text-sm text-muted-foreground">When someone invites you to an event</p>
                  </div>
                  <Switch id="event-invites" defaultChecked />
                </div>
                <Separator className="my-2 opacity-30" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="event-updates">Event Updates</Label>
                    <p className="text-sm text-muted-foreground">When an event you're interested in is updated</p>
                  </div>
                  <Switch id="event-updates" defaultChecked />
                </div>
                <Separator className="my-2 opacity-30" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-events">New Events Nearby</Label>
                    <p className="text-sm text-muted-foreground">When new events are added in your area</p>
                  </div>
                  <Switch id="new-events" />
                </div>
                <Separator className="my-2 opacity-30" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <Separator className="my-2 opacity-30" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Notification Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Update your account password and security options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  <Button variant="outline">Setup 2FA</Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Change Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {isAdminUser(user) && (
          <div className="pt-6 border-t border-border/40">
            <AdminTools />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Settings;
