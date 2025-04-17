
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User } from "@supabase/supabase-js";

interface ProfileSettingsProps {
  user: User | null;
}

export const ProfileSettings = ({ user }: ProfileSettingsProps) => {
  return (
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
            <Input defaultValue={user?.user_metadata?.name || ""} placeholder="Enter your full name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input defaultValue={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input defaultValue={user?.user_metadata?.location || ""} placeholder="City, Country" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Interests</label>
            <Input defaultValue="" placeholder="e.g. Tech, Music, Sports" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <Input defaultValue={user?.user_metadata?.bio || ""} placeholder="Tell us about yourself" />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};
