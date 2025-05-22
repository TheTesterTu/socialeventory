
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TopBarNotifications } from "./TopBarNotifications";
import { TopBarUserMenu } from "./TopBarUserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

export const TopBarActions = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="ml-auto flex items-center gap-2">
      {!isMobile && (
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
          asChild
        >
          <Link to="/search">
            <Search className="h-5 w-5" />
          </Link>
        </Button>
      )}

      {user && <TopBarNotifications />}
      <TopBarUserMenu />
    </div>
  );
};
