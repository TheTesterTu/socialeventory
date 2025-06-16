
import { ProductionErrorBoundary } from "@/components/error/ProductionErrorBoundary";
import { Helmet } from "react-helmet-async";
import { Suspense } from "react";
import { PageLoader } from "@/components/loading/PageLoader";

interface ProductionLayoutProps {
  children: React.ReactNode;
}

export const ProductionLayout = ({ children }: ProductionLayoutProps) => {
  return (
    <ProductionErrorBoundary>
      <div data-error-boundary="true">
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#3b82f6" />
          <meta name="description" content="SocialEventory - Discover and share amazing events in your community" />
          <meta name="keywords" content="events, social, community, meetups, activities" />
          <meta name="author" content="SocialEventory" />
          
          {/* Security Headers via Meta Tags */}
          <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
          <meta httpEquiv="X-Frame-Options" content="DENY" />
          <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
          <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
          
          {/* Performance Hints */}
          <link rel="dns-prefetch" href="https://afdkepzhghdoeyjncnah.supabase.co" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          <title>SocialEventory - Discover Amazing Events</title>
        </Helmet>
        
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </div>
    </ProductionErrorBoundary>
  );
};
