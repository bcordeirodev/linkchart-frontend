"use client";
import dynamic from "next/dynamic";

// Client Component wrapper — allows ssr: false for browser-only redirect logic.
// The Server Component page imports this instead of using dynamic() directly.
const RedirectClientPage = dynamic(() => import("./RedirectClientPage"), {
  ssr: false,
});

export default function RedirectDynamic({ slug }: { slug: string }) {
  return <RedirectClientPage slug={slug} />;
}
