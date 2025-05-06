
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/shared/FileUpload";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Check, Bell, Shield, User, Key } from "lucide-react";

const Settings = () => {
  const { user, session } = useAuth();
  const [avatar, setAvatar] = useState<string | undefined>(user?.user_metadata?.avatar_url);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Reset the success indicator after 2 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);
  
  const handleUpdateAvatar = async (url: string) => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Update user metadata with new avatar URL
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: url }
      });
      
      if (error) throw error;
      
      setAvatar(url);
      toast.success("Avatar updated successfully");
      setSaveSuccess(true);
    } catch (error: any) {
      console.error("Error updating avatar:", error);
      toast.error(error.message || "Failed to update avatar");
    } finally {
      setSaving(false);
    }
  };
  
  if (!user || !session) {
    return (
      <AppLayout 
        pageTitle="Settings" 
        pageDescription="Manage your account settings and preferences"
      >
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Loading settings...</h2>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout 
      pageTitle="Settings" 
      pageDescription="Manage your account settings and preferences"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your account settings and preferences</p>
        
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="w-full sm:w-auto grid sm:inline-grid grid-cols-4 sm:grid-cols-4 h-auto">
            <TabsTrigger value="profile" className="flex items-center gap-2 py-3">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2 py-3">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 py-3">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2 py-3">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Update your profile picture. This will be visible to other users.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 border-2 border-border">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>
                      {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleUpdateAvatar.bind(null, "")}
                      disabled={!avatar || saving}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <FileUpload
                    onFileSelect={handleUpdateAvatar}
                    currentFile={avatar}
                    variant="button"
                    aspectRatio="1:1"
                    folder="avatars"
                    bucketName="profiles"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended: Square image, at least 400x400px.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <ProfileSettings user={user} />
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account credentials and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Email Address</h3>
                    <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                    <Button variant="outline" size="sm">Change Email</Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Password</h3>
                    <p className="text-sm text-muted-foreground mb-2">Last changed: Never</p>
                    <Button variant="outline" size="sm">Change Password</Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Deleting your account will remove all of your content and data.
                      This action cannot be undone.
                    </p>
                    <Button variant="destructive" size="sm">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how you receive notifications from SocialEventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Notification settings will be implemented soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Manage your privacy and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Privacy settings will be implemented soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
