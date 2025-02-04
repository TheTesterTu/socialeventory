import { Home, Search, PlusCircle, MapPin, Settings, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", path: "/events" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: PlusCircle, label: "Create Event", path: "/create-event" },
  { icon: MapPin, label: "Near Me", path: "/nearby" },
  { icon: Settings, label: "Settings", path: "/settings" }
];

export const SideNav = () => {
  const location = useLocation();

  const NavContent = () => (
    <div className="flex flex-col gap-2 p-4">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        return (
          <Link key={item.path} to={item.path}>
            <motion.div whileHover={{ x: 4 }}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Side Navigation */}
      <motion.nav
        className="hidden md:flex flex-col w-64 border-r border-border/50 h-screen sticky top-0"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 border-b border-border/50">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/lovable-uploads/a6810b37-0f1f-4401-9970-901b029cf540.png"
              alt="Logo"
              className="w-8 h-8"
            />
            <span className="font-semibold text-lg">SocialEventory</span>
          </Link>
        </div>
        <NavContent />
      </motion.nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="mb-8">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/lovable-uploads/a6810b37-0f1f-4401-9970-901b029cf540.png"
                  alt="Logo"
                  className="w-8 h-8"
                />
                <span className="font-semibold text-lg">SocialEventory</span>
              </Link>
            </div>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};