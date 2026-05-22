import type { Metadata } from "next";
import ShorterClientPage from "./ShorterClientPage";
import {
  buildWebApplicationSchema,
  buildFaqSchema,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

export const metadata: Metadata = {
  title: "Free URL Shortener with Analytics & Custom Subdomain",
  description:
    "Shorten any URL free — no account needed. Track clicks by country, device and UTM. Free custom subdomain, QR code and custom slug with a free account.",
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
    title: "Free URL Shortener with Analytics & Custom Subdomain | Link Charts",
    description:
      "Shorten any URL free — no account needed. Track clicks by country, device and UTM. Free custom subdomain, QR code and custom slug with a free account.",
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
    title: "Free URL Shortener with Analytics & Custom Subdomain | Link Charts",
    description:
      "Shorten any URL free — no account needed. Track clicks by country, device and UTM. Free custom subdomain, QR code and custom slug with a free account.",
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
