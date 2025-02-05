
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Moon, Sun, Mail } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-2xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" placeholder="Your display name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" placeholder="Tell us about yourself" />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
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
              <Switch id="push" />
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
              <Switch id="email" />
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <Label htmlFor="theme">Dark Mode</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark mode
              </p>
            </div>
            <Switch id="theme" />
          </div>
        </div>

        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
        >
          Save Changes
        </Button>
      </div>
    </motion.div>
  );
};

export default Settings;
