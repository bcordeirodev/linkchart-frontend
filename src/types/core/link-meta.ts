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

export interface LinkMeta {
  sparkline: SparklinePoint[];
  trend: LinkTrend;
  preview: LinkPreviewMeta | null;
  health: LinkHealth;
}

export type BatchMetaResponse = Record<string, LinkMeta>;
