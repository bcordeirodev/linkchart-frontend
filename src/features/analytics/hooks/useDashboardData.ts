"use client";
/**
 * 📊 USE DASHBOARD DATA - Hook para Dados do Dashboard
 *
 * @description
 * Hook customizado para gerenciar dados do dashboard com métricas agregadas,
 * suporte a tempo real e validação de dados.
 *
 * Usa TanStack Query para cache compartilhado, deduplicação de requisições e
 * refetch automático em background — consistente com os demais hooks de analytics.
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { API_CONFIG } from "@/lib/api/endpoints";
import { queryKeys } from "@/lib/query/keys";

import type {
  ActivityData,
  DashboardData,
  DashboardLink,
  DashboardStats,
  DashboardSummary,
  DeviceSummary,
  GeographicSummary,
  UseDashboardDataOptions,
  UseDashboardDataReturn,
} from "@/types/analytics/dashboard";

/**
 * Fetches the dashboard payload for a given link, with optional polling.
 *
 * @param options.linkId - canonical link id; the query stays disabled when undefined/empty
 * @param options.dateFrom - ISO date string (yyyy-MM-dd) for the start of the period
 * @param options.dateTo - ISO date string (yyyy-MM-dd) for the end of the period
 * @param options.excludeBots - when true, adds `exclude_bots=true` to the request
 * @param options.refreshInterval - polling interval in ms when `enableRealtime` is true (default `60000`)
 * @param options.enableRealtime - when true, polls every `refreshInterval` ms (default `false`)
 * @returns `{ data: DashboardData | null, stats, loading, error, refresh, isRealtime }`
 *
 * @remarks
 * Endpoint: `GET /api/analytics/link/{id}/dashboard?include_charts=true[&date_from=…][&date_to=…][&exclude_bots=true]`
 * (constant: `API_CONFIG.ENDPOINTS.ANALYTICS_DASHBOARD`).
 *
 * Cache key: `queryKeys.analytics.dashboard(linkId)` + filter params for cache isolation.
 * Uses TanStack Query v5 for shared cache, request deduplication and background refetch —
 * consistent with the geographic, temporal, audience and insights hooks.
 */
export function useDashboardData({
  linkId,
  refreshInterval = 60000,
  enableRealtime = false,
  dateFrom,
  dateTo,
  excludeBots = false,
}: UseDashboardDataOptions = {}): UseDashboardDataReturn {
  const {
    data: rawData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      ...queryKeys.analytics.dashboard(linkId ?? ""),
      { dateFrom, dateTo, excludeBots },
    ],
    queryFn: async (): Promise<ApiResponse> => {
      const params = new URLSearchParams({ include_charts: "true" });
      if (dateFrom) params.set("date_from", dateFrom);
      if (dateTo) params.set("date_to", dateTo);
      if (excludeBots) params.set("exclude_bots", "true");

      const endpoint = API_CONFIG.ENDPOINTS.ANALYTICS_DASHBOARD(linkId!);
      const qs = params.toString();
      const fullEndpoint = qs ? `${endpoint}?${qs}` : endpoint;

      const response = await api.get<ApiResponse>(fullEndpoint);

      if (!response) {
        throw new Error("Dados do dashboard não encontrados");
      }

      return response;
    },
    staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
    refetchInterval: enableRealtime ? refreshInterval : false,
    enabled: !!linkId,
  });

  const data = useMemo(
    () => (rawData ? mapResponseToDashboardData(rawData) : null),
    [rawData],
  );

  const stats = useMemo(() => (data ? calculateStats(data) : null), [data]);

  return {
    data,
    stats,
    loading: isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : "Erro ao carregar dados do dashboard"
      : null,
    // Wrap refetch so the return shape matches UseDashboardDataReturn's `() => Promise<void>`
    refresh: () => refetch().then(() => undefined),
    isRealtime: enableRealtime,
  };
}

// ============================================
// Utilitários Internos
// ============================================

/**
 * Tipo da resposta da API
 */
