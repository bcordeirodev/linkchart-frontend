"use client";
import { Box, Skeleton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useAudienceData } from "@/features/analytics/hooks/useAudienceData";
import { useInsightsData } from "@/features/analytics/hooks/useInsightsData";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { ResponsiveContainer } from "@/shared/ui/base/ResponsiveContainer";
import { AudienceChart } from "./AudienceChart";

import type { AudienceAnalysisProps } from "@/types/analytics";
import type {
  AudienceResponse,
  ConnectionTypeBreakdown,
  LanguageBreakdown,
  PlatformBreakdown,
} from "@/types/analytics/audience";

/**
 * Loading skeleton that mirrors the flattened Audience tab layout: three
 * stacked sections (Aparelhos → Navegador · Sistema · Idioma → Qualidade e
 * fidelidade) followed by a shorter "Detalhes técnicos" accordion bar.
 */
function AudienceSkeleton() {
  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Box key={i}>
          <Skeleton
            variant="rounded"
            animation="wave"
            height={24}
            width={180}
            sx={{ mb: 2, borderRadius: 1 }}
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            height={i === 0 ? 420 : 260}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      ))}

      {/* "Detalhes técnicos" accordion bar — collapsed, so only a thin
          header-height skeleton is shown */}
      <Skeleton
        variant="rounded"
        animation="wave"
        height={56}
        sx={{ borderRadius: 2 }}
      />
    </Stack>
  );
}

/**
 * Picks the language breakdown from the top-level field, falling back to the
 * legacy nested `audience` container. The backend may return either the
 * phase-aware object form or the legacy flat array; both are accepted by the
 * downstream `LanguageBreakdownCard` (which normalises internally), so the
 * value is forwarded as-is and typed to the card's union prop.
 *
 * @param data - The resolved audience response (hook or legacy shape).
 * @returns The language breakdown in either shape, or `undefined`.
 */
function resolveLanguageBreakdown(
  data: AudienceResponse | undefined,
): LanguageBreakdown | undefined {
  const value = data?.language_breakdown ?? data?.audience?.language_breakdown;
  return value as LanguageBreakdown | undefined;
}

/**
 * Picks the platform breakdown from the top-level field, falling back to the
 * legacy nested `audience` container. Accepts both the phase-aware object form
 * and the legacy flat array (handled downstream).
 *
 * @param data - The resolved audience response (hook or legacy shape).
 * @returns The platform breakdown in either shape, or `undefined`.
 */
function resolvePlatformBreakdown(
  data: AudienceResponse | undefined,
): PlatformBreakdown | undefined {
  const value = data?.platform_breakdown ?? data?.audience?.platform_breakdown;
  return value as PlatformBreakdown | undefined;
}

/**
 * Picks the connection-type breakdown from the top-level field, falling back to
 * the legacy nested `audience` container. Accepts both the phase-aware object
 * form and the legacy flat array (handled downstream).
 *
 * @param data - The resolved audience response (hook or legacy shape).
 * @returns The connection-type breakdown in either shape, or `undefined`.
 */
function resolveConnectionBreakdown(
  data: AudienceResponse | undefined,
): ConnectionTypeBreakdown | undefined {
  const value =
    data?.connection_type_breakdown ??
    data?.audience?.connection_type_breakdown;
  return value as ConnectionTypeBreakdown | undefined;
}

interface LegacyAudienceAnalysisProps {
  data?: unknown;
  linkId: string;
  /** ISO date string (yyyy-MM-dd) for the start of the period filter. */
  dateFrom?: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the period filter. */
  dateTo?: string | null;
  /** When `true`, bot traffic is excluded from all metrics. */
  excludeBots?: boolean;
}

