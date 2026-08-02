import type { Metadata } from "next";

import GuiaWhatsappPage from "@/page-components/public/GuiaWhatsappPage";
import {
  buildGuiaWhatsappFaqSchema,
  buildCompareBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";
const path = "/guia/link-curto-para-whatsapp";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; visible content reconciles language client-side via i18n. This
 * page is indexable: it targets the product's #1 measured use case ("link
 * curto para whatsapp", "link para grupo de whatsapp") with unique,
 * high-intent informational content.
 */
export const metadata: Metadata = {
  title: "Link curto para WhatsApp com estatísticas de cliques (grátis)",
  description:
    "Crie um link curto para o WhatsApp do seu negócio ou para o grupo — com o seu nome no link — e veja quantas pessoas clicaram, de qual cidade, aparelho e horário. Grátis e sem cadastro.",
  alternates: { canonical: `${appUrl}${path}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Link curto para WhatsApp com estatísticas de cliques",
    description:
      "Encurte o wa.me ou o convite do grupo, personalize o final do link e acompanhe cada clique — horário, cidade e aparelho — no dashboard gratuito do Link Charts.",
    type: "article",
    url: `${appUrl}${path}`,
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630 }],
  },
};

/**
 * `/guia/link-curto-para-whatsapp` — server entry for the WhatsApp short-link
 * guide.
 *
 * Injects `FAQPage` and `BreadcrumbList` JSON-LD (the AI-citation surface) and
 * renders the client guide UI (see {@link GuiaWhatsappPage}).
 */
export default function Page() {
  const faqSchema = buildGuiaWhatsappFaqSchema();
  const breadcrumbSchema = buildCompareBreadcrumbSchema(
    "Link curto para WhatsApp",
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
      <GuiaWhatsappPage />
    </>
  );
}
