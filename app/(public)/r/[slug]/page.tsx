import type { Metadata } from "next";
import RedirectDynamic from "@/features/redirect/components/RedirectDynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // API_URL is a server-only runtime env var — safe to use in Server Components.
  const apiUrl = process.env.API_URL ?? "http://localhost:8000";
  const res = await fetch(`${apiUrl}/api/public/analytics/${slug}`, {
    next: { revalidate: 60 },
  }).catch(() => null);
  const data = res?.ok ? await res.json() : null;
  const clicks = data?.data?.total_clicks ?? 0;
  const title = `Redirecionando para ${slug}`;
  const description = `Link encurtado com ${clicks} cliques. Clique para acessar o destino com segurança.`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";

  return {
    title,
    description,
    openGraph: {
      title: `${slug} — Link Charts`,
      description,
      type: "website",
      url: `${appUrl}/r/${slug}`,
      images: [
        {
          url: `${appUrl}/og-default.png`,
          width: 1200,
          height: 630,
          alt: "Link Charts",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${slug} — Link Charts`,
      description: `${clicks} cliques registrados.`,
    },
    robots: { index: false, follow: false },
  };
}

export default async function RedirectPage({ params }: Props) {
  const { slug } = await params;
  return <RedirectDynamic slug={slug} />;
}