/**
 * "Público" tab — answers "who clicks my link?" in three flattened,
 * scrollable sections (not sub-tabs): Aparelhos → Navegador · Sistema ·
 * Idioma → Qualidade e fidelidade, plus a collapsed "Detalhes técnicos"
 * accordion. Combines two data sources:
 *
 * - {@link useAudienceData} for device/browser/OS/language/quality
 *   breakdowns (the bulk of the tab).
 * - {@link useInsightsData} for `analytics_data.retention` and
 *   `analytics_data.session_depth`, relocated here from the dissolved
 *   Insights tab and rendered inside "Qualidade e fidelidade".
 *
 * Loading/error gate on both sources combined, matching the pattern already
 * used by `OriginAnalysis`.
 */
export function AudienceAnalysis({
  data: legacyData,
  linkId,
  dateFrom,
  dateTo,
  excludeBots,
}: LegacyAudienceAnalysisProps &
  Partial<Pick<AudienceAnalysisProps, "title">>) {
  const { t } = useTranslation("analytics");
  const shouldUseHook = !legacyData;

  const {
    data: hookData,
    stats,
    loading: audienceLoading,
    error: audienceError,
    refresh: refreshAudience,
  } = useAudienceData({
    linkId,
    enableRealtime: shouldUseHook,
    refreshInterval: 60000,
    dateFrom,
    dateTo,
    excludeBots,
  });

  const {
    data: insightsData,
    loading: insightsLoading,
    error: insightsError,
    refresh: refreshInsights,
  } = useInsightsData({ linkId, dateFrom, dateTo, excludeBots });

  // Both the hook result (top-level breakdowns) and the legacy payload
  // (breakdowns nested under `audience`) are covered by AudienceResponse, so
  // every read below resolves to `T | undefined` and is handled by the
  // existing optional-chaining / fallback guards — no `any` cast required.
  const audienceData = (shouldUseHook ? hookData : legacyData) as
    | AudienceResponse
    | undefined;
  const deviceBreakdown =
    audienceData?.audience?.device_breakdown ||
    audienceData?.device_breakdown ||
    [];
  const totalClicks =
    audienceData?.overview?.total_clicks || stats?.totalClicks || 0;

  // The legacy `data` prop never carries an insights payload — retention and
  // session-depth are only sourced from the hook.
  const retention = shouldUseHook
    ? insightsData?.analytics_data?.retention
    : undefined;
  const sessionDepth = shouldUseHook
    ? insightsData?.analytics_data?.session_depth
    : undefined;

  const loading = shouldUseHook ? audienceLoading || insightsLoading : false;
  const error = shouldUseHook ? audienceError ?? insightsError : null;

  /** Refetches both data sources backing this tab. */
  const handleRefresh = () => {
    refreshAudience();
    refreshInsights();
  };

  return (
    <Box>
      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={!!deviceBreakdown?.length}
        skeleton={<AudienceSkeleton />}
        onRetry={handleRefresh}
        loadingMessage={t("audience.loading")}
        emptyMessage={t("audience.empty")}
        minHeight={300}
      >
        <ResponsiveContainer style={{ padding: 0 }}>
          <AudienceChart
            deviceBreakdown={deviceBreakdown}
            totalClicks={totalClicks}
            browsers={audienceData?.browsers}
            operatingSystems={audienceData?.operating_systems}
            devicePerformance={audienceData?.device_performance}
            languages={audienceData?.languages}
            renderingEngine={(() => {
              const re = audienceData?.rendering_engine;
              return Array.isArray(re) ? re : re?.data;
            })()}
            quality={
              audienceData?.quality_breakdown?.tiers !== undefined
                ? audienceData?.quality_breakdown
                : undefined
            }
            languageBreakdown={resolveLanguageBreakdown(audienceData)}
            platformBreakdown={resolvePlatformBreakdown(audienceData)}
            connectionBreakdown={resolveConnectionBreakdown(audienceData)}
            retention={retention}
            sessionDepth={sessionDepth}
            insightsLoading={shouldUseHook ? insightsLoading : false}
          />
        </ResponsiveContainer>
      </AnalyticsStateManager>
    </Box>
  );
}

export default AudienceAnalysis;
