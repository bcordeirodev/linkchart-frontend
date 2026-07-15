"use client";
/**
 * `/reports` — aggregated analytics across every non-demo link the
 * authenticated user owns: KPIs, a daily-clicks trend, a top-links ranking,
 * a selectable dimension breakdown, and a CSV export of the underlying
 * clicks. Sibling to the per-link dashboard at `/links/analytics/[id]`, but
 * scoped to the whole account instead of a single link.
 */

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Stack,
} from "@mui/material";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

import { BreakdownChart } from "@/features/reports/components/BreakdownChart";
import { ClicksTimeseriesChart } from "@/features/reports/components/ClicksTimeseriesChart";
import { ReportsDateFilter } from "@/features/reports/components/ReportsDateFilter";
import { ReportsKpiHeader } from "@/features/reports/components/ReportsKpiHeader";
import { TopLinksTable } from "@/features/reports/components/TopLinksTable";
import {
  useBreakdown,
  useReportsSummary,
  useReportsTimeseries,
  useTopLinks,
} from "@/features/reports/hooks/useReports";
import { resolveReportsPeriod } from "@/features/reports/utils/resolveReportsPeriod";
import AuthGuardRedirect from "@/lib/auth/AuthGuardRedirect";
import { useMessage } from "@/lib/providers/MessageProvider";
import { useResponsive } from "@/lib/theme";
import { radiusTokens } from "@/lib/theme/designSystem";
import { reportsService } from "@/services/reports.service";
import { PageSectionHeading, ResponsiveContainer } from "@/shared/ui/base";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";

import type {
  ReportsBreakdownDimension,
  ReportsFilters,
  ReportsPeriod,
} from "@/features/reports/types";

/**
 * Page-shaped loading placeholder shown while `AuthGuardRedirect` resolves
 * the session — mirrors the final layout's proportions (header, filter row,
 * KPI grid, chart) so there is no visible reflow once real content swaps in.
 */
function ReportsPageSkeleton() {
  return (
    <ResponsiveContainer variant="page" sx={{ maxWidth: 1600 }}>
      <Stack spacing={{ xs: 2.5, sm: 3 }}>
        <Box>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={320} height={24} />
        </Box>
        <Skeleton
          variant="rounded"
          height={56}
          sx={{ borderRadius: `${radiusTokens.md}px` }}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.45fr 1fr" },
            gap: { xs: 2, md: 1.75 },
          }}
        >
          <Skeleton
            variant="rounded"
            height={140}
            sx={{ borderRadius: `${radiusTokens.md}px` }}
          />
          <Skeleton
            variant="rounded"
            height={140}
            sx={{ borderRadius: `${radiusTokens.md}px` }}
          />
        </Box>
        <Skeleton
          variant="rounded"
          height={340}
          sx={{ borderRadius: `${radiusTokens.md}px` }}
        />
      </Stack>
    </ResponsiveContainer>
  );
}

/**
 * Resolves a React Query error (if any) into the plain string
 * `AnalyticsStateManager` expects, or `null` when there is none.
 */
function toErrorMessage(error: unknown): string | null {
  if (!error) {
    return null;
  }
  return error instanceof Error ? error.message : String(error);
}

/**
 * Aggregated reports page: KPI header, daily-clicks trend, top-links
 * ranking, a selectable dimension breakdown, and a CSV export button.
 *
 * Filters (period + breakdown dimension) live as local component state, not
 * the URL — unlike the per-link analytics tabs (`useAnalyticsFilters`), this
 * page has no sub-tabs to keep in sync across navigations, so URL
 * persistence would add complexity with no real benefit.
 */
