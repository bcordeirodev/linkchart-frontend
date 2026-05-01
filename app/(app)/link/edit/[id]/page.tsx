import type { Metadata } from "next";
import LinkEditPageContent from "@/pages/links/LinkEditPage";
export const metadata: Metadata = { title: "Edit Link" };
export default function LinkEditPage() {
  return <LinkEditPageContent />;
}
