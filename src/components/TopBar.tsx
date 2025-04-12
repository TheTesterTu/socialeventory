
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, Search, User, Settings, Bell, Plus, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Badge } from "./ui/badge";

export const TopBar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showActions, setShowActions] = useState(false);

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

  // Toggle action menu on mobile after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowActions(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

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
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex flex-col h-full">
              <Link to="/" className="flex items-center gap-2 py-4">
                <img
                  src="/lovable-uploads/a6810b37-0f1f-4401-9970-901b029cf540.png"
                  alt="SocialEventory"
                  className="h-8 w-8"
                />
                <span className="font-semibold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  SocialEventory
                </span>
              </Link>
              
              <div className="flex flex-col gap-1 py-4">
                <Link to="/events">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${location.pathname === '/events' ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    Home
                  </Button>
                </Link>
                <Link to="/search">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${location.pathname === '/search' ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    Search
                  </Button>
                </Link>
                <Link to="/nearby">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${location.pathname === '/nearby' ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    Near Me
                  </Button>
                </Link>
                <Link to="/create-event">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${location.pathname === '/create-event' ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    Create Event
                  </Button>
                </Link>
              </div>
              
              {user && (
                <div className="border-t border-border/50 pt-4 mt-2">
                  <h3 className="px-3 text-sm font-medium text-muted-foreground mb-2">Account</h3>
                  <Link to="/profile">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${location.pathname === '/profile' ? 'bg-primary/10 text-primary' : ''}`}
                    >
                      Profile
                    </Button>
                  </Link>
                  <Link to="/settings">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${location.pathname === '/settings' ? 'bg-primary/10 text-primary' : ''}`}
                    >
                      Settings
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </div>
              )}
              
              {!user && (
                <div className="border-t border-border/50 pt-4 mt-2">
                  <Link to="/auth">
                    <Button className="w-full">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center gap-2 mr-4">
          <motion.img
            src="/lovable-uploads/a6810b37-0f1f-4401-9970-901b029cf540.png"
            alt="SocialEventory"
            className="h-8 w-8"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 500, damping: 10 }}
          />
          <span className="hidden md:inline font-semibold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SocialEventory
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 ml-4">
          <Link to="/events">
            <Button variant="ghost" className={`rounded-lg ${location.pathname === '/events' ? 'bg-primary/10 text-primary' : ''}`}>
              Home
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
          <Link to="/create-event">
            <Button variant="ghost" className={`rounded-lg ${location.pathname === '/create-event' ? 'bg-primary/10 text-primary' : ''}`}>
              Create Event
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors relative"
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center bg-primary text-white">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                    Mark all as read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                  {[1, 2, 3].map((i) => (
                    <DropdownMenuItem key={i} className="p-3 cursor-pointer">
                      <div className="flex gap-3 items-start">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://i.pravatar.cc/100?img=${i+10}`} />
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            New event near you: Summer Festival
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {i === 1 ? "Just now" : i === 2 ? "2 hours ago" : "Yesterday"}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center">
                  <Link to="/settings" className="text-sm text-primary">View all notifications</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors gap-2 px-2"
              >
                {user ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.user_metadata?.avatar || "https://i.pravatar.cc/100?img=1"} />
                      <AvatarFallback>{user.user_metadata?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium">
                      {user.user_metadata?.name || "User"}
                    </span>
                  </div>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar || "https://i.pravatar.cc/100?img=1"} />
                      <AvatarFallback>{user.user_metadata?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
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
      
      {/* Mobile Quick Actions */}
      <AnimatePresence>
        {showActions && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-4 md:hidden z-40"
          >
            <div className="flex flex-col gap-3">
              <Button
                variant="default"
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-violet-500 to-purple-500"
                asChild
              >
                <Link to="/create-event">
                  <Plus className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                variant="default"
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500"
                asChild
              >
                <Link to="/nearby">
                  <MapPin className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
