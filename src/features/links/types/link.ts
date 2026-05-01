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

export interface LinkBulkAction {
  action: "activate" | "deactivate" | "delete";
  link_ids: number[];
}
