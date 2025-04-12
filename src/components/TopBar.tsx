
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, Search, User, Settings, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export const TopBar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "border-b border-border/50 bg-background/90 backdrop-blur-xl shadow-sm" 
          : "bg-background/50 backdrop-blur-sm"
      }`}
    >
      <div className="flex h-16 items-center px-4 md:px-6 mx-auto max-w-7xl">
        <Link to="/" className="flex items-center gap-2 mr-4">
          <img
            src="/lovable-uploads/a6810b37-0f1f-4401-9970-901b029cf540.png"
            alt="SocialEventory"
            className="h-8 w-8 logo-animation"
          />
          <span className="hidden md:inline font-semibold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SocialEventory
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 ml-4">
          <Link to="/events">
            <Button variant="ghost" className={`rounded-lg ${location.pathname === '/events' ? 'bg-primary/10 text-primary' : ''}`}>
              Discover
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="ghost" className={`rounded-lg ${location.pathname === '/search' ? 'bg-primary/10 text-primary' : ''}`}>
              Search
            </Button>
          </Link>
          <Link to="/nearby">
            <Button variant="ghost" className={`rounded-lg ${location.pathname === '/nearby' ? 'bg-primary/10 text-primary' : ''}`}>
              Near Me
            </Button>
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
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

          {user && (
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Bell className="h-5 w-5" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel w-56">
              {user ? (
                <>
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.user_metadata?.name || 'User'}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/create-event" className="cursor-pointer">Create Event</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">Settings</Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="text-destructive focus:text-destructive"
                  >
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/auth" className="cursor-pointer">Sign in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/auth?mode=signup" className="cursor-pointer">Create account</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
};
