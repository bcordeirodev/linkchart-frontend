/**
 * 📊 PUBLIC ANALYTICS TYPES
 * Tipos centralizados para o módulo de analytics públicos
 */

export interface PublicAnalyticsData {
  total_clicks: number;
  created_at: string;
  is_active: boolean;
  short_url: string;
  has_analytics: boolean;
  charts?: {
    geographic?: {
      top_countries?: { country: string; clicks: number }[];
    };
    audience?: {
      device_breakdown?: { device: string; clicks: number }[];
      browser_breakdown?: { browser: string; clicks: number }[];
    };
    temporal?: {
      clicks_by_hour?: { hour: number; clicks: number }[];
      clicks_by_day_of_week?: { day: number; clicks: number }[];
    };
  };
}

export interface PublicLinkData {
  id: number;
  slug: string;
  title: string | null;
  original_url: string;
  short_url: string;
  clicks: number;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
  is_public: boolean;
  has_analytics: boolean;
  domain: string;
}

export interface PublicAnalyticsState {
  linkData: PublicLinkData | null;
  analyticsData: PublicAnalyticsData | null;
  loading: boolean;
  error: string | null;
}

export interface PublicAnalyticsActions {
  handleCopyLink: () => Promise<void>;
  handleCreateLink: () => void;
  handleVisitLink: () => void;
  /**
   * Refetches both public queries (link + analytics) after a failure.
   * Wired to the "try again" button in `ErrorState`.
   */
  handleRetry: () => void;
}
