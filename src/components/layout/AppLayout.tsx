
import { useIsMobile } from "@/hooks/use-mobile";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { FloatingActions } from "@/components/navigation/FloatingActions";
import { Footer } from "./Footer";
import { PropsWithChildren, useState, useEffect } from "react";

interface AppLayoutProps extends PropsWithChildren {
  hideTopBar?: boolean;
  hideFooter?: boolean;
  showTopBar?: boolean; // Added for backward compatibility
  pageTitle?: string;
  pageDescription?: string;
}

export const AppLayout = ({ 
  children, 
  hideTopBar: initialHideTopBar = false,
  hideFooter = false,
  showTopBar,
  pageTitle = "SocialEventory",
  pageDescription = "Discover and share events with your community"
}: AppLayoutProps) => {
  const isMobile = useIsMobile();
  const [hideTopBar, setHideTopBar] = useState(initialHideTopBar);
  
  // For backward compatibility - if showTopBar is provided, it overrides hideTopBar
  useEffect(() => {
    if (showTopBar !== undefined) {
      setHideTopBar(!showTopBar);
    } else {
      setHideTopBar(initialHideTopBar);
    }
  }, [showTopBar, initialHideTopBar]);

  // Add document title update effect
  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} | SocialEventory`;
      
      // Update meta description if available
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', pageDescription);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = pageDescription;
        document.head.appendChild(meta);
      }
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [pageTitle, pageDescription]);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideTopBar && <TopBar />}
      <main className="flex-1 pt-16 pb-20 md:pb-0 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
        {children}
      </main>
      {!hideFooter && <Footer />}
      {isMobile && (
        <>
          <BottomNav />
          <FloatingActions />
        </>
      )}
    </div>
  );
};
