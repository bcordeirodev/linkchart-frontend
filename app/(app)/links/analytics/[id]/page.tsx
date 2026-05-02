import type { Metadata } from "next";
import LinkAnalyticsPageContent from "@/pages/links/LinkAnalyticsPage";

export const metadata: Metadata = { title: "Link Analytics" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LinkAnalyticsPage({ params }: Props) {
  const { id } = await params;
  return <LinkAnalyticsPageContent id={id} />;
}
