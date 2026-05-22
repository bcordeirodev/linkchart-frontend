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
      "Link Charts is a free URL shortener with real-time analytics. Track link clicks by geography, device, browser and UTM campaign — no account required. Free accounts include a custom subdomain, QR code and public analytics page per link.",
    url: APP_URL,
    applicationCategory: "UtilityApplication",
    applicationSubCategory: "URL Shortener",
    operatingSystem: "Web",
    inLanguage: ["en", "pt-BR"],
    isAccessibleForFree: true,
    browserRequirements: "Requires JavaScript and a modern browser.",
    featureList: [
      "Free URL shortening with no account required",
      "Real-time click tracking and analytics dashboard",
      "Geographic analytics by country, region and city",
      "Device, browser and OS breakdown",
      "Custom slug for branded short links",
      "Free custom subdomain for branded short links (e.g. your-brand.linkcharts.com.br)",
      "Free QR code automatically generated for every link",
      "UTM campaign parameter tracking",
      "Public shareable analytics page per link",
      "Link expiration date and click limit controls",
      "Google Safe Browsing URL safety verification",
      "WhatsApp-compatible short links",
      "Audience quality scoring and bot detection",
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
        name: "Does Link Charts offer a free custom subdomain?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Free accounts can claim a custom subdomain (e.g. your-brand.linkcharts.com.br). All new short links use that branded base URL at no extra cost.",
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
      {
        "@type": "Question",
        name: "Is Link Charts a free Bitly alternative?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Link Charts is a free Bitly alternative with real-time click analytics, geographic data, device breakdown, UTM campaign tracking, custom slugs and free QR codes — all without a paid plan.",
        },
      },
      {
        "@type": "Question",
        name: "Does Link Charts work with WhatsApp?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Links shortened with Link Charts work on WhatsApp, Telegram, Instagram and all messaging platforms. The short URL redirects to your destination while tracking clicks automatically.",
        },
      },
      {
        "@type": "Question",
        name: "Can I track UTM campaign parameters?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Link Charts automatically detects and records UTM parameters — source, medium, campaign, term and content — attached to your short link. Campaign data appears in the analytics dashboard in real time.",
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
      "Link Charts is a free URL shortener with real-time analytics. Track link clicks by geography, device, browser and UTM campaign — no account required. Every link includes a free QR code and public analytics page.",
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
