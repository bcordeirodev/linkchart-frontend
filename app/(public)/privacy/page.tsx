// app/(public)/privacy/page.tsx
import type { Metadata } from "next";

import PrivacyPage from "@/page-components/public/PrivacyPage";
import { resolveServerLanguage } from "@/lib/i18n/serverLanguage";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";

/** Generates language-aware metadata via the server-side language resolver. */
export async function generateMetadata(): Promise<Metadata> {
  const isEn = (await resolveServerLanguage()) === "en";
  return {
    title: isEn ? "Privacy Policy" : "Política de Privacidade",
    description: isEn
      ? "Learn how Link Charts collects, uses, and protects your personal data under LGPD and CCPA."
      : "Saiba como o Link Charts coleta, usa e protege seus dados pessoais conforme a LGPD e a CCPA.",
    alternates: { canonical: `${appUrl}/privacy` },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <PrivacyPage />;
}
