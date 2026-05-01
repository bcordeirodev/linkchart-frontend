import type { Metadata } from "next";
import ResetPasswordPageContent from "@/pages/auth/ResetPasswordPage";
export const metadata: Metadata = { title: "Set New Password" };
export default function ResetPasswordPage() {
  return <ResetPasswordPageContent />;
}
