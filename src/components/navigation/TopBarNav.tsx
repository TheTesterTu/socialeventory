
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
    { label: "Home", path: "/events" },
    { label: "Search", path: "/search" },
    { label: "Near Me", path: "/nearby" },
    { label: "Blog", path: "/blog" },
    { label: "Organizers", path: "/organizers" },
  ];

  return (
    <NavigationMenu className="ml-4">
      <NavigationMenuList>
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavigationMenuItem key={item.path}>
              <Link to={item.path}>
                <Button 
                  variant={isActive ? "secondary" : "ghost"}
                  className={`rounded-lg ${isActive ? 'bg-primary/10 text-primary' : ''}`}
                >
                  {item.label}
                </Button>
              </Link>
            </NavigationMenuItem>
          );
        })}
        
        {user && (
          <NavigationMenuItem>
            <Link to="/create-event">
              <Button 
                variant={location.pathname === "/create-event" ? "secondary" : "default"}
                className="rounded-lg gap-1 ml-2"
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
