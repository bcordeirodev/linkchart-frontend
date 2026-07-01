import type { Metadata } from "next";

import GuiaVerCliquesPage from "@/page-components/public/GuiaVerCliquesPage";
import {
  buildGuiaVerCliquesFaqSchema,
  buildCompareBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";
const path = "/guia/como-ver-cliques-do-link";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; visible content reconciles language client-side via i18n. This
 * page is indexable: it's unique, high-intent informational content targeting a
 * low-competition query ("como ver quantas pessoas clicaram no meu link").
 */
export const metadata: Metadata = {
  title: "Como ver quantas pessoas clicaram no seu link (guia)",
  description:
    "Veja quantas pessoas clicaram no seu link em tempo real, de graça. Aprenda a acompanhar o total de cliques no Link Charts — com país, cidade, dispositivo, horário de pico e origem do tráfego.",
  alternates: { canonical: `${appUrl}${path}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Como ver quantas pessoas clicaram no seu link",
    description:
      "Acompanhe o total de cliques do seu link em tempo real e de graça, com geografia, dispositivo, horário de pico e origem do tráfego no Link Charts.",
    type: "article",
    url: `${appUrl}${path}`,
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630 }],
  },
};

/**
 * `/guia/como-ver-cliques-do-link` — server entry for the "see your clicks"
 * guide.
 *
 * Injects `FAQPage` and `BreadcrumbList` JSON-LD (the AI-citation surface) and
 * renders the client guide UI (see {@link GuiaVerCliquesPage}).
 */
export default function Page() {
  const faqSchema = buildGuiaVerCliquesFaqSchema();
  const breadcrumbSchema = buildCompareBreadcrumbSchema(
    "Como ver os cliques do seu link",
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
      <GuiaVerCliquesPage />
    </>
  );
}
