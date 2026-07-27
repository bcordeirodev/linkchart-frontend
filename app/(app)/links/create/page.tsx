import type { Metadata } from "next";
import LinkCreatePageContent from "@/page-components/links/LinkCreatePage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Criar link" };
export default function LinkCreatePage() {
  return <LinkCreatePageContent />;
}
