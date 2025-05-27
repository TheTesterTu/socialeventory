
import { Link } from "react-router-dom";
import { Heart, Github, Twitter, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Events", href: "/events" },
      { name: "Search", href: "/search" },
      { name: "Nearby", href: "/nearby" },
      { name: "Create Event", href: "/create-event" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
      { name: "Organizers", href: "/organizers" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/privacy" },
    ],
    social: [
      { name: "Twitter", href: "https://twitter.com", icon: Twitter },
      { name: "Instagram", href: "https://instagram.com", icon: Instagram },
      { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
      { name: "GitHub", href: "https://github.com", icon: Github },
    ],
  };

  return (
    <footer className="border-t border-border/50 bg-background/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/lovable-uploads/a6810b37-0f1f-4401-9970-901b029cf540.png"
                alt="SocialEventory"
                className="h-8 w-8"
              />
              <span className="font-semibold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SocialEventory
              </span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Connecting communities through unforgettable experiences. 
              Discover, create, and share events that matter to you.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} SocialEventory. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1 mt-2 sm:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500" /> for communities worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};
