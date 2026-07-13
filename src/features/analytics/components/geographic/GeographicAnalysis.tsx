"use client";
import { useState } from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useResponsive } from "@/lib/theme";

import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import { useGeographicData } from "../../hooks/useGeographicData";

import { ContinentBreakdown } from "./ContinentBreakdown";
import { CountryDistributionChart } from "./CountryDistributionChart";
import { GeographicFilterBar } from "./GeographicFilterBar";
import { GeographicInsights } from "./GeographicInsights";
import { GeographicMapAndList, RealTimeHeatmapChart } from "./index";

/**
 * Loading skeleton that mirrors the flattened Geographic tab layout:
 * filter bar → map/list card → continent + country breakdown row →
 * recommendations → city heat map.
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

      <Stack spacing={{ xs: 3, md: 4 }}>
        {/* Mapa/Lista — header + toggle + map area */}
        <Box>
          <Skeleton
            variant="rounded"
            animation="wave"
            height={40}
            sx={{ mb: 2, borderRadius: 2, maxWidth: 320 }}
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            height={360}
            sx={{ borderRadius: 2 }}
          />
        </Box>

        {/* Continentes + países */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 2, md: 3 },
          }}
        >
          <Skeleton
            variant="rounded"
            animation="wave"
            height={220}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            height={220}
            sx={{ borderRadius: 2 }}
          />
        </Box>

        {/* Recomendações */}
        <Skeleton
          variant="rounded"
          animation="wave"
          height={230}
          sx={{ borderRadius: 2 }}
        />

        {/* Mapa de calor por cidade */}
        <Skeleton
          variant="rounded"
          animation="wave"
          height={400}
          sx={{ borderRadius: 2 }}
        />
      </Stack>
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
 * "Lugares" tab — answers "where is my audience?" in stacked, scrollable
 * sections (not sub-tabs): Mapa/Lista → Continentes e países →
 * Recomendações → Mapa de calor por cidade.
 *
 * Renders an optional {@link GeographicFilterBar} when `onContinentChange` is
 * provided.
 *
 * The city heat map ({@link RealTimeHeatmapChart}) is deliberately last —
 * it is the heaviest section (Leaflet + tile layers) and, from Phase 3
 * onward, moves behind the "Advanced" mode toggle.
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
  const { isMobile } = useResponsive();

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

  // CountryDistributionChart renders `null` when there are no countries, so the
  // continent/country row collapses to a single column instead of leaving an
  // empty grid cell next to ContinentBreakdown (which always renders — it has
  // its own empty state).
  const hasCountryDist = (data?.top_countries?.length ?? 0) > 0;

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

          <Stack
            spacing={{ xs: 3, md: 4 }}
            sx={{ mt: onContinentChange ? 2 : 0 }}
          >
            {/* 1. Mapa e lista — mesma pergunta, duas visualizações */}
            <GeographicMapAndList
              countries={data?.top_countries || []}
              states={data?.top_states || []}
              cities={data?.top_cities || []}
              totalClicks={stats?.totalClicks || 0}
              selectedCountry={selectedCountry}
              onCountrySelect={setSelectedCountry}
            />

            {/* 2. Continentes e países */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: hasCountryDist ? "1fr 1fr" : "1fr",
                },
                gap: { xs: 2, md: 3 },
              }}
            >
              <ContinentBreakdown
                continents={data?.continents || []}
                activeContinentCode={continent ?? null}
              />
              <CountryDistributionChart countries={data?.top_countries || []} />
            </Box>

            {/* 3. Recomendações */}
            <GeographicInsights
              countries={data?.top_countries || []}
              states={data?.top_states || []}
              cities={data?.top_cities || []}
              totalCountries={stats?.totalCountries}
            />

            {/* 4. Mapa de calor por cidade — mais pesado, sempre por último.
                Height is capped on mobile, but tall enough to clear the
                header block (title + banner + filter + legend), which alone
                runs ~520-530px at phone widths — a shorter cap leaves zero
                room for the actual map and collapses it to invisible. */}
            <RealTimeHeatmapChart
              data={data?.heatmap_data || []}
              loading={loading}
              error={error}
              onRefresh={refresh}
              height={isMobile ? 760 : 700}
              title={t("geographic.heatmap.titleDefault")}
              showControls
              showStats={false}
              stats={stats}
            />
          </Stack>
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default GeographicAnalysis;
