
import { motion } from "framer-motion";
import { Heart, Code, Twitter, Instagram, Facebook, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { name: "Twitter", icon: <Twitter size={18} />, url: "https://twitter.com/SocialEventory" },
    { name: "Instagram", icon: <Instagram size={18} />, url: "https://instagram.com/SocialEventory" },
    { name: "Facebook", icon: <Facebook size={18} />, url: "https://facebook.com/SocialEventory" },
    { name: "LinkedIn", icon: <Linkedin size={18} />, url: "https://linkedin.com/company/SocialEventory" },
    { name: "Email", icon: <Mail size={18} />, url: "mailto:info@socialeventory.com" },
  ];

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Blog", path: "/blog" },
        { name: "Organizers", path: "/organizers" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      title: "Discover",
      links: [
        { name: "Events", path: "/events" },
        { name: "Near Me", path: "/nearby" },
        { name: "Search", path: "/search" },
        { name: "Categories", path: "/categories" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "/help" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Cookie Policy", path: "/cookies" },
      ],
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-t border-border/50 bg-background/95 backdrop-blur-md mt-12"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/lovable-uploads/a6810b37-0f1f-4401-9970-901b029cf540.png"
                alt="SocialEventory"
                className="h-8 w-8"
              />
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                SocialEventory
              </h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Discover and share amazing events happening around you. Connect with like-minded people and never miss out on what matters to you.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/40 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} SocialEventory. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart size={14} className="mx-1 text-primary" />
            <span>by the SocialEventory Team</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
