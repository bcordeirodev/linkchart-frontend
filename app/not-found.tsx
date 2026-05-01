import type { Metadata } from "next";
import NotFoundPageContent from "@/pages/system/NotFoundPage";
export const metadata: Metadata = { title: "Page Not Found" };
export default function NotFound() {
  return <NotFoundPageContent />;
}
