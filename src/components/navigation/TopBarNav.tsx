
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
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/events") {
      return location.pathname === "/events" || location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const showCreateButton = user && (
    location.pathname === "/events" || 
    location.pathname === "/" ||
    location.pathname === "/profile"
  );

  return (
    <NavigationMenu className="ml-4 hidden lg:flex">
      <NavigationMenuList className="gap-1">
        {navItems.map(item => {
          const active = isActive(item.path);
          
          return (
            <NavigationMenuItem key={item.path}>
              <Link to={item.path}>
                <Button 
                  variant={active ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-lg transition-all duration-200 font-medium text-sm px-3 py-2 h-9",
                    active 
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-md' 
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
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
                variant={location.pathname === "/create-event" ? "default" : "default"}
                className="rounded-lg gap-2 ml-2 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg text-sm px-4 py-2 h-9"
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
