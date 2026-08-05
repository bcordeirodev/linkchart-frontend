import type { Metadata } from "next";

import CompareCompetitorPage from "@/page-components/public/CompareCompetitorPage";
import {
  buildCompareBreadcrumbSchema,
  buildCompareLinktreeFaqSchema,
  serializeJsonLd,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";
const path = "/comparar/linktree";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; visible content reconciles language client-side via i18n. This
 * page is intentionally indexable — unlike per-slug analytics pages — because
 * it is unique, commercial-intent marketing content targeting "alternativa ao
 * Linktree" / "link na bio com estatísticas" queries. It is also the first
 * public surface for the bio page feature.
 */
export const metadata: Metadata = {
  title: "Alternativa ao Linktree: comparação Link Charts vs Linktree (2026)",
  description:
    "No plano grátis, o Linktree limita as estatísticas aos últimos 28 dias e mantém o logo no rodapé. Compare com o Link Charts: página bio no seu subdomínio e cliques item a item, de graça.",
  alternates: { canonical: `${appUrl}${path}` },
  robots: { index: true, follow: true },
  // `openGraph` REPLACES the root layout's object (Next.js does not merge
  // nested metadata), so `siteName` and `locale` have to be restated here or
  // they are simply dropped for this page. Same for `twitter`: without it the
  // page would inherit the layout's generic English homepage pitch on X.
  openGraph: {
    title: "Alternativa ao Linktree: comparação Link Charts vs Linktree (2026)",
    description:
      "Link na bio com estatísticas por item, no seu próprio subdomínio. Comparação recurso a recurso com o plano grátis do Linktree.",
    type: "article",
    url: `${appUrl}${path}`,
    siteName: "Link Charts",
    locale: "pt_BR",
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alternativa ao Linktree: comparação Link Charts vs Linktree (2026)",
    description:
      "Link na bio com estatísticas por item, no seu próprio subdomínio. Comparação recurso a recurso com o plano grátis do Linktree.",
    images: [`${appUrl}/og-default.png`],
  },
};

/**
 * `/comparar/linktree` — server entry for the "Link Charts vs Linktree"
 * comparison.
 *
 * Injects `FAQPage` and `BreadcrumbList` JSON-LD (the AI-citation surface) and
 * renders the generalized client comparison UI (see {@link CompareCompetitorPage}).
 */
export default function Page() {
  const faqSchema = buildCompareLinktreeFaqSchema();
  const breadcrumbSchema = buildCompareBreadcrumbSchema(
    "Link Charts vs Linktree",
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
      <CompareCompetitorPage i18nKey="compareLinktree" />
    </>
  );
}
