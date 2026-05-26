import type { Metadata } from "next";
import ShorterClientPage from "./ShorterClientPage";
import {
  buildWebApplicationSchema,
  buildFaqSchemaPtBR,
} from "@/lib/seo/structuredData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

export const metadata: Metadata = {
  title: "Encurtador de Link Gratuito com Analytics em Tempo Real",
  description:
    "Encurte qualquer URL gratuitamente, sem cadastro. Rastreie cliques por país, dispositivo e campanha UTM. Subdomínio personalizado, QR Code e slug customizado grátis.",
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
    title:
      "Encurtador de Link Gratuito com Analytics em Tempo Real | Link Charts",
    description:
      "Encurte qualquer URL gratuitamente, sem cadastro. Rastreie cliques por país, dispositivo e campanha UTM. Subdomínio personalizado, QR Code e slug customizado grátis.",
    type: "website",
    url: `${appUrl}/shorter`,
    images: [
      {
        url: `${appUrl}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "Link Charts — Encurtador de Link com Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Encurtador de Link Gratuito com Analytics em Tempo Real | Link Charts",
    description:
      "Encurte qualquer URL gratuitamente, sem cadastro. Rastreie cliques por país, dispositivo e campanha UTM. Subdomínio personalizado, QR Code e slug customizado grátis.",
    images: [`${appUrl}/og-default.png`],
  },
};

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