export default function ReportsPage() {
  const { isMobile } = useResponsive();
  const { t } = useTranslation("reports");
  const { showMessage } = useMessage();

  const [period, setPeriod] = useState<ReportsPeriod>("30d");
  const [dimension, setDimension] =
    useState<ReportsBreakdownDimension>("country");
  const [exporting, setExporting] = useState(false);

  // Bot traffic would inflate every one of these aggregates — always
  // excluded here, no UI toggle exposed (unlike the per-link tabs, which
  // let the user opt back in for raw traffic auditing).
  const filters: ReportsFilters = useMemo(
    () => ({ ...resolveReportsPeriod(period), excludeBots: true }),
    [period],
  );

  const summaryQuery = useReportsSummary(filters);
  const timeseriesQuery = useReportsTimeseries(filters);
  const topLinksQuery = useTopLinks(filters, 10);
  const breakdownQuery = useBreakdown(dimension, filters);

  /**
   * Downloads the CSV export for the active filters, surfacing a toast on
   * failure (e.g. an expired session). There is no success toast — the
   * browser's own download indicator already confirms it.
   */
  const handleExport = async () => {
    setExporting(true);
    try {
      await reportsService.downloadClicksCsv(filters);
    } catch {
      showMessage({ variant: "error", message: t("export.error") });
    } finally {
      setExporting(false);
    }
  };

  return (
    <AuthGuardRedirect
      auth={["user", "admin"]}
      fallback={<ReportsPageSkeleton />}
    >
      <ResponsiveContainer variant="page" sx={{ maxWidth: 1600 }}>
        <Stack spacing={{ xs: 2.5, sm: 3 }} component="section">
          <PageSectionHeading
            title={t("title")}
            description={t("subtitle")}
            titleVariant="page"
            action={
              <Button
                variant="outlined"
                size="small"
                onClick={handleExport}
                disabled={exporting}
                startIcon={
                  exporting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Download size={16} />
                  )
                }
              >
                {t("export.button")}
              </Button>
            }
          />

          <ReportsDateFilter period={period} onPeriodChange={setPeriod} />

          {summaryQuery.isError ? (
            <Alert severity="error">{toErrorMessage(summaryQuery.error)}</Alert>
          ) : summaryQuery.isLoading ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.45fr 1fr" },
                gap: { xs: 2, md: 1.75 },
              }}
            >
              <Skeleton
                variant="rounded"
                height={140}
                sx={{ borderRadius: `${radiusTokens.md}px` }}
              />
              <Skeleton
                variant="rounded"
                height={140}
                sx={{ borderRadius: `${radiusTokens.md}px` }}
              />
            </Box>
          ) : (
            <ReportsKpiHeader summary={summaryQuery.data ?? null} />
          )}

          <AnalyticsStateManager
            loading={timeseriesQuery.isLoading}
            error={toErrorMessage(timeseriesQuery.error)}
            hasData={(timeseriesQuery.data?.length ?? 0) > 0}
            emptyMessage={t("empty")}
            skeleton={
              <Skeleton
                variant="rounded"
                height={340}
                sx={{ borderRadius: `${radiusTokens.md}px` }}
              />
            }
          >
            <ClicksTimeseriesChart data={timeseriesQuery.data ?? []} />
          </AnalyticsStateManager>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "3fr 2fr" },
              gap: { xs: 2.5, sm: 3 },
              alignItems: "start",
            }}
          >
            <AnalyticsStateManager
              loading={topLinksQuery.isLoading}
              error={toErrorMessage(topLinksQuery.error)}
              hasData={(topLinksQuery.data?.length ?? 0) > 0}
              emptyMessage={t("empty")}
              skeleton={
                <Skeleton
                  variant="rounded"
                  height={360}
                  sx={{ borderRadius: `${radiusTokens.md}px` }}
                />
              }
            >
              <TopLinksTable
                data={topLinksQuery.data ?? []}
                isMobile={isMobile}
              />
            </AnalyticsStateManager>

            <AnalyticsStateManager
              loading={breakdownQuery.isLoading}
              error={toErrorMessage(breakdownQuery.error)}
              hasData={(breakdownQuery.data?.length ?? 0) > 0}
              emptyMessage={t("empty")}
              skeleton={
                <Skeleton
                  variant="rounded"
                  height={360}
                  sx={{ borderRadius: `${radiusTokens.md}px` }}
                />
              }
            >
              <BreakdownChart
                data={breakdownQuery.data ?? []}
                dimension={dimension}
                onDimensionChange={setDimension}
              />
            </AnalyticsStateManager>
          </Box>
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}
