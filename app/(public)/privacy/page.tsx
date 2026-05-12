// app/(public)/privacy/page.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";

import PrivacyPage from "@/page-components/public/PrivacyPage";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";

/** Generates language-aware metadata by reading the i18nextLng cookie server-side. */
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const isEn = (cookieStore.get("i18nextLng")?.value ?? "pt-BR") === "en";
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
