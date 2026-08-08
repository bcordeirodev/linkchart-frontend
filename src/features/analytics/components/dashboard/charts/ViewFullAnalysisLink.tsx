"use client";
/**
 * 🔗 VIEW FULL ANALYSIS LINK - Cross-link discreto do Resumo para outras abas
 */

import { Box, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

/**
 * Named analytics tab slugs this cross-link can target. Mirrors the subset of
 * `TabId` (`@/features/links/hooks/useAnalyticsFilters`) that the Resumo
 * dashboard charts link out to — `"when"` (Momento) and `"audience"`/`"places"`
 * (Público/Lugares).
 */
export type CrossLinkTab = "when" | "audience" | "places";

/** Props accepted by the {@link ViewFullAnalysisLink} component. */
interface ViewFullAnalysisLinkProps {
  /** Named tab slug this link switches the page to via the `tab` URL param. */
  tab: CrossLinkTab;
}

/**
 * Discreet cross-link rendered in a dashboard chart's `ChartCard.action` slot,
 * pointing the reader at the tab that carries the full analysis for the chart
 * they're looking at (spec de refinamento visual 2026-08-08 §3.10) — Hourly
 * Clicks and Day of Week point to Momento (`"when"`), Device Breakdown points
 * to Público (`"audience"`), Top Countries points to Lugares (`"places"`).
 *
 * Rewrites only the `tab` query param on the current URL via `next/navigation`
 * — every other filter already in the URL (`period`, `bots`, sub-tab indices,
 * custom date range…) is copied over unchanged, so following this link
 * behaves exactly like clicking the destination tab in the tab strip itself,
 * just from inside a chart card instead of the nav row above it.
 */
export function ViewFullAnalysisLink({ tab }: ViewFullAnalysisLinkProps) {
  const { t } = useTranslation("analytics");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** Merges `tab` onto the current search params and replaces the URL (no scroll, no new history entry). */
  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Typography
        component="button"
        type="button"
        onClick={handleClick}
        variant="body2"
        sx={{
          appearance: "none",
          background: "none",
          border: "none",
          p: 0,
          m: 0,
          cursor: "pointer",
          font: "inherit",
          color: "text.secondary",
          fontWeight: 500,
          "&:hover": { color: "primary.main" },
        }}
      >
        {t("dashboard.viewFullAnalysis")} →
      </Typography>
    </Box>
  );
}

export default ViewFullAnalysisLink;
