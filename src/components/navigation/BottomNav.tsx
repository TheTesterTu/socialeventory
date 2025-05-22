
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Search, MapPin, Newspaper, User } from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems: NavItem[] = [
    {
      name: "Home",
      path: "/events",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Search",
      path: "/search",
      icon: <Search className="h-5 w-5" />,
    },
    {
      name: "Nearby",
      path: "/nearby",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      name: "Blog",
      path: "/blog",
      icon: <Newspaper className="h-5 w-5" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];
  
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-screen-sm">
        <div className="flex justify-between">
          {navItems.map((item) => {
            const isActive = 
              (item.path === "/events" && location.pathname === "/events") || 
              (item.path !== "/events" && location.pathname.startsWith(item.path));
            
            return (
              <button
                key={item.path}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center py-2 text-xs transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => navigate(item.path)}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-lg p-1.5",
                    isActive && "bg-primary/10"
                  )}
                >
                  {item.icon}
                </div>
                <span className="mt-1 text-[10px]">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
