// app/(public)/support/page.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";

import SupportPage from "@/page-components/public/SupportPage";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";

/** Generates language-aware metadata by reading the i18nextLng cookie server-side. */
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const isEn = (cookieStore.get("i18nextLng")?.value ?? "pt-BR") === "en";
  return {
    title: isEn ? "Support" : "Suporte",
    description: isEn
      ? "Link Charts support centre — get help, report issues, and contact us."
      : "Central de suporte do Link Charts — tire dúvidas, reporte problemas e entre em contato.",
    alternates: { canonical: `${appUrl}/support` },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <SupportPage />;
}
