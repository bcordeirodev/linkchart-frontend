// app/(public)/support/page.tsx
import type { Metadata } from "next";
import SupportPage from "@/page-components/public/SupportPage";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";

/**
 * Static pt-BR metadata (the SEO target). Kept static so the page stays
 * cacheable; the visible content language reconciles client-side via i18n.
 */
export const metadata: Metadata = {
  title: "Ajuda — Como Encurtar URL com Analytics",
  description:
    "Aprenda a usar o Link Charts: encurte links grátis, rastreie cliques por país e dispositivo, adicione parâmetros UTM e gere QR codes. Perguntas frequentes.",
  alternates: { canonical: `${appUrl}/support` },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <SupportPage />;
}
