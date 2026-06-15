import type { Metadata } from "next";
import UnauthorizedPageContent from "@/pages/system/UnauthorizedPage";
export const metadata: Metadata = {
  title: "Access Denied",
  robots: { index: false, follow: false },
};
export default function UnauthorizedPage() {
  return <UnauthorizedPageContent />;
}
