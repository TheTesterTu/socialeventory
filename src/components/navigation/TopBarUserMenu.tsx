
import { User, Settings, LogOut, Plus, Heart, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const TopBarUserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return (
      <Button 
        variant="default"
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-medium border-2 border-primary shadow-md transition-all duration-200 hover:scale-105"
        onClick={() => navigate("/auth")}
      >
        Sign In
      </Button>
    );
  }

  const userInitials = user.email 
    ? user.email.substring(0, 2).toUpperCase()
    : "U";

  const userDisplayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full border-2 border-transparent hover:border-primary/20 transition-all duration-200"
        >
          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            <AvatarImage 
              src={user.user_metadata?.avatar_url} 
              alt={userDisplayName}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 bg-white border-2 border-gray-200 shadow-xl rounded-xl p-2" 
        align="end"
      >
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-semibold text-gray-900 leading-none">
              {userDisplayName}
            </p>
            <p className="text-xs text-gray-600 leading-none">
              {user.email}
            </p>
            <Badge variant="secondary" className="w-fit text-xs">
              Active Member
            </Badge>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="my-2 bg-gray-200" />
        
        <DropdownMenuItem 
          className="rounded-lg hover:bg-gray-50 transition-colors cursor-pointer p-3"
          onClick={() => navigate("/profile")}
        >
          <User className="mr-3 h-4 w-4 text-gray-600" />
          <span className="text-gray-900 font-medium">Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="rounded-lg hover:bg-gray-50 transition-colors cursor-pointer p-3"
          onClick={() => navigate("/create-event")}
        >
          <Plus className="mr-3 h-4 w-4 text-gray-600" />
          <span className="text-gray-900 font-medium">Create Event</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="rounded-lg hover:bg-gray-50 transition-colors cursor-pointer p-3"
          onClick={() => navigate("/profile")}
        >
          <Heart className="mr-3 h-4 w-4 text-gray-600" />
          <span className="text-gray-900 font-medium">Saved Events</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="rounded-lg hover:bg-gray-50 transition-colors cursor-pointer p-3"
          onClick={() => navigate("/profile")}
        >
          <Calendar className="mr-3 h-4 w-4 text-gray-600" />
          <span className="text-gray-900 font-medium">My Events</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="rounded-lg hover:bg-gray-50 transition-colors cursor-pointer p-3"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="mr-3 h-4 w-4 text-gray-600" />
          <span className="text-gray-900 font-medium">Notifications</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="my-2 bg-gray-200" />
        
        <DropdownMenuItem 
          className="rounded-lg hover:bg-gray-50 transition-colors cursor-pointer p-3"
          onClick={() => navigate("/settings")}
        >
          <Settings className="mr-3 h-4 w-4 text-gray-600" />
          <span className="text-gray-900 font-medium">Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="my-2 bg-gray-200" />
        
        <DropdownMenuItem 
          className="rounded-lg hover:bg-red-50 transition-colors cursor-pointer p-3 text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
