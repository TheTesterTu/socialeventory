
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Search, MapPin, Calendar, User, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigation: NavItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Search", href: "/search", icon: Search },
    { name: "Nearby", href: "/nearby", icon: MapPin },
    { name: "Profile", href: "/profile", icon: User },
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
          {navigation.map((item) => {
            const active = isActive(item.href);
            const IconComponent = item.icon;
            
            return (
              <button
                key={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center py-3 text-xs transition-all duration-200 relative",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => navigate(item.href)}
                aria-label={item.name}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-xl p-2 transition-all duration-200 relative",
                    active && "bg-primary/10 scale-110"
                  )}
                >
                  <IconComponent size={20} />
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
