import { Message } from "@/shared/ui/feedback/Message";

export default function PublicGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // `<Message />` is mounted per route-group (not in `Providers.tsx`) so
  // every group keeps a toast view under the theme that actually applies to
  // it — public routes always stay dark under the root `MainThemeProvider`.
  return (
    <>
      {children}
      <Message />
    </>
  );
}
