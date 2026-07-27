import type { Metadata } from "next";

import ToolsUtmGeneratorPage from "@/page-components/public/ToolsUtmGeneratorPage";
import {
  buildCompareBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";
const path = "/ferramentas/gerador-utm";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; visible content reconciles language client-side via i18n. This
 * page is indexable: a free standalone tool targeting "gerador de UTM" /
 * "criar link com UTM" that feeds the signup funnel.
 */
export const metadata: Metadata = {
  title: "Gerador de UTM grátis — monte links rastreáveis em segundos",
  description:
    "Monte URLs com utm_source, utm_medium e utm_campaign sem erro de digitação. Presets para Instagram, WhatsApp e e-mail, explicação de cada parâmetro e cópia com um clique. 100% grátis.",
  alternates: { canonical: `${appUrl}${path}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Gerador de UTM grátis | Link Charts",
    description:
      "Preencha os campos, veja a URL montada ao vivo e copie pronta. Depois encurte o link e acompanhe os cliques de cada campanha em estatísticas gratuitas.",
    type: "website",
    url: `${appUrl}${path}`,
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630 }],
  },
};

/**
 * Builds the `FAQPage` JSON-LD for the UTM generator, mirroring the pt-BR FAQ
 * rendered by {@link ToolsUtmGeneratorPage} so crawlers and visitors read
 * identical answers.
 *
 * @returns a schema.org `FAQPage` object ready for `serializeJsonLd`
 */
function buildUtmGeneratorFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "UTM muda a página de destino?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não. Os parâmetros UTM viajam na URL, mas o site abre normalmente. Eles só são lidos pelas ferramentas de medição — como as estatísticas do Link Charts, o GA4 ou o Meta Ads.",
        },
      },
      {
        "@type": "Question",
        name: "Preciso preencher os cinco parâmetros?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não. Na prática, utm_source, utm_medium e utm_campaign resolvem a maioria dos casos. utm_term e utm_content são úteis em anúncios pagos e testes A/B.",
        },
      },
      {
        "@type": "Question",
        name: "Por que encurtar um link com UTM?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "URLs com UTM ficam longas — ruins para a bio do Instagram e mensagens de WhatsApp. Encurtando no Link Charts, você compartilha um link limpo e ainda vê os cliques de cada campanha em tempo real.",
        },
      },
    ],
  };
}

/**
 * `/ferramentas/gerador-utm` — server entry for the free UTM generator tool.
 *
 * Injects `FAQPage` and `BreadcrumbList` JSON-LD (the AI-citation surface) and
 * renders the client tool UI (see {@link ToolsUtmGeneratorPage}). The tool is
 * 100% client-side — no backend is involved in assembling the URL.
 */
export default function Page() {
  const faqSchema = buildUtmGeneratorFaqSchema();
  const breadcrumbSchema = buildCompareBreadcrumbSchema("Gerador de UTM", path);
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
      <ToolsUtmGeneratorPage />
    </>
  );
}
