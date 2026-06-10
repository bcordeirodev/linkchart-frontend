// app/(public)/support/page.tsx
import type { Metadata } from "next";
import SupportPage from "@/page-components/public/SupportPage";
import { resolveServerLanguage } from "@/lib/i18n/serverLanguage";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";

/** Generates language-aware metadata via the server-side language resolver. */
export async function generateMetadata(): Promise<Metadata> {
  const isEn = (await resolveServerLanguage()) === "en";
  return {
    title: isEn
      ? "URL Shortener Help & FAQ — Features Guide"
      : "Ajuda — Como Encurtar URL com Analytics",
    description: isEn
      ? "Learn how to use Link Charts: shorten URLs, track click analytics, add UTM parameters, set custom slugs and generate QR codes. Full features FAQ."
      : "Aprenda a usar o Link Charts: encurte links grátis, rastreie cliques por país e dispositivo, adicione parâmetros UTM e gere QR codes. Perguntas frequentes.",
    alternates: { canonical: `${appUrl}/support` },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <SupportPage />;
}
