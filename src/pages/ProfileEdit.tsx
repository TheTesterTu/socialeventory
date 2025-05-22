
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ProfileEdit = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.name || "",
    username: user?.user_metadata?.username || "",
    bio: user?.user_metadata?.bio || "",
    location: user?.user_metadata?.location || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    
    setLoading(false);
  };

  if (!user) {
    return (
      <AppLayout 
        pageTitle="Edit Profile" 
        pageDescription="Update your profile information"
      >
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Loading profile...</h2>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      pageTitle="Edit Profile"
      pageDescription="Update your profile information"
    >
      <div className="container mx-auto py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                    <AvatarImage src={user?.user_metadata?.avatar || "https://i.pravatar.cc/150?img=12"} />
                    <AvatarFallback className="text-4xl">
                      {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full h-10 w-10 p-0"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-medium">{user?.user_metadata?.name || "User Profile"}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName"
                    name="fullName"
                    value={formData.fullName} 
                    onChange={handleChange}
                    placeholder="Enter your full name" 
                    className="bg-white/5 focus:bg-white/10 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username"
                    name="username"
                    value={formData.username} 
                    onChange={handleChange}
                    placeholder="Choose a username" 
                    className="bg-white/5 focus:bg-white/10 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    name="location"
                    value={formData.location} 
                    onChange={handleChange}
                    placeholder="City, Country" 
                    className="bg-white/5 focus:bg-white/10 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    name="bio"
                    value={formData.bio} 
                    onChange={handleChange}
                    placeholder="Tell us about yourself" 
                    className="min-h-[100px] bg-white/5 focus:bg-white/10 backdrop-blur-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button">Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default ProfileEdit;
