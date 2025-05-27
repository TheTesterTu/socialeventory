
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  requiresAuth?: boolean;
}

export const TopBarNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { label: "Events", path: "/events" },
    { label: "Search", path: "/search" },
    { label: "Near Me", path: "/nearby" },
    { label: "Blog", path: "/blog" },
    { label: "Organizers", path: "/organizers" },
  ];

  const isActive = (path: string) => {
    if (path === "/events") {
      return location.pathname === "/events" || location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const showCreateButton = user && (location.pathname === "/events" || location.pathname === "/");

  return (
    <NavigationMenu className="ml-4">
      <NavigationMenuList>
        {navItems.map(item => {
          const active = isActive(item.path);
          
          return (
            <NavigationMenuItem key={item.path}>
              <Link to={item.path}>
                <Button 
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "rounded-lg transition-all duration-200",
                    active 
                      ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                      : 'hover:bg-primary/5 hover:text-primary'
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            </NavigationMenuItem>
          );
        })}
        
        {showCreateButton && (
          <NavigationMenuItem>
            <Link to="/create-event">
              <Button 
                variant={location.pathname === "/create-event" ? "secondary" : "default"}
                className="rounded-lg gap-1 ml-2 gradient-primary"
                size="sm"
              >
                <PlusCircle className="h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
