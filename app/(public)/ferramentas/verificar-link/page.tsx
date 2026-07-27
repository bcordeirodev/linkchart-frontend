import type { Metadata } from "next";

import ToolsLinkCheckerPage from "@/page-components/public/ToolsLinkCheckerPage";
import {
  buildCompareBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";
const path = "/ferramentas/verificar-link";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; visible content reconciles language client-side via i18n. This
 * page is indexable: a free standalone tool targeting "verificar link
 * suspeito" / "link é seguro" that feeds the signup funnel.
 */
export const metadata: Metadata = {
  title: "Verificar link suspeito — teste grátis se uma URL é segura",
  description:
    "Cole um link recebido no WhatsApp, por SMS ou e-mail e veja se ele aparece nas listas de phishing e malware do Google Safe Browsing. Veredito claro em segundos, grátis e sem cadastro.",
  alternates: { canonical: `${appUrl}${path}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Verificador de link suspeito | Link Charts",
    description:
      "Verifique se um link é seguro antes de clicar: consulta ao Google Safe Browsing com veredito claro — seguro, suspeito ou perigoso — em segundos.",
    type: "website",
    url: `${appUrl}${path}`,
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630 }],
  },
};

/**
 * Builds the `FAQPage` JSON-LD for the link checker, mirroring the pt-BR FAQ
 * rendered by {@link ToolsLinkCheckerPage} so crawlers and visitors read
 * identical answers.
 *
 * @returns a schema.org `FAQPage` object ready for `serializeJsonLd`
 */
function buildLinkCheckerFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Como saber se um link é seguro antes de clicar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cole o link no verificador acima. Ele consulta o Google Safe Browsing, a mesma base de phishing e malware usada pelo Chrome e pelo Firefox. Se o veredito for perigoso, não abra.",
        },
      },
      {
        "@type": "Question",
        name: "Cliquei em um link de golpe. E agora?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não digite nada na página e feche a aba. Se você informou senha ou dados de cartão, troque a senha imediatamente e avise o banco. Se baixou algum arquivo, rode um antivírus.",
        },
      },
      {
        "@type": "Question",
        name: "O verificador guarda os links que eu colo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não. O link é enviado apenas para consulta na base do Google Safe Browsing e não fica armazenado pelo Link Charts.",
        },
      },
    ],
  };
}

/**
 * `/ferramentas/verificar-link` — server entry for the free suspicious-link
 * checker tool.
 *
 * Injects `FAQPage` and `BreadcrumbList` JSON-LD (the AI-citation surface) and
 * renders the client tool UI (see {@link ToolsLinkCheckerPage}), which queries
 * the internal `POST /api/check-url` Safe Browsing proxy on explicit submit.
 */
export default function Page() {
  const faqSchema = buildLinkCheckerFaqSchema();
  const breadcrumbSchema = buildCompareBreadcrumbSchema(
    "Verificador de link suspeito",
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
      <ToolsLinkCheckerPage />
    </>
  );
}
