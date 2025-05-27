
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Search, MapPin, Newspaper, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems: NavItem[] = [
    {
      name: "Events",
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
  
  const isActive = (path: string) => {
    if (path === "/events") {
      return location.pathname === "/events" || location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 glass-navbar border-t border-border/20 safe-area-bottom bg-background/95 backdrop-blur-xl">
      <div className="mx-auto max-w-screen-sm">
        <div className="flex justify-between px-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center py-3 text-xs transition-all duration-200 relative",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => navigate(item.path)}
                aria-label={item.name}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-xl p-2 transition-all duration-200 relative",
                    active && "bg-primary/10 scale-110"
                  )}
                >
                  {item.icon}
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </div>
                <span className={cn(
                  "mt-1 text-[10px] font-medium transition-all duration-200",
                  active && "font-semibold"
                )}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
