import type { Metadata } from "next";
import ShorterClientPage from "./ShorterClientPage";
import { buildWebApplicationSchema } from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

export const metadata: Metadata = {
  title: "Free URL Shortener",
  description:
    "Shorten any URL for free. Track clicks, analyze your audience, and grow with data-driven insights.",
  openGraph: {
    title: "Link Charts — Free URL Shortener with Analytics",
    description:
      "Shorten any URL for free. Track clicks, analyze your audience, and grow with data-driven insights.",
    type: "website",
    url: appUrl,
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630, alt: "Link Charts" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Link Charts — Free URL Shortener with Analytics",
    description:
      "Shorten any URL for free. Track clicks, analyze your audience, and grow with data-driven insights.",
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
