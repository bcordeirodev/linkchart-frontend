"use client";
import MainLayout from "@/shared/layout/MainLayout";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
