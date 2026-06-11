"use client";
import { PublicAnalyticsSections } from "@/features/public-analytics";

/** Props passed from ShorterPage to the embedded analytics variant. */
export interface ShorterEmbeddedAnalyticsProps {
  /**
   * The link slug extracted from the `?slug=` query parameter.
   * Must be a non-empty string — the parent is responsible for guarding
   * against falsy values before rendering this component.
   */
  slug: string;
}

/**
 * Embedded analytics view for the `/shorter?slug=…` route.
 *
 * Rendered in place of the landing sections when a `?slug=` query parameter
 * is present. Delegates all data fetching to `PublicAnalyticsSections`; this
 * component is a focused wrapper that names the boundary clearly and keeps
 * the page-heading suppressed (the outer layout already provides chrome).
 */
export function ShorterEmbeddedAnalytics({
  slug,
}: ShorterEmbeddedAnalyticsProps) {
  return <PublicAnalyticsSections slug={slug} showPageHeading={false} />;
}
