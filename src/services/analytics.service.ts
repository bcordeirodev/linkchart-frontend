import { API_CONFIG } from "../lib/api/endpoints";

import { BaseService } from "./base.service";

import type { AnalyticsData, HeatmapPoint } from "@/types";
import type { GeographicData } from "@/types/analytics/geographic";
import type { BusinessInsight, InsightsData } from "@/types/analytics/insights";

/**
 * Serviço para operações de Analytics
 *
 * Centraliza todas as chamadas relacionadas a:
 * - Analytics gerais
 * - Métricas de performance
 * - Analytics de links específicos
 * - Dados de dashboard
 */
export default class AnalyticsService extends BaseService {
  constructor() {
    super("AnalyticsService");
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const fallbackData: AnalyticsData = {
      overview: {
        total_clicks: 0,
        unique_visitors: 0,
        countries_reached: 0,
        avg_daily_clicks: 0,
      },
      geographic: {
        heatmap_data: [],
        top_countries: [],
        top_states: [],
        top_cities: [],
      },
      temporal: {
        clicks_by_hour: [],
        clicks_by_day_of_week: [],
      },
      audience: {
        device_breakdown: [],
      },
      insights: [],
    };

    return this.get<AnalyticsData>(API_CONFIG.ENDPOINTS.ANALYTICS, {
      fallback: fallbackData,
      context: "get_analytics",
    });
  }

  /**
   * Busca analytics de um link específico
   */
  async getLinkAnalytics(linkId: string): Promise<AnalyticsData> {
    this.validateId(linkId, "Link ID");

    const endpoint = API_CONFIG.ENDPOINTS.LINK_ANALYTICS(linkId);

    const fallbackData: AnalyticsData = {
      overview: {
        total_clicks: 0,
        unique_visitors: 0,
        countries_reached: 0,
        avg_daily_clicks: 0,
      },
      geographic: {
        heatmap_data: [],
        top_countries: [],
        top_states: [],
        top_cities: [],
      },
      temporal: {
        clicks_by_hour: [],
        clicks_by_day_of_week: [],
      },
      audience: {
        device_breakdown: [],
      },
      insights: [],
    };

    return this.get<AnalyticsData>(endpoint, {
      fallback: fallbackData,
      context: "get_link_analytics",
    });
  }

  /**
   * Busca dados geográficos de um link
   */
  async getLinkGeographicData(linkId: string): Promise<GeographicData | null> {
    this.validateId(linkId, "Link ID");

    const endpoint = API_CONFIG.ENDPOINTS.ANALYTICS_GEOGRAPHIC(linkId);

    return this.get<GeographicData | null>(endpoint, {
      fallback: null,
      context: "get_link_geographic",
    });
  }

  /**
   * Busca heatmap de um link
   */
  async getLinkHeatmap(linkId: string): Promise<HeatmapPoint[] | null> {
    this.validateId(linkId, "Link ID");

    const endpoint = API_CONFIG.ENDPOINTS.ANALYTICS_HEATMAP(linkId);

    return this.get<HeatmapPoint[] | null>(endpoint, {
      fallback: null,
      context: "get_link_heatmap",
    });
  }

  /**
   * Busca insights de negócio de um link
   */
  async getLinkInsights(
    linkId: string,
  ): Promise<InsightsData | BusinessInsight[] | null> {
    this.validateId(linkId, "Link ID");

    const endpoint = API_CONFIG.ENDPOINTS.ANALYTICS_INSIGHTS(linkId);

    return this.get<InsightsData | BusinessInsight[] | null>(endpoint, {
      fallback: null,
      context: "get_link_insights",
    });
  }
}

// Instância singleton do serviço
export const analyticsService = new AnalyticsService();
