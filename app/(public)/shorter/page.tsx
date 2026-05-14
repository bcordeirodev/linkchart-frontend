import type { Metadata } from "next";
import ShorterClientPage from "./ShorterClientPage";
import {
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

export const metadata: Metadata = {
  title: "Free URL Shortener — No Sign-up Required",
  description:
    "Shorten any URL for free in seconds. Get real-time click analytics, geographic data, and custom slugs — no account needed.",
  alternates: {
    canonical: `${appUrl}/shorter`,
    languages: {
      en: `${appUrl}/shorter`,
      "pt-BR": `${appUrl}/shorter`,
      "x-default": `${appUrl}/shorter`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Link Charts — Free URL Shortener with Analytics",
    description:
      "Shorten any URL for free in seconds. Get real-time click analytics, geographic data, and custom slugs — no account needed.",
    type: "website",
    url: `${appUrl}/shorter`,
    images: [
      {
        url: `${appUrl}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "Link Charts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Link Charts — Free URL Shortener with Analytics",
    description:
      "Shorten any URL for free in seconds. Get real-time click analytics, geographic data, and custom slugs — no account needed.",
    images: [`${appUrl}/og-default.png`],
  },
};

export default function ShorterPage() {
  const appSchema = buildWebApplicationSchema();
  const faqSchema = buildFaqSchema();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ShorterClientPage />
    </>
  );
}
