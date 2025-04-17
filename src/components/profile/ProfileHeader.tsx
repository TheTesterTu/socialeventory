
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, MapPin, Mail, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileHeaderProps {
  user: User | null;
  isLoading?: boolean;
}

export const ProfileHeader = ({ user, isLoading = false }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-r from-primary/20 to-accent/20" />
        <div className="px-8 pb-6 relative">
          <div className="flex flex-col md:flex-row gap-6 md:items-end">
            <div className="-mt-12">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
            <div className="flex-1 md:pb-2">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden mb-8">
      <div className="h-48 bg-gradient-to-r from-primary/20 to-accent/20" />
      <div className="px-8 pb-6 relative">
        <div className="flex flex-col md:flex-row gap-6 md:items-end">
          <div className="-mt-12">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={user?.user_metadata?.avatar || "https://i.pravatar.cc/150?img=12"} />
              <AvatarFallback>
                {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 md:pb-2">
            <h1 className="text-2xl font-bold">{user?.user_metadata?.name || "User Profile"}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {user?.email || "example@email.com"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {user?.user_metadata?.location || "Location not set"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Member since {new Date(user?.created_at || Date.now()).getFullYear()}
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
