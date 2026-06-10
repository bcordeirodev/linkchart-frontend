import type { Metadata } from "next";
import ShorterClientPage from "./ShorterClientPage";
import {
  buildWebApplicationSchema,
  buildFaqSchemaPtBR,
} from "@/lib/seo/structuredData";
import { resolveServerLanguage } from "@/lib/i18n/serverLanguage";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

/** Generates language-aware metadata via the server-side language resolver. */
export async function generateMetadata(): Promise<Metadata> {
  const isEn = (await resolveServerLanguage()) === "en";

  const title = isEn
    ? "Free URL Shortener with Real-Time Analytics"
    : "Encurtador de Link Gratuito com Analytics em Tempo Real";
  const fullTitle = `${title} | Link Charts`;
  const description = isEn
    ? "Shorten any URL for free, no sign-up required. Track clicks by country, device and UTM campaign. Free custom subdomain, QR Code and custom slug."
    : "Encurte qualquer URL gratuitamente, sem cadastro. Rastreie cliques por país, dispositivo e campanha UTM. Subdomínio personalizado, QR Code e slug customizado grátis.";
  const ogImageAlt = isEn
    ? "Link Charts — URL Shortener with Analytics"
    : "Link Charts — Encurtador de Link com Analytics";

  return {
    title,
    description,
    alternates: {
      canonical: `${appUrl}/shorter`,
      languages: {
        en: `${appUrl}/shorter`,
        "pt-BR": `${appUrl}/shorter`,
        "x-default": `${appUrl}/shorter`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url: `${appUrl}/shorter`,
      images: [
        {
          url: `${appUrl}/og-default.png`,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${appUrl}/og-default.png`],
    },
  };
}

export default function ShorterPage() {
  const appSchema = buildWebApplicationSchema();
  const faqSchema = buildFaqSchemaPtBR();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ShorterClientPage />
    </>
  );
}
