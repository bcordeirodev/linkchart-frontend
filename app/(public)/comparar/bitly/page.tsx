import type { Metadata } from "next";

import CompareCompetitorPage from "@/page-components/public/CompareCompetitorPage";
import {
  buildCompareBitlyFaqSchema,
  buildCompareBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";
const path = "/comparar/bitly";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; visible content reconciles language client-side via i18n. This
 * page is intentionally indexable — unlike per-slug analytics pages — because
 * it is unique, commercial-intent marketing content targeting "alternativa ao
 * Bitly" / "encurtador de URL vs" queries — searches that spiked after the
 * February 2025 changes to Bitly's free plan (interstitial ads, 5 links/month).
 */
export const metadata: Metadata = {
  title: "Alternativa ao Bitly: comparação Link Charts vs Bitly (2026)",
  description:
    "Desde fevereiro de 2025 o plano grátis do Bitly exibe anúncios e cria só 5 links/mês. Compare com o Link Charts: estatísticas completas grátis e redirecionamento sem anúncio.",
  alternates: { canonical: `${appUrl}${path}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Alternativa ao Bitly: comparação Link Charts vs Bitly (2026)",
    description:
      "O que mudou no plano grátis do Bitly em 2025 — e qual encurtador de URL entrega mais estatísticas de graça. Comparação recurso a recurso.",
    type: "article",
    url: `${appUrl}${path}`,
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630 }],
  },
};

/**
 * `/comparar/bitly` — server entry for the "Link Charts vs Bitly" comparison.
 *
 * Injects `FAQPage` and `BreadcrumbList` JSON-LD (the AI-citation surface) and
 * renders the generalized client comparison UI (see {@link CompareCompetitorPage}).
 */
export default function Page() {
  const faqSchema = buildCompareBitlyFaqSchema();
  const breadcrumbSchema = buildCompareBreadcrumbSchema(
    "Link Charts vs Bitly",
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
      <CompareCompetitorPage i18nKey="compareBitly" />
    </>
  );
}
