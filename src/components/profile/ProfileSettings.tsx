
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User } from "@supabase/supabase-js";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Loader2 } from "lucide-react";

interface ProfileSettingsProps {
  user: User | null;
}

export const ProfileSettings = ({ user }: ProfileSettingsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.name || "",
    email: user?.email || "",
    location: user?.user_metadata?.location || "",
    interests: user?.user_metadata?.interests || "",
    bio: user?.user_metadata?.bio || "",
    visibility: user?.user_metadata?.visibility || "public",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    
    setIsLoading(false);
    setIsSaved(true);
    
    // Reset saved indicator after 2 seconds
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                name="fullName"
                value={formData.fullName} 
                onChange={handleChange}
                placeholder="Enter your full name" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                value={formData.email} 
                disabled 
                name="email"
              />
              <p className="text-xs text-muted-foreground">
                Contact support to change your email address
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input 
                name="location"
                value={formData.location} 
                onChange={handleChange}
                placeholder="City, Country" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Interests</label>
              <Input 
                name="interests"
                value={formData.interests} 
                onChange={handleChange}
                placeholder="e.g. Tech, Music, Sports" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea 
              name="bio"
              value={formData.bio} 
              onChange={handleChange}
              placeholder="Tell us about yourself" 
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Visibility</label>
            <Select 
              value={formData.visibility} 
              onValueChange={(value) => handleSelectChange("visibility", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Everyone can see your profile</SelectItem>
                <SelectItem value="friends">Friends Only - Only connections can see</SelectItem>
                <SelectItem value="private">Private - Only you can see</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setFormData({
              fullName: user?.user_metadata?.name || "",
              email: user?.email || "",
              location: user?.user_metadata?.location || "",
              interests: user?.user_metadata?.interests || "",
              bio: user?.user_metadata?.bio || "",
              visibility: user?.user_metadata?.visibility || "public",
            })}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="min-w-[100px]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSaved ? (
              <Check className="h-4 w-4" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
