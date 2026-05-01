"use client";
import MainLayout from "@/shared/layout/MainLayout";
import { EmailVerificationGuard } from "@/lib/auth/components/EmailVerificationGuard";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmailVerificationGuard>
      <MainLayout>{children}</MainLayout>
    </EmailVerificationGuard>
  );
}
