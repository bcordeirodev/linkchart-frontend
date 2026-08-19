export interface SparklinePoint {
  date: string;
  clicks: number;
}

export interface LinkTrend {
  current: number;
  previous: number;
  percent_change: number;
  last_click_at: string | null;
}

export interface LinkPreviewMeta {
  favicon_url: string | null;
  og_title: string | null;
  og_image_url: string | null;
}

export type LinkHealthStatus = "ok" | "error" | "unknown";

export interface LinkHealth {
  status: LinkHealthStatus;
  last_checked_at: string | null;
  http_code: number | null;
}

export type LinkQualityTier = "organic" | "suspicious" | "likely_fraud";

/**
 * Traffic-quality aggregate for a link (30-day window over Phase-3-scored
 * clicks, computed by POST /api/links/batch-meta). Null tier/pct = no scored
 * clicks in the window — the UI hides the indicator entirely.
 */
export interface LinkQuality {
  tier: LinkQualityTier | null;
  organic_pct: number | null;
}

export interface LinkMeta {
  sparkline: SparklinePoint[];
  trend: LinkTrend;
  /**
   * Optional for deploy-order safety: the field ships with backend
   * v2.18+ — a frontend released ahead of the backend must tolerate its
   * absence (treated the same as a null tier).
   */
  quality?: LinkQuality | null;
  preview: LinkPreviewMeta | null;
  health: LinkHealth;
}

export type BatchMetaResponse = Record<string, LinkMeta>;
