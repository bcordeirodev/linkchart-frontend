import type { Metadata } from "next";
import UnauthorizedPageContent from "@/pages/system/UnauthorizedPage";
export const metadata: Metadata = { title: "Access Denied" };
export default function UnauthorizedPage() {
  return <UnauthorizedPageContent />;
}
