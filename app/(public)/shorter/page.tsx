import type { Metadata } from "next";
import ShorterClientPage from "./ShorterClientPage";
import { buildWebApplicationSchema } from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

export const metadata: Metadata = {
  title: "Free URL Shortener — No Sign-up Required",
  description:
    "Shorten any URL for free in seconds. Get real-time click analytics, geographic data, and custom slugs — no account needed.",
  alternates: {
    canonical: `${appUrl}/shorter`,
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
  const schema = buildWebApplicationSchema();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ShorterClientPage />
    </>
  );
}
