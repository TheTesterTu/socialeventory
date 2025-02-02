import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Key, Facebook } from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Coming Soon",
      description: "This feature is currently under development.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="facebook">Facebook Integration</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-4">
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5" />
              <h2 className="text-xl font-semibold">API Keys</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Facebook API Key</label>
                <Input type="password" placeholder="Enter your Facebook API key" />
              </div>
              <Button onClick={handleSave}>Save API Keys</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="facebook" className="space-y-4">
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Facebook className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Facebook Integration</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Connect your Facebook account to import and sync events.
            </p>
            <Button onClick={handleSave}>
              Connect Facebook
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5" />
              <h2 className="text-xl font-semibold">General Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Default Location</label>
                <Input placeholder="Enter default location" />
              </div>
              <Button onClick={handleSave}>Save Settings</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;