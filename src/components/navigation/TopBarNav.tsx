
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

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
    <nav className="flex items-center space-x-1 ml-4">
      {navItems.map(item => {
        // Skip auth-required items for non-authenticated users
        if (item.requiresAuth && !user) return null;
        
        const isActive = location.pathname === item.path;
        
        return (
          <Link key={item.path} to={item.path}>
            <Button 
              variant={isActive ? "secondary" : "ghost"}
              className={`rounded-lg ${isActive ? 'bg-primary/10 text-primary' : ''}`}
            >
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};
