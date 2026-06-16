// app/(public)/terms/page.tsx
import type { Metadata } from "next";
import TermsPage from "@/page-components/public/TermsPage";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; the visible content language reconciles client-side via i18n.
 */
export const metadata: Metadata = {
  title: "Termos de Serviço",
  description:
    "Termos e condições de uso do Link Charts — encurtador de URLs gratuito com analytics.",
  alternates: { canonical: `${appUrl}/terms` },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <TermsPage />;
}
