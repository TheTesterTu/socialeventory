
import { Helmet } from 'react-helmet-async';
import { Event } from '@/lib/types';

interface StructuredDataProps {
  type: 'Event' | 'Organization' | 'WebSite';
  data: any;
}

export const StructuredData = ({ type, data }: StructuredDataProps) => {
  const generateStructuredData = () => {
    const baseStructure = {
      "@context": "https://schema.org",
      "@type": type,
    };

    switch (type) {
      case 'Event':
        return {
          ...baseStructure,
          name: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          location: {
            "@type": "Place",
            name: data.location?.venue_name || "Venue",
            address: data.location?.address,
          },
          organizer: {
            "@type": "Organization",
            name: "SocialEventory",
          },
          image: data.imageUrl,
          offers: data.pricing?.isFree ? {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          } : undefined,
        };

      case 'WebSite':
        return {
          ...baseStructure,
          name: "SocialEventory",
          description: "Discover and share amazing events in your community",
          url: "https://socialeventory.com",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://socialeventory.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        };

      default:
        return baseStructure;
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </Helmet>
  );
};
