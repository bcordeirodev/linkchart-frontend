import type { Metadata } from "next";
import { HomeRedirect } from "@/shared/components/routing/HomeRedirect";

/**
 * Root page — serves only as an auth-aware redirect to /shorter (guests)
 * or /links (authenticated users). Not a content page; excluded from indexing.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function HomePage() {
  return <HomeRedirect />;
}
