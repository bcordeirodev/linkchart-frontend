import type { Metadata } from "next";

import GuiaAlternativaBitlyPage from "@/page-components/public/GuiaAlternativaBitlyPage";
import {
  buildGuiaAlternativaBitlyFaqSchema,
  buildCompareBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";
const path = "/guia/alternativa-ao-bitly";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; visible content reconciles language client-side via i18n. This
 * page is indexable and targets the listicle intent ("alternativa ao bitly
 * grátis", "encurtador melhor que bitly") — deliberately distinct from
 * `/comparar/bitly`, which owns the 1×1 head-to-head intent.
 */
export const metadata: Metadata = {
  title: "Alternativa ao Bitly grátis: as melhores opções (2026)",
  description:
    "O plano gratuito do Bitly cria 5 links por mês e, pelo aviso da própria empresa, pode exibir anúncio antes do destino. Veja as alternativas grátis com prós, contras e fonte de cada dado.",
  alternates: { canonical: `${appUrl}${path}` },
  robots: { index: true, follow: true },
  // `openGraph` REPLACES the root layout's object (Next.js does not merge
  // nested metadata), so `siteName` and `locale` have to be restated here or
  // they are simply dropped for this page. Same for `twitter`: without it the
  // page would inherit the layout's generic English homepage pitch on X.
  openGraph: {
    title: "Alternativa ao Bitly grátis: as melhores opções em 2026",
    description:
      "Comparação honesta das alternativas gratuitas ao Bitly — Link Charts, TinyURL, encurtador.dev e encurtador.com.br — com limites do plano grátis, estatísticas incluídas e fonte de cada dado.",
    type: "article",
    url: `${appUrl}${path}`,
    siteName: "Link Charts",
    locale: "pt_BR",
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alternativa ao Bitly grátis: as melhores opções em 2026",
    description:
      "Comparação honesta das alternativas gratuitas ao Bitly — Link Charts, TinyURL, encurtador.dev e encurtador.com.br — com limites do plano grátis, estatísticas incluídas e fonte de cada dado.",
    images: [`${appUrl}/og-default.png`],
  },
};

/**
 * `/guia/alternativa-ao-bitly` — server entry for the free-Bitly-alternatives
 * listicle.
 *
 * Injects `FAQPage` and `BreadcrumbList` JSON-LD (the AI-citation surface) and
 * renders the client guide UI (see {@link GuiaAlternativaBitlyPage}).
 */
export default function Page() {
  const faqSchema = buildGuiaAlternativaBitlyFaqSchema();
  const breadcrumbSchema = buildCompareBreadcrumbSchema(
    "Alternativa ao Bitly grátis",
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
      <GuiaAlternativaBitlyPage />
    </>
  );
}
