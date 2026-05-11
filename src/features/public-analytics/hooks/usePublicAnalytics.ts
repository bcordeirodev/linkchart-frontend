"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";
import { publicLinkService } from "@/services/link-public.service";
import { useNavigate } from "@/shared/hooks";

import type {
  PublicAnalyticsData,
  PublicLinkData,
  PublicAnalyticsState,
  PublicAnalyticsActions,
} from "../types";

interface UsePublicAnalyticsProps {
  slug: string | undefined;
}

interface UsePublicAnalyticsReturn
  extends PublicAnalyticsState,
    PublicAnalyticsActions {
  debugInfo: string;
}

/**
 * Loads the public-analytics page payload for a shared `/{slug}/analytics` page.
 *
 * @param options.slug - link slug from the URL; both queries stay disabled when falsy
 * @returns `PublicAnalyticsState & PublicAnalyticsActions & { debugInfo }`
 *
 * @remarks
 * Runs two parallel queries:
 * - `queryKeys.analytics.publicLink(slug)` → `GET /api/public/links/{slug}` (`API_CONFIG.ENDPOINTS.PUBLIC.LINK_BY_SLUG`)
 * - `queryKeys.analytics.public(slug)` → `GET /api/public/links/{slug}/analytics` (`API_CONFIG.ENDPOINTS.PUBLIC.ANALYTICS`)
 * Stale time on both: `API_CONFIG.CACHE.ANALYTICS_TTL`.
 * Error messages are translated via the `public` i18n namespace.
 * Action handlers (`handleCopyLink`, `handleVisitLink`, `handleCreateLink`) are stable closures that read the latest `linkData`.
 */
export function usePublicAnalytics({
  slug,
}: UsePublicAnalyticsProps): UsePublicAnalyticsReturn {
  const navigate = useNavigate();
  const { t } = useTranslation("public");

  const linkQuery = useQuery<PublicLinkData>({
    queryKey: queryKeys.analytics.publicLink(slug ?? ""),
    queryFn: () =>
      api.get<PublicLinkData>(
        API_CONFIG.ENDPOINTS.PUBLIC.LINK_BY_SLUG(slug ?? ""),
      ),
    staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
    enabled: !!slug,
  });

  const analyticsQuery = useQuery<PublicAnalyticsData>({
    queryKey: queryKeys.analytics.public(slug ?? ""),
    queryFn: () =>
      api.get<PublicAnalyticsData>(
        API_CONFIG.ENDPOINTS.PUBLIC.ANALYTICS(slug ?? ""),
      ),
    staleTime: API_CONFIG.CACHE.ANALYTICS_TTL,
    enabled: !!slug,
  });

  const linkData = linkQuery.data ?? null;
  const analyticsData = analyticsQuery.data ?? null;
  const loading = linkQuery.isLoading || analyticsQuery.isLoading;

  let error: string | null = null;
  if (!slug) {
    error = t("publicAnalytics.error.slugMissing");
  } else if (linkQuery.error) {
    error =
      (linkQuery.error as Error).message ??
      t("publicAnalytics.error.loadFailed");
  } else if (analyticsQuery.error) {
    error =
      (analyticsQuery.error as Error).message ??
      t("publicAnalytics.error.loadFailed");
  } else if (!loading && linkData && !linkData.slug) {
    error = t("publicAnalytics.error.invalidLinkData");
  }

  const debugInfo =
    linkData && analyticsData
      ? `Dados carregados: Link ID ${linkData.id}, Slug ${linkData.slug}, Clicks ${analyticsData.total_clicks}`
      : "";

  const handleCopyLink = async (): Promise<void> => {
    if (linkData?.short_url) {
      await publicLinkService.copyToClipboard(linkData.short_url);
    }
  };

  const handleCreateLink = (): void => {
    navigate("/shorter");
  };

  const handleVisitLink = (): void => {
    if (linkData?.original_url) {
      window.open(linkData.original_url, "_blank");
    }
  };

  return {
    linkData,
    analyticsData,
    loading,
    error,
    debugInfo,
    handleCopyLink,
    handleCreateLink,
    handleVisitLink,
  };
}
