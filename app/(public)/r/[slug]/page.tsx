import type { Metadata } from "next";
import dynamic from "next/dynamic";

const RedirectClientPage = dynamic(
  () => import("@/features/redirect/components/RedirectClientPage"),
  { ssr: false }
);

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const res = await fetch(`${apiUrl}/api/public/analytics/${slug}`, {
    next: { revalidate: 60 },
  }).catch(() => null);
  const data = res?.ok ? await res.json() : null;
  const clicks = data?.data?.total_clicks ?? 0;
  const title = `Redirecionando para ${slug}`;
  const description = `Link encurtado com ${clicks} cliques. Clique para acessar o destino com segurança.`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkchart.app";

  return {
    title,
    description,
    openGraph: {
      title: `${slug} — Link Charts`,
      description,
      type: "website",
      url: `${appUrl}/r/${slug}`,
    },
    twitter: {
      card: "summary",
      title: `${slug} — Link Charts`,
      description: `${clicks} cliques registrados.`,
    },
    robots: { index: false, follow: false },
  };
}

export default async function RedirectPage({ params }: Props) {
  const { slug } = await params;
  return <RedirectClientPage slug={slug} />;
}
