// app/(public)/terms/page.tsx
import type { Metadata } from "next";
import TermsPage from "@/page-components/public/TermsPage";
import { resolveServerLanguage } from "@/lib/i18n/serverLanguage";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";

/**
 * Generates language-aware metadata via the server-side language resolver.
 *
 * @returns {Promise<Metadata>} Language-aware metadata for the Terms page
 */
export async function generateMetadata(): Promise<Metadata> {
  const isEn = (await resolveServerLanguage()) === "en";
  return {
    title: isEn ? "Terms of Service" : "Termos de Serviço",
    description: isEn
      ? "Terms and conditions for using Link Charts — free URL shortener with analytics."
      : "Termos e condições de uso do Link Charts — encurtador de URLs gratuito com analytics.",
    alternates: { canonical: `${appUrl}/terms` },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <TermsPage />;
}
