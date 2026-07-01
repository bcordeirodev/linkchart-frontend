import type { Metadata } from "next";

import GuiaCliquesBotsPage from "@/page-components/public/GuiaCliquesBotsPage";
import {
  buildGuiaBotsFaqSchema,
  buildCompareBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";
const path = "/guia/cliques-bot-vs-humano";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; visible content reconciles language client-side via i18n. This
 * page is indexable: it's unique informational content targeting a low-
 * competition differentiator ("como saber se os cliques são bots").
 */
export const metadata: Metadata = {
  title: "Como saber se os cliques do seu link são bots (guia)",
  description:
    "Nem todo clique é uma pessoa. Aprenda a identificar tráfego de bot em links encurtados e veja como o Link Charts pontua cada clique de 0 a 100 automaticamente.",
  alternates: { canonical: `${appUrl}${path}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Como saber se os cliques do seu link são reais ou de bots",
    description:
      "Identifique tráfego de bot nos seus links e veja como o Link Charts separa cliques orgânicos de suspeitos automaticamente.",
    type: "article",
    url: `${appUrl}${path}`,
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630 }],
  },
};

/**
 * `/guia/cliques-bot-vs-humano` — server entry for the bot-detection guide.
 *
 * Injects `FAQPage` and `BreadcrumbList` JSON-LD (the AI-citation surface) and
 * renders the client guide UI (see {@link GuiaCliquesBotsPage}).
 */
export default function Page() {
  const faqSchema = buildGuiaBotsFaqSchema();
  const breadcrumbSchema = buildCompareBreadcrumbSchema(
    "Como saber se os cliques são bots",
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
      <GuiaCliquesBotsPage />
    </>
  );
}
