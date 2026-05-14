const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";
const CONTACT_EMAIL = "linkcharts@gmail.com";

/**
 * Schema.org for the URL shortener as a software product.
 *
 * `WebApplication` is preferred over `SoftwareApplication` here because the
 * tool runs entirely in the browser with no install step. `featureList` is
 * picked up by Google's rich results pipeline; keep entries short and verb-led.
 */
export function buildWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Link Charts",
    description:
      "Free URL shortener with powerful real-time analytics, click tracking, and geographic insights.",
    url: APP_URL,
    applicationCategory: "UtilityApplication",
    applicationSubCategory: "URL Shortener",
    operatingSystem: "Web",
    inLanguage: ["en", "pt-BR"],
    isAccessibleForFree: true,
    browserRequirements: "Requires JavaScript and a modern browser.",
    featureList: [
      "Free URL shortening with no signup required",
      "Real-time click analytics",
      "Geographic insights (country and region)",
      "Device and browser breakdown",
      "Custom slug support",
      "Free QR code for every link",
      "UTM campaign tracking",
      "Public analytics page per link",
    ],
    screenshot: `${APP_URL}/og-default.png`,
    image: `${APP_URL}/og-default.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
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
    isPartOf: {
      "@type": "WebSite",
      name: "Link Charts",
      url: APP_URL,
    },
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

/**
 * FAQPage schema for /shorter — enables rich result FAQ dropdowns in Google SERPs.
 * Keep questions answer-led: short, factual, no markdown, plain text only.
 */
export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Link Charts free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Link Charts is completely free. You can shorten URLs and access real-time click analytics without paying anything or creating an account.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to sign up to shorten a URL?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No sign-up is required. Paste your long URL and get a shortened link instantly. Create a free account only if you want to manage multiple links and access advanced analytics.",
        },
      },
      {
        "@type": "Question",
        name: "What analytics does each shortened link provide?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every shortened link tracks total clicks, geographic data (country and region), device types (desktop, mobile, tablet), browsers, referrer sources, and UTM campaign parameters — all available in real time.",
        },
      },
      {
        "@type": "Question",
        name: "Can I customize the short link?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can set a custom slug for your shortened URL (e.g., linkcharts.com.br/r/my-campaign). Custom slugs require a free account.",
        },
      },
      {
        "@type": "Question",
        name: "How long do shortened links stay active?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Shortened links remain active indefinitely. You can also set an expiration date or click limit if you want a link to deactivate automatically.",
        },
      },
      {
        "@type": "Question",
        name: "Is it safe to use Link Charts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Every URL is checked against Google Safe Browsing before being shortened. Links flagged as malicious or phishing are rejected automatically.",
        },
      },
      {
        "@type": "Question",
        name: "Does each link get a QR code?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, a free QR code is generated automatically for every shortened link and can be downloaded directly from your dashboard.",
        },
      },
    ],
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
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: CONTACT_EMAIL,
        contactType: "customer support",
        availableLanguage: ["en", "pt-BR"],
      },
    ],
    sameAs: ["https://github.com/bcordeirodev"],
  };
}
