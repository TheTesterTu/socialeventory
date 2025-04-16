
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export const TopBarNotifications = () => {
  // This would typically come from a notification context/state
  const notificationCount = 3;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors relative"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center bg-primary text-white">
            {notificationCount}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            Mark all as read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-auto">
          {[1, 2, 3].map((i) => (
            <DropdownMenuItem key={i} className="p-3 cursor-pointer">
              <div className="flex gap-3 items-start">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://i.pravatar.cc/100?img=${i+10}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New event near you: Summer Festival
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {i === 1 ? "Just now" : i === 2 ? "2 hours ago" : "Yesterday"}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center">
          <Link to="/settings" className="text-sm text-primary">View all notifications</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
