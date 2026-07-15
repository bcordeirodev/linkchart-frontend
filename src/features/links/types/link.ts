/**
 * 🔗 TIPOS DE LINKS
 * Re-exporta tipos centrais e adiciona tipos específicos do módulo
 */

import type { LinkResponse, LinkStats } from "@/types";

// ========================================
// 🔗 RE-EXPORTS DOS TIPOS CENTRAIS
// ========================================

export type {
  LinkCreateRequest,
  LinkUpdateRequest,
  LinkResponse,
  LinkStats,
  LinkFilters,
} from "@/types";

// ========================================
// 🎯 TIPOS ESPECÍFICOS DO MÓDULO DE LINKS
// ========================================

export interface LinkAnalytics {
  link: LinkResponse;
  stats: LinkStats;
  geographic_data: {
    country: string;
    clicks: number;
    percentage: number;
  }[];
  device_data: {
    device: string;
    clicks: number;
    percentage: number;
  }[];
  referrer_data: {
    referrer: string;
    clicks: number;
    percentage: number;
  }[];
}

/**
 * Body of `POST /api/links/bulk-action`. `ids` are capped at 50 per request
 * (backend rejects more with 422); ids the caller doesn't own are silently
 * ignored server-side (never surfaced as an error, so ownership isn't leaked).
 */
export interface LinkBulkAction {
  action: "activate" | "deactivate" | "delete";
  ids: number[];
}

/** Response of `POST /api/links/bulk-action` (already unwrapped from `{data}`). */
export interface LinkBulkActionResult {
  /** How many of the requested ids actually belonged to the user and were changed. */
  affected: number;
  /** How many ids were sent in the request. */
  requested: number;
}
