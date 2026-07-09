import type { Metadata } from "next";
import NotFoundPageContent from "@/page-components/system/NotFoundPage";
export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};
export default function NotFound() {
  return <NotFoundPageContent />;
}
