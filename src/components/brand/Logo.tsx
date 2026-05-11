
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "default" | "white" | "dark";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const Logo = ({ 
  variant = "default", 
  size = "md", 
  showText = true,
  className 
}: LogoProps) => {
  const sizeClasses = {
    sm: { icon: "w-7 h-7", text: "text-lg" },
    md: { icon: "w-9 h-9", text: "text-xl" },
    lg: { icon: "w-12 h-12", text: "text-2xl" },
  };

  const colorClasses = {
    default: "text-foreground",
    white: "text-white",
    dark: "text-secondary",
  };

  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center gap-2.5 font-display font-bold transition-opacity hover:opacity-80",
        colorClasses[variant],
        sizeClasses[size].text,
        className
      )}
    >
      {/* Logo Mark - Abstract "S" + Event Pin */}
      <div className={cn("relative", sizeClasses[size].icon)}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(12, 95%, 55%)" />
              <stop offset="100%" stopColor="hsl(12, 95%, 45%)" />
            </linearGradient>
          </defs>
          
          {/* Main circle */}
          <circle cx="20" cy="20" r="19" fill="url(#logoGradient)" />
          
          {/* Abstract "S" shape representing connection/events */}
          <path
            d="M14 14C14 14 17 12 21 12C25 12 28 14 28 17C28 20 24 21 20 22C16 23 12 24 12 27C12 30 15 32 19 32C23 32 26 30 26 30"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Dot accent */}
          <circle cx="28" cy="14" r="3" fill="white" />
        </svg>
      </div>

      {showText && (
        <span className="tracking-tight">
          Scene<span className="text-primary">Link</span>
        </span>
      )}
    </Link>
  );
};

// Icon-only version for favicons, etc.
export const LogoIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-8 h-8", className)}
  >
    <defs>
      <linearGradient id="logoGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(12, 95%, 55%)" />
        <stop offset="100%" stopColor="hsl(12, 95%, 45%)" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="19" fill="url(#logoGradientIcon)" />
    <path
      d="M14 14C14 14 17 12 21 12C25 12 28 14 28 17C28 20 24 21 20 22C16 23 12 24 12 27C12 30 15 32 19 32C23 32 26 30 26 30"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="28" cy="14" r="3" fill="white" />
  </svg>
);