interface ApiResponseData {
  summary?: DashboardSummary;
  top_links?: DashboardLink[];
  recent_activity?: ActivityData[];
  temporal_data?: DashboardData["temporal_data"];
  geographic_data?: DashboardData["geographic_data"];
  audience_data?: DashboardData["audience_data"];
  link_info?: DashboardData["link_info"];
}

/** Shape of the metrics field returned by the dashboard API endpoint. */
interface ApiMetrics {
  dashboard?: DashboardSummary;
  geographic?: GeographicSummary;
  audience?: {
    device_types?: Partial<DeviceSummary>;
  };
}

/** Shape of the charts field returned by the dashboard API endpoint. */
interface ApiCharts {
  temporal?: DashboardData["temporal_data"];
  geographic?: DashboardData["geographic_data"];
  audience?: DashboardData["audience_data"];
}

// Shape que chega ao hook pós-Onda-0: payload direto do AnalyticsController,
// sem envelope {success, data}. Mantém campos legados (metrics/charts) apenas
// por compatibilidade com respostas antigas de cache.
/** Full API response envelope for the dashboard endpoint. */
interface ApiResponse extends ApiResponseData {
  metrics?: ApiMetrics;
  charts?: ApiCharts;
  timeframe?: string;
}

/**
 * Mapeia resposta da API para DashboardData.
 *
 * Após Onda 0, o client já desembrulha o envelope { data }, então `response`
 * aqui é o payload direto do AnalyticsController@getLinkDashboardAnalytics:
 * { summary, link_info, temporal_data, geographic_data, audience_data, ... }.
 */
function mapResponseToDashboardData(response: ApiResponse): DashboardData {
  const defaultSummary: DashboardSummary = {
    total_links: 0,
    active_links: 0,
    total_clicks: 0,
    unique_visitors: 0,
    avg_clicks_per_link: 0,
    avg_response_time: 0,
    countries_reached: 0,
    links_with_traffic: 0,
  };

  return {
    summary: response.summary || defaultSummary,
    top_links: response.top_links || [],
    recent_activity: response.recent_activity || [],
    geographic_summary: {
      countries_reached: response.summary?.countries_reached || 0,
      cities_reached: 0,
      top_country: response.geographic_data?.top_countries?.[0]?.country,
      top_country_clicks:
        response.geographic_data?.top_countries?.[0]?.clicks || 0,
      coverage_percentage: 0,
    },
    device_summary: {
      desktop:
        response.audience_data?.device_breakdown?.find(
          (d) => d.device === "Desktop",
        )?.clicks || 0,
      mobile:
        response.audience_data?.device_breakdown?.find(
          (d) => d.device === "Mobile",
        )?.clicks || 0,
      tablet:
        response.audience_data?.device_breakdown?.find(
          (d) => d.device === "Tablet",
        )?.clicks || 0,
      total: response.summary?.total_clicks || 0,
      mobile_percentage: 0,
    },
    performance_indicators: [],
    temporal_data: response.temporal_data,
    geographic_data: response.geographic_data,
    audience_data: response.audience_data,
    link_info: response.link_info,
  };
}

/**
 * Derives dashboard summary stats from `DashboardData`, including a coarse
 * `dataQuality` tier (`excellent`/`good`/`fair`/`poor`) bucketed by total
 * clicks so the UI can adapt empty/sparse states without per-component checks.
 */
function calculateStats(data: DashboardData): DashboardStats {
  const totalClicks = data.summary.total_clicks || 0;

  let dataQuality: "excellent" | "good" | "fair" | "poor";

  if (totalClicks > 100) {
    dataQuality = "excellent";
  } else if (totalClicks > 10) {
    dataQuality = "good";
  } else if (totalClicks > 0) {
    dataQuality = "fair";
  } else {
    dataQuality = "poor";
  }

  return {
    totalMetrics: Object.keys(data.summary).length,
    lastUpdate: new Date().toISOString(),
    dataQuality,
    trendsAvailable: (data.recent_activity?.length || 0) > 0,
    alertsCount: 0,
    recommendationsCount: 0,
  };
}

export default useDashboardData;
