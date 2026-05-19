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
