
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Moon, Sun, Mail, User, Globe, Shield, LogOut } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

const Settings = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  const [profile, setProfile] = useState({
    displayName: user?.user_metadata?.name || "",
    bio: user?.user_metadata?.bio || "",
    email: user?.email || "",
  });

  const [preferences, setPreferences] = useState({
    pushNotifications: true,
    emailNotifications: true,
    darkMode: true,
    language: "English",
    radius: 10,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (key: string, value: boolean | number | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <div className={`pt-16 ${isMobile ? 'pb-20' : 'pb-8'} px-4 md:px-6 max-w-3xl mx-auto`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your experience on SocialEventory
          </p>
        </motion.div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{profile.displayName || "Your Profile"}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName"
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleProfileChange}
                    placeholder="Your display name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell us about yourself" 
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-6">
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      <Label htmlFor="push">Push Notifications</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications for important updates
                    </p>
                  </div>
                  <Switch 
                    id="push" 
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <Label htmlFor="email">Email Notifications</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <Switch 
                    id="email" 
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                  />
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-semibold mb-4">Appearance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      {preferences.darkMode ? (
                        <Moon className="w-4 h-4" />
                      ) : (
                        <Sun className="w-4 h-4" />
                      )}
                      <Label htmlFor="theme">Dark Mode</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark mode
                    </p>
                  </div>
                  <Switch 
                    id="theme" 
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
                  />
                </div>
                <Separator />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <Label htmlFor="language">Language</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Change the application language
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant={preferences.language === "English" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceChange('language', 'English')}
                    >
                      English
                    </Button>
                    <Button
                      variant={preferences.language === "Italiano" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceChange('language', 'Italiano')}
                    >
                      Italiano
                    </Button>
                    <Button
                      variant={preferences.language === "Español" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePreferenceChange('language', 'Español')}
                    >
                      Español
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    To change your email, please contact support
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacy & Security
              </h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Data Export
                </Button>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-xl space-y-4 border-destructive/30">
              <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
              <div className="space-y-4">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSave}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
          >
            Save Changes
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Settings;
