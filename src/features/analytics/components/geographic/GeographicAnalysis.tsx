"use client";
import { useState } from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { useGeographicData } from "../../hooks/useGeographicData";

import { ContinentBreakdown } from "./ContinentBreakdown";
import { GeographicFilterBar } from "./GeographicFilterBar";
import { GeographicInsights } from "./GeographicInsights";
import { GeographicMapAndList } from "./index";

/**
 * Loading skeleton that mirrors the sub-tabbed Geographic tab layout: filter
 * bar → segmented sub-tab control → a single content block (the shape of
 * whichever sub-tab loads first).
 */
function GeographicSkeleton() {
  return (
    <Box>
      {/* Continent filter bar */}
      <Skeleton
        variant="rounded"
        animation="wave"
        height={52}
        sx={{ mb: 2, borderRadius: 2 }}
      />

      {/* Segmented sub-tab control */}
      <Skeleton
        variant="rounded"
        animation="wave"
        height={40}
        sx={{ mb: 2, borderRadius: 2, maxWidth: 420 }}
      />

      <Skeleton
        variant="rounded"
        animation="wave"
        height={360}
        sx={{ borderRadius: 2 }}
      />
    </Box>
  );
}

/** Props accepted by the {@link GeographicAnalysis} component. */
interface GeographicAnalysisProps {
  /** Canonical id of the link to display analytics for. */
  linkId: string;
  /** Whether to subscribe to realtime updates. Defaults to `false`. */
  enableRealtime?: boolean;
  /** ISO date string (yyyy-MM-dd) for the start of the period filter. */
  dateFrom?: string | null;
  /** ISO date string (yyyy-MM-dd) for the end of the period filter. */
  dateTo?: string | null;
  /** When `true`, bot traffic is excluded from all metrics. */
  excludeBots?: boolean;
  /** Server-side continent filter. `null` means all continents. */
  continent?: string | null;
  /** Callback to propagate `continent` changes to the parent (enables filter bar). */
  onContinentChange?: (v: string | null) => void;
}

/**
 * "Lugares" tab — answers "where is my audience?" on a single screen.
 *
 * It had three sub-tabs, and all three answered the same question. Two of them
 * were even both maps ("Mapa e ranking" and "Mapa de calor"), which forced the
 * user to guess which one held the answer; the third held a lone
 * `ContinentBreakdown` after its country pie was deleted as redundant. So the
 * sub-tabs are gone: map, ranked list and city heat map became a three-way
 * toggle inside {@link GeographicMapAndList}, and the continent breakdown and
 * the recommendations stack below it.
 *
 * Renders an optional {@link GeographicFilterBar} on top when
 * `onContinentChange` is provided.
 */
export function GeographicAnalysis({
  linkId,
  enableRealtime = false,
  dateFrom,
  dateTo,
  excludeBots,
  continent,
  onContinentChange,
}: GeographicAnalysisProps) {
  const { t } = useTranslation("analytics");

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const { data, stats, loading, error, refresh } = useGeographicData({
    linkId,
    enableRealtime,
    dateFrom,
    dateTo,
    excludeBots,
    continent,
    refreshInterval: 30000,
  });

  return (
    <Box>
      <AnalyticsStateManager
        loading={loading}
        error={error}
        hasData={!!data}
        skeleton={<GeographicSkeleton />}
        onRetry={refresh}
        loadingMessage={t("geographic.loading")}
        emptyMessage={t("geographic.empty")}
        minHeight={300}
      >
        <Box>
          {/* Filter bar — only rendered when parent supplies the callback */}
          {onContinentChange && (
            <GeographicFilterBar
              continent={continent ?? null}
              onContinentChange={onContinentChange}
            />
          )}

          <Box sx={{ mt: onContinentChange ? 2 : 0 }}>
            <Stack spacing={{ xs: 3, md: 4 }}>
              {/* Map, ranked list and city heat map are one question asked
                  three ways — they share a card and a toggle, not three
                  sub-tabs. */}
              <GeographicMapAndList
                countries={data?.top_countries || []}
                states={data?.top_states || []}
                cities={data?.top_cities || []}
                totalClicks={stats?.totalClicks || 0}
                selectedCountry={selectedCountry}
                onCountrySelect={setSelectedCountry}
                heatmapData={data?.heatmap_data || []}
                stats={stats}
                loading={loading}
                error={error}
                onRefresh={refresh}
              />

              {/* Doubles as the continent filter: clicking a row filters the
                  whole tab server-side. */}
              <ContinentBreakdown
                continents={data?.continents || []}
                activeContinentCode={continent ?? null}
                onContinentSelect={onContinentChange}
              />

              <GeographicInsights
                countries={data?.top_countries || []}
                states={data?.top_states || []}
                cities={data?.top_cities || []}
                totalCountries={stats?.totalCountries}
              />
            </Stack>
          </Box>
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default GeographicAnalysis;
