import type { Metadata } from "next";
import { Message } from "@/shared/ui/feedback/Message";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // `<Message />` is mounted per route-group (not in `Providers.tsx`) so
  // every group keeps a toast view under the theme that actually applies to
  // it — auth routes always stay dark under the root `MainThemeProvider`.
  return (
    <>
      {children}
      <Message />
    </>
  );
}
