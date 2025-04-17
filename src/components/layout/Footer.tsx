
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Github, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/socialeventory", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com/socialeventory", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/socialeventory", label: "Instagram" },
    { icon: Github, href: "https://github.com/socialeventory", label: "GitHub" },
    { icon: Mail, href: "mailto:contact@socialeventory.com", label: "Email" },
  ];

  const footerLinks = [
    { section: "Company", links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Press Kit", href: "/press" },
    ]},
    { section: "Resources", links: [
      { label: "FAQ", href: "/faq" },
      { label: "Support", href: "/support" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Partners", href: "/partners" },
    ]},
    { section: "Legal", links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
      { label: "Licenses", href: "/licenses" },
    ]},
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-card border-t border-border mt-16"
    >
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="mb-6">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/lovable-uploads/a6810b37-0f1f-4401-9970-901b029cf540.png"
                alt="SocialEventory Logo"
                className="w-8 h-8"
              />
              <span className="font-semibold text-xl">SocialEventory</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Discover and share the best events in your area with SocialEventory, your social event discovery platform.
            </p>
            
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a 
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.section}>
              <h3 className="text-base font-medium mb-4">{section.section}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border mt-8 pt-8">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {currentYear} SocialEventory. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Link 
              to="/events"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-xs h-8"
              )}
            >
              Browse Events
            </Link>
            <Link
              to="/create-event"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-xs h-8"
              )}
            >
              Create Event
            </Link>
            <Link
              to="/organizers"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-xs h-8"
              )}
            >
              Organizers
            </Link>
          </div>
          
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-current" /> by SocialEventory Team
          </p>
        </div>
      </div>
    </motion.footer>
  );
};
