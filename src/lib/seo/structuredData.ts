const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

export function buildWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Link Charts",
    description: "Free URL shortener with powerful real-time analytics",
    url: APP_URL,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function buildAnalyticsPageSchema(
  slug: string,
  title: string,
  clicks: number,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Analytics for ${title}`,
    description: `${clicks} clicks tracked for ${title}`,
    url: `${APP_URL}/public-analytics/${slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Link Charts",
          item: APP_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Analytics",
          item: `${APP_URL}/public-analytics/${slug}`,
        },
      ],
    },
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Link Charts",
    url: APP_URL,
    logo: `${APP_URL}/og-default.png`,
    description:
      "Free URL shortener with powerful real-time analytics, click tracking, and geographic insights.",
    sameAs: [],
  };
}
