
import { AppLayout } from "@/components/layout/AppLayout";
import { SEOHead } from "@/components/seo/SEOHead";
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { QuickCategories } from "@/components/home/QuickCategories";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { EventsNearYou } from "@/components/home/EventsNearYou";
import { FeaturedCreators } from "@/components/home/FeaturedCreators";
import { FeaturedBlog } from "@/components/home/FeaturedBlog";
import { PersonalizedEvents } from "@/components/home/PersonalizedEvents";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const Landing = () => {
  const { data: blogPosts = [] } = useBlogPosts();

  return (
    <AppLayout 
      pageTitle="SocialEventory - Discover Amazing Events"
      pageDescription="Find and share amazing events in your community. Connect with people who share your interests through SocialEventory."
    >
      <SEOHead 
        title="SocialEventory - Discover Amazing Events"
        description="Find and share amazing events in your community. Connect with people who share your interests through SocialEventory."
        type="website"
      />
      
      <div className="space-y-16">
        <HomeHero />
        <QuickCategories />
        <FeaturedEvents />
        <PersonalizedEvents />
        <UpcomingEvents />
        <EventsNearYou />
        <FeaturedCreators />
        <FeaturedBlog posts={blogPosts} />
      </div>
    </AppLayout>
  );
};

export default Landing;
