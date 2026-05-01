import type { Metadata } from "next";
import VerifyEmailPageContent from "@/pages/auth/VerifyEmailPage";
export const metadata: Metadata = { title: "Verify Email" };
export default function VerifyEmailPage() {
  return <VerifyEmailPageContent />;
}
