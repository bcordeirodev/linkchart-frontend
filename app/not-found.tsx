import type { Metadata } from "next";
import NotFoundPageContent from "@/page-components/system/NotFoundPage";
export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: false },
};
export default function NotFound() {
  return <NotFoundPageContent />;
}
