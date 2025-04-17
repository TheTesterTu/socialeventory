
import { useIsMobile } from "@/hooks/use-mobile";
import { TopBar } from "@/components/TopBar";
import { SideNav } from "@/components/navigation/SideNav";
import { BottomNav } from "@/components/navigation/BottomNav";
import { FloatingActions } from "@/components/navigation/FloatingActions";
import { Footer } from "./Footer";
import { PropsWithChildren, useEffect } from "react";
import { Helmet } from "react-helmet";

interface AppLayoutProps extends PropsWithChildren {
  hideTopBar?: boolean;
  hideFooter?: boolean;
  showTopBar?: boolean; // Added for backward compatibility
  pageTitle?: string;
  pageDescription?: string;
}

export const AppLayout = ({ 
  children, 
  hideTopBar = false,
  hideFooter = false,
  showTopBar,
  pageTitle = "SocialEventory",
  pageDescription = "Discover and share events with your community"
}: AppLayoutProps) => {
  const isMobile = useIsMobile();
  
  // For backward compatibility - if showTopBar is provided, it overrides hideTopBar
  useEffect(() => {
    if (showTopBar !== undefined) {
      hideTopBar = !showTopBar;
    }
  }, [showTopBar]);

  return (
    <div className="min-h-screen flex flex-col">
      {pageTitle && (
        <Helmet>
          <title>{pageTitle} | SocialEventory</title>
          <meta name="description" content={pageDescription} />
        </Helmet>
      )}
      
      {!hideTopBar && <TopBar />}
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>
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
