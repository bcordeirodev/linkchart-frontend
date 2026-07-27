import type { Metadata } from "next";
import LinkAnalyticsPageContent from "@/page-components/links/LinkAnalyticsPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Estatísticas do link" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LinkAnalyticsPage({ params }: Props) {
  const { id } = await params;
  return <LinkAnalyticsPageContent id={id} />;
}
