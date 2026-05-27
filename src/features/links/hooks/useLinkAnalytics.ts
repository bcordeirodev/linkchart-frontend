"use client";
import { useCallback, useEffect, useState } from "react";

import { linkService } from "@/services";

import type { LinkAnalyticsData } from "../types/analytics";
import type { LinkResponse } from "@/types";

interface UseLinkAnalyticsReturn {
  data: LinkAnalyticsData | null; // Tipos específicos para analytics
  linkInfo: LinkResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Loads basic link info and returns a minimal `LinkAnalyticsData` shell for legacy consumers.
 *
 * @param linkId - canonical link id
 * @returns `{ data: LinkAnalyticsData | null, linkInfo, loading, error, refetch }`
 *
 * @remarks
 * Endpoint: `GET /api/links/{id}` (via `linkService.findOne()`); detailed analytics are loaded by tab-specific hooks (`useTemporalData`, `useGeographicData`, `useAudienceData`, `useInsightsData`).
 * The returned `data.overview.unique_visitors`/`avg_daily_clicks` are estimates derived from `linkInfo.clicks` and exist purely for backwards compatibility with the pre-split analytics shape.
 * Does not use TanStack Query — keeps a local `useState`/`useEffect` flow.
 */
export function useLinkAnalyticsOptimized(
  linkId: string,
): UseLinkAnalyticsReturn {
  const [linkInfo, setLinkInfo] = useState<LinkResponse | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkLoading, setLinkLoading] = useState(true);

  // Dados básicos do analytics - estrutura mínima para compatibilidade
  // Os dados detalhados são carregados pelos hooks individuais de cada tab
  const [analyticsData, setAnalyticsData] = useState<LinkAnalyticsData | null>(
    null,
  );

  // Busca dados específicos do link
  const fetchLinkInfo = useCallback(async () => {
    try {
      setLinkLoading(true);
      setLinkError(null);

      const link = await linkService.findOne(linkId);
      setLinkInfo(link);
    } catch (err) {
      setLinkError("Erro ao carregar informações do link");
      console.error("Erro ao buscar link:", err);
    } finally {
      setLinkLoading(false);
    }
  }, [linkId]);

  const refetch = useCallback(async () => {
    await fetchLinkInfo();
    // Analytics são refetchados individualmente por cada hook de tab
  }, [fetchLinkInfo]);

  useEffect(() => {
    fetchLinkInfo();
  }, [fetchLinkInfo]);

  // Criar dados básicos para compatibilidade
  useEffect(() => {
    if (linkInfo) {
      setAnalyticsData({
        has_data: true,
        link_info: linkInfo,
        // Dados detalhados são carregados pelos hooks individuais
        overview: {
          total_clicks: linkInfo.clicks || 0,
          unique_visitors: 0, // real value loaded by useDashboardData
          avg_daily_clicks: 0, // real value loaded by useDashboardData
          conversion_rate: 0,
          countries_reached: 0,
          bounce_rate: 0,
          peak_hour: "--:--",
        },
        geographic: {
          top_countries: [],
          top_states: [],
          top_cities: [],
          heatmap_data: [],
        },
        temporal: {
          clicks_by_hour: [],
          clicks_by_day_of_week: [],
        },
        audience: {
          device_breakdown: [],
        },
        insights: [],
      } as LinkAnalyticsData);
    } else {
      // Limpar dados quando não há linkInfo
      setAnalyticsData(null);
    }
  }, [linkInfo]);

  return {
    data: analyticsData,
    linkInfo,
    loading: linkLoading, // Apenas loading do link
    error: linkError, // Apenas erro do link
    refetch,
  };
}

export default useLinkAnalyticsOptimized;
