import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Key, Facebook, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = () => {
    toast({
      title: "Coming Soon",
      description: "This feature is currently under development.",
    });
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-4xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full hover:scale-110 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        
        <Tabs defaultValue="api-keys" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <TabsTrigger value="api-keys" className="gap-2">
              <Key className="w-4 h-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="facebook" className="gap-2">
              <Facebook className="w-4 h-4" />
              Facebook Integration
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 space-y-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5" />
                <h2 className="text-xl font-semibold">API Keys</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Facebook API Key</label>
                  <Input type="password" placeholder="Enter your Facebook API key" />
                </div>
                <Button onClick={handleSave} className="w-full sm:w-auto">Save API Keys</Button>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="facebook">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 space-y-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Facebook className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Facebook Integration</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Connect your Facebook account to import and sync events.
              </p>
              <Button onClick={handleSave} className="w-full sm:w-auto">
                Connect Facebook
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="settings">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 space-y-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5" />
                <h2 className="text-xl font-semibold">General Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Default Location</label>
                  <Input placeholder="Enter default location" />
                </div>
                <Button onClick={handleSave} className="w-full sm:w-auto">Save Settings</Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;