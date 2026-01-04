
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { QuickCategories } from "@/components/home/QuickCategories";
import { EventsNearYou } from "@/components/home/EventsNearYou";
import { TrustIndicators } from "@/components/home/TrustIndicators";
import { CallToAction } from "@/components/home/CallToAction";
import { SEOHead } from "@/components/seo/SEOHead";
import { QueryErrorBoundary } from "@/components/error/QueryErrorBoundary";
import { Suspense } from "react";
import { PageLoader } from "@/components/loading/PageLoader";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="SocialEventory - Discover Events Worth Attending"
        description="Find concerts, workshops, exhibitions and more. Connect with your community through SocialEventory."
      />
      
      <HomeHero />
      
      <QueryErrorBoundary>
        <Suspense fallback={<PageLoader message="Loading events..." />}>
          <TrustIndicators />
          <QuickCategories />
          <FeaturedEvents />
          <EventsNearYou />
          <CallToAction />
        </Suspense>
      </QueryErrorBoundary>
    </div>
  );
};

export default Index;
