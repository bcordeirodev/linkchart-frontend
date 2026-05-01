import type { Metadata } from "next";
import EmailVerificationPendingPageContent from "@/pages/auth/EmailVerificationPendingPage";
export const metadata: Metadata = { title: "Check Your Inbox" };
export default function EmailVerificationPendingPage() {
  return <EmailVerificationPendingPageContent />;
}
