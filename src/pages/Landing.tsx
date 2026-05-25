import { AppLayout } from "@/components/layout/AppLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { StructuredData } from "@/components/seo/StructuredData";
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { QuickCategories } from "@/components/home/QuickCategories";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { EventsNearYou } from "@/components/home/EventsNearYou";
import { FeaturedCreators } from "@/components/home/FeaturedCreators";
import { FeaturedBlog } from "@/components/home/FeaturedBlog";
import { PersonalizedEvents } from "@/components/home/PersonalizedEvents";
import { TrustIndicators } from "@/components/home/TrustIndicators";
import { CallToAction } from "@/components/home/CallToAction";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { APP_CONFIG } from "@/lib/constants";

const Landing = () => {
  const { data: blogPosts = [] } = useBlogPosts();

  const title = `${APP_CONFIG.name} — Discover real events, find your people`;
  const description = APP_CONFIG.description;

  return (
    <AppLayout pageTitle={title} pageDescription={description}>
      <SEOHead title={title} description={description} type="website" />

      <StructuredData
        type="WebSite"
        data={{
          name: APP_CONFIG.name,
          description,
          url: window.location.origin,
        }}
      />

      <ErrorBoundary>
        <div className="space-y-0">
          <HomeHero />
          <TrustIndicators />
          <QuickCategories />
          <FeaturedEvents />
          <PersonalizedEvents />
          <UpcomingEvents />
          <EventsNearYou />
          <FeaturedCreators />
          <FeaturedBlog posts={blogPosts} />
          <CallToAction />
        </div>
      </ErrorBoundary>
    </AppLayout>
  );
};

export default Landing;
