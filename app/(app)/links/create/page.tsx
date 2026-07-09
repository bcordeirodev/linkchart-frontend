import type { Metadata } from "next";
import LinkCreatePageContent from "@/page-components/links/LinkCreatePage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Create Link" };
export default function LinkCreatePage() {
  return <LinkCreatePageContent />;
}
