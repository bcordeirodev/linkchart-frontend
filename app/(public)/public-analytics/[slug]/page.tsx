import type { Metadata } from "next";
import { buildAnalyticsPageSchema } from "@/lib/seo/structuredData";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/public/analytics/${slug}`,
    { next: { revalidate: 300 } },
  ).catch(() => null);

  const data = res?.ok ? await res.json() : null;
  const title = slug;
  const clicks = data?.data?.total_clicks ?? 0;

  return {
    title: `${title} — Link Analytics`,
    description: `Public analytics for the link "${title}". ${clicks} total clicks tracked.`,
    openGraph: {
      title: `${title} — Link Analytics | Link Charts`,
      description: `Public analytics for the link "${title}". ${clicks} total clicks tracked.`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} — Link Analytics`,
      description: `${clicks} clicks tracked.`,
    },
  };
}

export default async function PublicAnalyticsPage({ params }: Props) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/public/analytics/${slug}`,
    { next: { revalidate: 300 } },
  ).catch(() => null);
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
