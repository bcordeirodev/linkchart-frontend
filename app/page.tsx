import type { Metadata } from "next";
import { HomeLanding } from "@/shared/components/routing/HomeLanding";
import {
  buildWebApplicationSchema,
  buildFaqSchemaPtBR,
} from "@/lib/seo/structuredData";
import { buildLandingMetadata } from "@/lib/seo/landingMetadata";

/**
 * Root homepage (`/`) — the canonical, indexable entry point of the site.
 *
 * Serves the URL shortener landing (see {@link HomeLanding}); authenticated
 * users are forwarded to `/links` on the client. This replaces the previous
 * `noindex` + client-side redirect that removed the homepage from Google and
 * stopped it from passing authority to the shortener page.
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildLandingMetadata();
}

export default function HomePage() {
  const appSchema = buildWebApplicationSchema();
  const faqSchema = buildFaqSchemaPtBR();
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
      <HomeLanding />
    </>
  );
}
