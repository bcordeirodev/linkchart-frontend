import type { Metadata } from "next";
import { buildAnalyticsPageSchema } from "@/lib/seo/structuredData";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const apiUrl = process.env.API_URL ?? "http://localhost:8000";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";
  const res = await fetch(`${apiUrl}/api/public/analytics/${slug}`, {
    next: { revalidate: 300 },
  }).catch(() => null);

  const data = res?.ok ? await res.json() : null;
  const clicks = data?.data?.total_clicks ?? 0;
  const ogImage = {
    url: `${appUrl}/og-default.png`,
    width: 1200,
    height: 630,
    alt: "Link Charts Analytics",
  };

  return {
    title: `${slug} — Link Analytics`,
    description: `Public analytics for the link "${slug}". ${clicks} total clicks tracked.`,
    alternates: {
      canonical: `${appUrl}/public-analytics/${slug}`,
    },
    // Per-slug analytics pages can multiply quickly and offer thin content
    // for users that didn't create the link. We allow link equity to flow
    // (follow) but keep them out of the index to protect SEO of the home
    // and /shorter pages.
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
    openGraph: {
      title: `${slug} — Link Analytics | Link Charts`,
      description: `Public analytics for the link "${slug}". ${clicks} total clicks tracked.`,
      type: "website",
      url: `${appUrl}/public-analytics/${slug}`,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${slug} — Link Analytics`,
      description: `${clicks} clicks tracked for this link.`,
      images: [`${appUrl}/og-default.png`],
    },
  };
}

export default async function PublicAnalyticsPage({ params }: Props) {
  const { slug } = await params;
  const apiUrl = process.env.API_URL ?? "http://localhost:8000";

  const res = await fetch(`${apiUrl}/api/public/analytics/${slug}`, {
    next: { revalidate: 300 },
  }).catch(() => null);
  const data = res?.ok ? await res.json() : null;
  const clicks = data?.data?.total_clicks ?? 0;
  const schema = buildAnalyticsPageSchema(slug, slug, clicks);

  const { PublicAnalyticsPageContent } = await import(
    "@/features/public-analytics"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PublicAnalyticsPageContent slug={slug} />
    </>
  );
}
