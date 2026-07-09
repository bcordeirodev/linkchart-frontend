import type { Metadata } from "next";
import ShorterFeaturePage from "@/page-components/public/ShorterPage";
import {
  buildWebApplicationSchema,
  buildFaqSchemaPtBR,
  serializeJsonLd,
} from "@/lib/seo/structuredData";
import { buildLandingMetadata } from "@/lib/seo/landingMetadata";

/**
 * Generates the shortener landing metadata. The canonical URL resolves to the
 * homepage (`/`) so this legacy route consolidates its search signals there
 * instead of competing with it as duplicate content.
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildLandingMetadata();
}

export default function ShorterPage() {
  const appSchema = buildWebApplicationSchema();
  const faqSchema = buildFaqSchemaPtBR();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <ShorterFeaturePage />
    </>
  );
}
