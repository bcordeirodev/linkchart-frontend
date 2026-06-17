"use client";
import { Box, Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useAudienceData } from "@/features/analytics/hooks/useAudienceData";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { ResponsiveContainer } from "@/shared/ui/base/ResponsiveContainer";
import { AudienceChart } from "./AudienceChart";
import { AudienceMetrics } from "./AudienceMetrics";

import type { AudienceAnalysisProps } from "@/types/analytics";
import type {
  AudienceResponse,
  ConnectionTypeBreakdown,
  LanguageBreakdown,
  PlatformBreakdown,
} from "@/types/analytics/audience";

/**
 * Loading skeleton that mirrors the Audience tab layout:
 * 6 metric cards → tabbed main chart (8 sub-tabs hold every audience
 * dataset, including quality, sources and the supplementary donuts).
 */
function AudienceSkeleton() {
  return (
    <Box>
      {/* 6 metric cards — 2 per row xs, 3 per row sm, 6 per row md */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            sm: "repeat(3, 1fr)",
            md: "repeat(6, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            animation="wave"
            height={120}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>

      {/* Main tabbed chart — tall protagonist with tab indicators */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              animation="wave"
              width={82}
              height={30}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
        <Skeleton
          variant="rounded"
          animation="wave"
          height={520}
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </Box>
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
  /** Currently-active audience sub-tab index (0–5). */
  subTabIndex?: number;
  /** Called when the user switches audience sub-tab. */
  onSubTabChange?: (v: number) => void;
}

/**
 * Componente de análise de audiência com dados de dispositivos, navegadores e sistemas operacionais
 */
export function AudienceAnalysis({
  data: legacyData,
  linkId,
  dateFrom,
  dateTo,
  excludeBots,
  subTabIndex,
  onSubTabChange,
}: LegacyAudienceAnalysisProps &
  Partial<Pick<AudienceAnalysisProps, "title">>) {
  const { t } = useTranslation("analytics");
  const shouldUseHook = !legacyData;

  const {
    data: hookData,
    stats,
    loading,
    error,
    refresh,
  } = useAudienceData({
    linkId,
    enableRealtime: shouldUseHook,
    refreshInterval: 60000,
    dateFrom,
    dateTo,
    excludeBots,
  });

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

  return (
    <Box>
      <AnalyticsStateManager
        loading={shouldUseHook ? loading : false}
        error={shouldUseHook && error ? error : null}
        hasData={!!deviceBreakdown?.length}
        skeleton={<AudienceSkeleton />}
        onRetry={refresh}
        loadingMessage={t("audience.loading")}
        emptyMessage={t("audience.empty")}
        minHeight={300}
      >
        <ResponsiveContainer style={{ padding: 0 }}>
          {/* 1. Metric cards */}
          {shouldUseHook && stats ? (
            <Box sx={{ mb: 2 }}>
              <AudienceMetrics data={{ audience: audienceData, stats }} />
            </Box>
          ) : null}

          {/* 2. Main tabbed chart — every audience dataset lives in a sub-tab */}
          <AudienceChart
            deviceBreakdown={deviceBreakdown}
            browserBreakdown={audienceData?.browser_breakdown}
            osBreakdown={audienceData?.os_breakdown}
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
            showAdvancedInsights={shouldUseHook}
            navigationContext={audienceData?.navigation_context_breakdown}
            socialPlatforms={audienceData?.social_platform_breakdown}
            languageBreakdown={resolveLanguageBreakdown(audienceData)}
            platformBreakdown={resolvePlatformBreakdown(audienceData)}
            connectionBreakdown={resolveConnectionBreakdown(audienceData)}
            fetchDestBreakdown={
              audienceData?.fetch_dest_breakdown ??
              audienceData?.audience?.fetch_dest_breakdown
            }
            activeTab={subTabIndex}
            onTabChange={onSubTabChange}
          />
        </ResponsiveContainer>
      </AnalyticsStateManager>
    </Box>
  );
}

export default AudienceAnalysis;
