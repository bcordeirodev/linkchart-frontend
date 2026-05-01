import type { Metadata } from "next";
import LinkAnalyticsPageContent from "@/pages/links/LinkAnalyticsPage";
export const metadata: Metadata = { title: "Link Analytics" };
export default function LinkAnalyticsPage() {
  return <LinkAnalyticsPageContent />;
}
