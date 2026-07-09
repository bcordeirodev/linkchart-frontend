import type { Metadata } from "next";
import UnauthorizedPageContent from "@/page-components/system/UnauthorizedPage";
export const metadata: Metadata = {
  title: "Access Denied",
  robots: { index: false, follow: false },
};
export default function UnauthorizedPage() {
  return <UnauthorizedPageContent />;
}
