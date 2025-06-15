
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  author?: string;
  canonical?: string;
}

export const SEOHead = ({ 
  title = "SocialEventory - Discover Amazing Events",
  description = "Find and share amazing events in your community. Connect with people who share your interests through SocialEventory.",
  image = "/og-image.png",
  url = "https://socialeventory.com",
  type = "website",
  keywords = "events, social, community, discover, share, meetups, activities",
  author = "SocialEventory Team",
  canonical
}: SEOHeadProps) => {
  const fullTitle = title.includes('SocialEventory') ? title : `${title} | SocialEventory`;
  const fullUrl = url.startsWith('http') ? url : `https://socialeventory.com${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `https://socialeventory.com${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="SocialEventory" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta property="twitter:image:alt" content={title} />
      
      {/* Additional Meta Tags for better SEO */}
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="SocialEventory" />
      
      {/* Preload critical resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://afdkepzhghdoeyjncnah.supabase.co" />
      
      {/* Structured Data will be handled by StructuredData component */}
    </Helmet>
  );
};
