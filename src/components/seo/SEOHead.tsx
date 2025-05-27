
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEOHead = ({ 
  title = "SocialEventory - Discover Amazing Events",
  description = "Find and share amazing events in your community. Connect with people who share your interests through SocialEventory.",
  image = "/og-image.png",
  url = "https://socialeventory.com",
  type = "website"
}: SEOHeadProps) => {
  const fullTitle = title.includes('SocialEventory') ? title : `${title} | SocialEventory`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="SocialEventory" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="SocialEventory" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
