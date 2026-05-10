import { API_CONFIG } from "../lib/api/endpoints";

import { BaseService } from "./base.service";

import type { AnalyticsData } from "@/types";
import type { GeographicData } from "@/types/analytics/geographic";
import type { BusinessInsight, InsightsData } from "@/types/analytics/insights";

/**
 * REST client for `/api/analytics` and the per-link analytics endpoints.
 *
 * Wraps `BaseService` and inherits envelope unwrap + JWT injection from `ApiClient`.
 * Most methods provide a fully shaped fallback so analytics widgets render placeholder
 * skeletons instead of throwing on partial backend outages.
 */
export default class AnalyticsService extends BaseService {
  constructor() {
    super("AnalyticsService");
  }

  /**
   * Returns the global analytics dashboard for the authenticated user.
   *
   * @returns aggregated `AnalyticsData`; falls back to an empty shell on error.
   * @endpoint `GET /api/analytics`
   */
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
   * Returns the analytics payload for a single link.
   *
   * @param linkId - canonical link id.
   * @returns aggregated `AnalyticsData`; falls back to an empty shell on error.
   * @endpoint `GET /api/links/{id}/analytics`
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
   * Returns geographic breakdown (countries / states / cities / heatmap) for a link.
   *
   * @param linkId - canonical link id.
   * @returns `GeographicData` or `null` when the backend has no data yet.
   * @endpoint `GET /api/analytics/link/{id}/geographic`
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
   * Returns the AI/business insights payload for a link.
   *
   * @param linkId - canonical link id.
   * @returns `InsightsData`, an array of `BusinessInsight`, or `null` if unavailable.
   * @endpoint `GET /api/analytics/link/{id}/insights`
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
