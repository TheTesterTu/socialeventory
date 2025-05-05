
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, Shield, User, Smartphone, Globe, Lock, LogOut, Trash2, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    language: "en",
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    eventReminders: true,
    messageNotifications: true,
    eventUpdates: true,
    followActivity: true,
    marketing: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    locationSharing: false,
    activityVisibility: "friends",
    dataUsage: true,
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    // Initialize profile with user data
    setProfile({
      fullName: user.user_metadata?.full_name || "",
      username: user.user_metadata?.username || "",
      email: user.email || "",
      bio: user.user_metadata?.bio || "",
      language: user.user_metadata?.language || "en",
    });
    
    setProfileImage(user.user_metadata?.avatar_url || null);
    
    // In a real app, fetch user profile data from Supabase
    fetchUserProfile();
  }, [user, navigate]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // This would get data from your profiles table in a real app
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        // Update notification settings from database
        if (data.notification_settings) {
          setNotifications({
            ...notifications,
            ...data.notification_settings,
          });
        }
        
        // Update privacy settings from database
        if (data.preferences) {
          setPrivacy({
            ...privacy,
            ...data.preferences,
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    
    // Create a preview
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e.target?.result) {
        setProfileImage(e.target.result as string);
      }
    };
    fileReader.readAsDataURL(file);
    
    // In a real app, upload to Supabase storage
    try {
      setUploadingImage(true);
      toast.info("Uploading image...");
      
      // This would upload to Supabase storage in a real app
      setTimeout(() => {
        setUploadingImage(false);
        toast.success("Profile image updated");
      }, 1500);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
      setUploadingImage(false);
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      toast.info("Saving profile...");
      
      // In a real app, update user metadata through Supabase auth
      // and profile data in the profiles table
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Profile saved successfully");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const saveNotifications = async () => {
    try {
      setLoading(true);
      
      // In a real app, update notification settings in the database
      // Example:
      // await supabase
      //   .from('profiles')
      //   .update({ notification_settings: notifications })
      //   .eq('id', user.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Notification preferences saved");
    } catch (error) {
      toast.error("Failed to save notification preferences");
    } finally {
      setLoading(false);
    }
  };

  const savePrivacy = async () => {
    try {
      setLoading(true);
      
      // In a real app, update privacy settings in the database
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Privacy settings saved");
    } catch (error) {
      toast.error("Failed to save privacy settings");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is not implemented in this demo");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      toast.success("Successfully signed out");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <AppLayout pageTitle="Settings" showTopBar={true}>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-2xl font-bold">Account Settings</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 sm:grid-cols-4 mb-4">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4 hidden sm:block" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4 hidden sm:block" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="gap-2">
                <Shield className="h-4 w-4 hidden sm:block" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2">
                <Lock className="h-4 w-4 hidden sm:block" />
                Account
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile information visible to other users
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          {profileImage ? (
                            <AvatarImage src={profileImage} alt="Profile" />
                          ) : (
                            <AvatarFallback>
                              {profile.fullName.charAt(0) || user?.email?.charAt(0) || "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploadingImage}
                        />
                        {uploadingImage && (
                          <div className="absolute inset-0 bg-background/50 rounded-full flex items-center justify-center">
                            <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Profile Picture</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click on the avatar to upload a new image (JPEG or PNG)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input 
                            id="fullName" 
                            value={profile.fullName}
                            onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input 
                            id="username" 
                            value={profile.username}
                            onChange={(e) => setProfile({...profile, username: e.target.value})}
                            placeholder="Choose a username"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profile.email}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">
                          Contact support to change your email address
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          value={profile.bio}
                          onChange={(e) => setProfile({...profile, bio: e.target.value})}
                          placeholder="Tell others about yourself"
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Preferred Language</Label>
                        <Select 
                          value={profile.language} 
                          onValueChange={(value) => setProfile({...profile, language: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="it">Italian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={saveProfile} 
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how and when you want to receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Notifications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications via email
                            </p>
                          </div>
                          <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, email: checked }))
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Event Reminders</Label>
                            <p className="text-sm text-muted-foreground">
                              Get email reminders about upcoming events
                            </p>
                          </div>
                          <Switch
                            checked={notifications.eventReminders}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, eventReminders: checked }))
                            }
                            disabled={!notifications.email}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Marketing Emails</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive promotional emails and offers
                            </p>
                          </div>
                          <Switch
                            checked={notifications.marketing}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, marketing: checked }))
                            }
                            disabled={!notifications.email}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium flex items-center">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Push Notifications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications on your device
                            </p>
                          </div>
                          <Switch
                            checked={notifications.push}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, push: checked }))
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Message Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when you receive new messages
                            </p>
                          </div>
                          <Switch
                            checked={notifications.messageNotifications}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, messageNotifications: checked }))
                            }
                            disabled={!notifications.push}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Event Updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified about changes to events you're attending
                            </p>
                          </div>
                          <Switch
                            checked={notifications.eventUpdates}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, eventUpdates: checked }))
                            }
                            disabled={!notifications.push}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Follow Activity</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified about activity from people you follow
                            </p>
                          </div>
                          <Switch
                            checked={notifications.followActivity}
                            onCheckedChange={(checked) =>
                              setNotifications((prev) => ({ ...prev, followActivity: checked }))
                            }
                            disabled={!notifications.push}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={saveNotifications} 
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Manage your privacy and data sharing preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="profileVisibility">Profile Visibility</Label>
                        <Select 
                          value={privacy.profileVisibility} 
                          onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}
                        >
                          <SelectTrigger id="profileVisibility">
                            <SelectValue placeholder="Who can see your profile" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public (Everyone)</SelectItem>
                            <SelectItem value="friends">Friends Only</SelectItem>
                            <SelectItem value="private">Private (Only you)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Location Sharing</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow the app to use your location for nearby events
                          </p>
                        </div>
                        <Switch
                          checked={privacy.locationSharing}
                          onCheckedChange={(checked) =>
                            setPrivacy((prev) => ({ ...prev, locationSharing: checked }))
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="activityVisibility">Activity Visibility</Label>
                        <Select 
                          value={privacy.activityVisibility} 
                          onValueChange={(value) => setPrivacy({...privacy, activityVisibility: value})}
                        >
                          <SelectTrigger id="activityVisibility">
                            <SelectValue placeholder="Who can see your activity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public (Everyone)</SelectItem>
                            <SelectItem value="friends">Friends Only</SelectItem>
                            <SelectItem value="private">Private (Only you)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Controls who can see events you're attending and your likes
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Data Usage</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow us to use your data to improve your experience
                          </p>
                        </div>
                        <Switch
                          checked={privacy.dataUsage}
                          onCheckedChange={(checked) =>
                            setPrivacy((prev) => ({ ...prev, dataUsage: checked }))
                          }
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={savePrivacy} 
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Settings
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Account Tab */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Management</CardTitle>
                    <CardDescription>
                      Manage your account settings and security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center p-4 border rounded-lg bg-muted/30">
                      <Globe className="h-8 w-8 text-primary/60 mr-4" />
                      <div>
                        <h3 className="font-medium">Account Type</h3>
                        <p className="text-sm text-muted-foreground">
                          Free Plan
                        </p>
                      </div>
                      <Button variant="outline" className="ml-auto" disabled>
                        Upgrade
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="password" 
                          type="password" 
                          value="••••••••••••"
                          disabled 
                        />
                        <Button variant="outline" disabled>Change</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password management not implemented in this demo
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium text-destructive mb-4">Danger Zone</h3>
                      <div className="space-y-4">
                        <Button 
                          variant="outline" 
                          className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive/10"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                        
                        <Button 
                          variant="destructive" 
                          className="w-full sm:w-auto"
                          onClick={handleDeleteAccount}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          This action is permanent and cannot be undone. All your data will be permanently deleted.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Settings;
