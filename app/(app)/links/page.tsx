import type { Metadata } from "next";
import LinkListPageContent from "@/page-components/links/LinkListPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Links" };
export default function LinkListPage() {
  return <LinkListPageContent />;
}
