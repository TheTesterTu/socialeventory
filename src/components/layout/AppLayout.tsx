
import { useIsMobile } from "@/hooks/use-mobile";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { FloatingActions } from "@/components/navigation/FloatingActions";
import { Footer } from "./Footer";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { PropsWithChildren, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface AppLayoutProps extends PropsWithChildren {
  hideTopBar?: boolean;
  hideFooter?: boolean;
  showTopBar?: boolean;
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
  
  useEffect(() => {
    if (showTopBar !== undefined) {
      setHideTopBar(!showTopBar);
    } else {
      setHideTopBar(initialHideTopBar);
    }
  }, [showTopBar, initialHideTopBar]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background">
        <OfflineBanner />
        
        {pageTitle && (
          <Helmet>
            <title>{pageTitle.includes('SocialEventory') ? pageTitle : `${pageTitle} | SocialEventory`}</title>
            <meta name="description" content={pageDescription} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="theme-color" content="#8B5CF6" />
          </Helmet>
        )}
        
        {!hideTopBar && <TopBar />}
        
        <main className={`flex-1 w-full ${!hideTopBar ? 'pt-16' : ''} ${isMobile ? 'pb-20' : ''}`}>
          <div className="min-h-full">
            {children}
          </div>
        </main>
        
        {!hideFooter && !isMobile && <Footer />}
        
        {isMobile && (
          <>
            <BottomNav />
            <FloatingActions />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};
