"use client";

import { PublicAnalyticsSkeleton } from "@/shared/ui/feedback/skeletons";

/**
 * Route-level loading UI for `/public-analytics/[slug]`.
 *
 * The page is an RSC that blocks on two upstream fetches (analytics + link
 * payload); on a cold slug that used to mean a white screen. Next.js streams
 * this skeleton immediately while the server work runs. Reuses
 * `PublicAnalyticsSkeleton` — the same skeleton the client content shows while
 * React Query loads — so the layout (heading, hero card, metrics grid, charts,
 * CTA) matches the final page and there is no visual jump.
 *
 * Marked `"use client"` because the skeleton reads the MUI theme via
 * `useTheme()`.
 */
export default function PublicAnalyticsLoading() {
  return <PublicAnalyticsSkeleton />;
}
