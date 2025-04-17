
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
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
    { label: "Create Event", path: "/create-event", requiresAuth: true },
  ];

  return (
    <NavigationMenu className="ml-4">
      <NavigationMenuList>
        {navItems.map(item => {
          // Skip auth-required items for non-authenticated users
          if (item.requiresAuth && !user) return null;
          
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
      </NavigationMenuList>
    </NavigationMenu>
  );
};
