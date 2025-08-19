
import { useIsMobile } from "@/hooks/use-mobile";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { FloatingActions } from "@/components/navigation/FloatingActions";
import { Footer } from "./Footer";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { PropsWithChildren, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";
import { AdminQuickAccess } from "@/components/navigation/AdminQuickAccess";

interface OptimizedAppLayoutProps extends PropsWithChildren {
  hideTopBar?: boolean;
  hideFooter?: boolean;
  showTopBar?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  isLoading?: boolean;
}

export const OptimizedAppLayout = ({ 
  children, 
  hideTopBar: initialHideTopBar = false,
  hideFooter = false,
  showTopBar,
  pageTitle = "SocialEventory",
  pageDescription = "Discover and share events with your community",
  isLoading = false
}: OptimizedAppLayoutProps) => {
  const isMobile = useIsMobile();
  const [hideTopBar, setHideTopBar] = useState(initialHideTopBar);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  useEffect(() => {
    if (showTopBar !== undefined) {
      setHideTopBar(!showTopBar);
    } else {
      setHideTopBar(initialHideTopBar);
    }
  }, [showTopBar, initialHideTopBar]);

  useEffect(() => {
    // Simulate page load completion
    const timer = setTimeout(() => setIsPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !isPageLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background antialiased">
        <OfflineBanner />
        
        {pageTitle && (
          <Helmet>
            <title>{pageTitle.includes('SocialEventory') ? pageTitle : `${pageTitle} | SocialEventory`}</title>
            <meta name="description" content={pageDescription} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
            <meta name="theme-color" content="#8B5CF6" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          </Helmet>
        )}
        
        {!hideTopBar && <TopBar />}
        
        <main className={`flex-1 w-full ${!hideTopBar ? 'pt-16' : ''} ${isMobile ? 'pb-20 safe-area-bottom' : ''}`}>
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
        
        {/* Admin Quick Access - shows for all screen sizes */}
        <AdminQuickAccess />
      </div>
    </ErrorBoundary>
  );
};
