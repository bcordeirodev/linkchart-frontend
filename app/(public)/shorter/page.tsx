import type { Metadata } from "next";
import ShorterClientPage from "./ShorterClientPage";
import { buildWebApplicationSchema } from "@/lib/seo/structuredData";

export const metadata: Metadata = {
  title: "Free URL Shortener",
  description:
    "Shorten any URL for free. Track clicks, analyze your audience, and grow with data-driven insights.",
  openGraph: {
    title: "Link Charts — Free URL Shortener with Analytics",
    description:
      "Shorten any URL for free. Track clicks, analyze your audience, and grow with data-driven insights.",
    type: "website",
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
