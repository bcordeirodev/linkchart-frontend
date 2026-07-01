import type { Metadata } from "next";

import CompareCompetitorPage from "@/page-components/public/CompareCompetitorPage";
import {
  buildCompareDubFaqSchema,
  buildCompareBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";
const path = "/comparar/dub";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; visible content reconciles language client-side via i18n. This
 * page is intentionally indexable because it is unique, commercial-intent
 * marketing content targeting "alternativa ao Dub" / "melhor encurtador
 * open-source" queries. Dub has a strong developer-focused free tier, so the
 * comparison is honest (Link Charts ties or loses some rows).
 */
export const metadata: Metadata = {
  title: "Link Charts vs Dub: qual encurtador de URL grátis? (2026)",
  description:
    "Comparamos Link Charts e Dub em plano gratuito, analytics, API, open-source e score de qualidade. Veja qual encurtador de URL faz mais sentido para você.",
  alternates: { canonical: `${appUrl}${path}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Link Charts vs Dub: qual encurtador de URL grátis?",
    description:
      "Dub brilha para devs (open-source, API). Veja onde o Link Charts leva vantagem — volume de links grátis, score de qualidade e uso sem cadastro.",
    type: "article",
    url: `${appUrl}${path}`,
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630 }],
  },
};

/**
 * `/comparar/dub` — server entry for the "Link Charts vs Dub" comparison.
 *
 * Injects `FAQPage` and `BreadcrumbList` JSON-LD (the AI-citation surface) and
 * renders the generalized client comparison UI (see
 * {@link CompareCompetitorPage}).
 */
export default function Page() {
  const faqSchema = buildCompareDubFaqSchema();
  const breadcrumbSchema = buildCompareBreadcrumbSchema(
    "Link Charts vs Dub",
    path,
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <CompareCompetitorPage i18nKey="compareDub" />
    </>
  );
}
