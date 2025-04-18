
import { User, Settings, LogOut, Calendar, Bell, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const TopBarUserMenu = () => {
  const { user, signOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors gap-2 px-2"
        >
          {user ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user.user_metadata?.avatar || "https://i.pravatar.cc/100?img=1"} />
                <AvatarFallback>{user.user_metadata?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">
                {user.user_metadata?.name || "User"}
              </span>
            </div>
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user ? (
          <>
            <DropdownMenuLabel className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar || "https://i.pravatar.cc/100?img=1"} />
                <AvatarFallback>{user.user_metadata?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{user.user_metadata?.name || 'User'}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  My Events
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/create-event" className="cursor-pointer flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/notifications" className="cursor-pointer flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            
            {user.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link to="/admin" className="cursor-pointer flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => signOut()}
              className="text-destructive focus:text-destructive flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/auth" className="cursor-pointer">Sign in</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/auth?mode=signup" className="cursor-pointer">Create account</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
