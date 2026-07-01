import type { Metadata } from "next";

import GuiaInstagramPage from "@/page-components/public/GuiaInstagramPage";
import {
  buildGuiaInstagramFaqSchema,
  buildCompareBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";
const path = "/guia/rastrear-link-instagram";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; visible content reconciles language client-side via i18n. This
 * page is indexable: it's unique, high-intent informational content targeting
 * "como rastrear cliques de um link no Instagram".
 */
export const metadata: Metadata = {
  title: "Como rastrear cliques de um link no Instagram (guia grátis)",
  description:
    "O Instagram não deixa clicar em links nas legendas. Use um link curto na bio ou no sticker dos Stories e veja, de graça, quantas pessoas clicaram, de onde vieram, o dispositivo e a cidade.",
  alternates: { canonical: `${appUrl}${path}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Como rastrear cliques de um link no Instagram",
    description:
      "Encurte seu link, coloque na bio ou no sticker dos Stories e acompanhe cada clique — origem, dispositivo e cidade — no dashboard gratuito do Link Charts.",
    type: "article",
    url: `${appUrl}${path}`,
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630 }],
  },
};

/**
 * `/guia/rastrear-link-instagram` — server entry for the Instagram tracking
 * guide.
 *
 * Injects `FAQPage` and `BreadcrumbList` JSON-LD (the AI-citation surface) and
 * renders the client guide UI (see {@link GuiaInstagramPage}).
 */
export default function Page() {
  const faqSchema = buildGuiaInstagramFaqSchema();
  const breadcrumbSchema = buildCompareBreadcrumbSchema(
    "Como rastrear link no Instagram",
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
      <GuiaInstagramPage />
    </>
  );
}
