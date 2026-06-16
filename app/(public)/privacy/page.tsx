// app/(public)/privacy/page.tsx
import type { Metadata } from "next";

import PrivacyPage from "@/page-components/public/PrivacyPage";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; the visible content language reconciles client-side via i18n.
 */
export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como o Link Charts coleta, usa e protege seus dados pessoais conforme a LGPD e a CCPA.",
  alternates: { canonical: `${appUrl}/privacy` },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PrivacyPage />;
}
