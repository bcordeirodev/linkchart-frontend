import type { Metadata } from "next";
import LinkListPageContent from "@/page-components/links/LinkListPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Meus links" };
export default function LinkListPage() {
  return <LinkListPageContent />;
}
