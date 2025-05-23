
import { useIsMobile } from "@/hooks/use-mobile";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { FloatingActions } from "@/components/navigation/FloatingActions";
import { Footer } from "./Footer";
import { PropsWithChildren, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

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

  return (
    <div className="min-h-screen flex flex-col">
      {pageTitle && (
        <Helmet>
          <title>{pageTitle} | SocialEventory</title>
          <meta name="description" content={pageDescription} />
        </Helmet>
      )}
      {!hideTopBar && <TopBar />}
      <main className="flex-1 pt-16 pb-20 md:pb-0 w-full mx-auto">
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
