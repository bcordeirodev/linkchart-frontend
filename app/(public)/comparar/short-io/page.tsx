import type { Metadata } from "next";

import CompareCompetitorPage from "@/page-components/public/CompareCompetitorPage";
import {
  buildCompareShortIoFaqSchema,
  buildCompareBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";
const path = "/comparar/short-io";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; visible content reconciles language client-side via i18n. This
 * page is intentionally indexable because it is unique, commercial-intent
 * marketing content targeting "alternativa ao Short.io" / "encurtador de URL
 * vs" queries. Short.io has a genuinely strong free tier, so the comparison is
 * honest (Link Charts ties or loses some rows).
 */
export const metadata: Metadata = {
  title: "Link Charts vs Short.io: qual encurtador de URL grátis? (2026)",
  description:
    "Comparamos Link Charts e Short.io em analytics, plano gratuito, domínios personalizados e score de qualidade. Veja qual encurtador de URL entrega mais de graça.",
  alternates: { canonical: `${appUrl}${path}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Link Charts vs Short.io: qual encurtador de URL grátis?",
    description:
      "Short.io tem um free tier forte com domínios personalizados. Veja onde o Link Charts se destaca — score de qualidade, analytics público e português nativo.",
    type: "article",
    url: `${appUrl}${path}`,
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630 }],
  },
};

/**
 * `/comparar/short-io` — server entry for the "Link Charts vs Short.io"
 * comparison.
 *
 * Injects `FAQPage` and `BreadcrumbList` JSON-LD (the AI-citation surface) and
 * renders the generalized client comparison UI (see
 * {@link CompareCompetitorPage}).
 */
export default function Page() {
  const faqSchema = buildCompareShortIoFaqSchema();
  const breadcrumbSchema = buildCompareBreadcrumbSchema(
    "Link Charts vs Short.io",
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
      <CompareCompetitorPage i18nKey="compareShortIo" />
    </>
  );
}
