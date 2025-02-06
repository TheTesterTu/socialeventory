
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Key, MapPin, Mail, Bell, ArrowLeft, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { updateAPIConfig } from "@/services/api-config";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSaveAPIKey = async (key: string, value: string) => {
    setLoading(true);
    try {
      const success = await updateAPIConfig(key, value);
      if (!success) throw new Error("Failed to save API key");

      toast({
        title: "API Key Saved",
        description: "Your API key has been securely stored.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-background/95">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-5xl"
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary/80 to-secondary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>
        
        <Tabs defaultValue="api-keys" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <TabsTrigger value="api-keys" className="gap-2">
              <Key className="w-4 h-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="maps" className="gap-2">
              <MapPin className="w-4 h-4" />
              Maps Config
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6"
            >
              <div className="glass-panel p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-xl font-semibold">Service API Keys</h2>
                </div>
                <div className="grid gap-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium block">OpenAI API Key</label>
                    <div className="flex gap-2">
                      <Input 
                        type="password" 
                        placeholder="sk-..." 
                        className="flex-1"
                        onChange={(e) => {
                          localStorage.setItem('temp_openai_key', e.target.value);
                        }}
                      />
                      <Button 
                        onClick={() => {
                          const key = localStorage.getItem('temp_openai_key');
                          if (key) {
                            handleSaveAPIKey('openai_key', key);
                            localStorage.removeItem('temp_openai_key');
                          }
                        }}
                        disabled={loading}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-medium block">Stripe Secret Key</label>
                    <div className="flex gap-2">
                      <Input 
                        type="password" 
                        placeholder="sk_..." 
                        className="flex-1"
                        onChange={(e) => {
                          localStorage.setItem('temp_stripe_key', e.target.value);
                        }}
                      />
                      <Button 
                        onClick={() => {
                          const key = localStorage.getItem('temp_stripe_key');
                          if (key) {
                            handleSaveAPIKey('stripe_secret_key', key);
                            localStorage.removeItem('temp_stripe_key');
                          }
                        }}
                        disabled={loading}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="maps">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="glass-panel p-6 space-y-6"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Maps Configuration</h2>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium block">Mapbox Access Token</label>
                <div className="flex gap-2">
                  <Input 
                    type="password" 
                    placeholder="pk_..." 
                    className="flex-1"
                    onChange={(e) => {
                      localStorage.setItem('temp_mapbox_key', e.target.value);
                    }}
                  />
                  <Button 
                    onClick={() => {
                      const key = localStorage.getItem('temp_mapbox_key');
                      if (key) {
                        handleSaveAPIKey('mapbox_token', key);
                        localStorage.removeItem('temp_mapbox_key');
                      }
                    }}
                    disabled={loading}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="glass-panel p-6 space-y-6"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold">Email Configuration</h2>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium block">SendGrid API Key</label>
                <div className="flex gap-2">
                  <Input 
                    type="password" 
                    placeholder="SG..." 
                    className="flex-1"
                    onChange={(e) => {
                      localStorage.setItem('temp_sendgrid_key', e.target.value);
                    }}
                  />
                  <Button 
                    onClick={() => {
                      const key = localStorage.getItem('temp_sendgrid_key');
                      if (key) {
                        handleSaveAPIKey('sendgrid_key', key);
                        localStorage.removeItem('temp_sendgrid_key');
                      }
                    }}
                    disabled={loading}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="settings">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="glass-panel p-6 space-y-6"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold">General Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Default Location</label>
                  <Input placeholder="Enter default location" />
                </div>
                <Button onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "This feature is currently under development.",
                  });
                }} className="w-full sm:w-auto">
                  Save Settings
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Need help? Check out our <a href="#" className="text-primary hover:underline">documentation</a> or contact support.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
