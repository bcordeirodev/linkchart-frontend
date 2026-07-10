"use client";

import { BarChart3, HelpCircle } from "lucide-react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { LinkMetrics } from "@/features/links/components/LinkMetrics";
import {
  LinksBrowseSection,
  LinksListSectionHeading,
  LinksQuickCreate,
} from "@/features/links/components/list";
import { useLinksTour } from "@/features/links/onboarding/useLinksTour";
import { useLinks, useDeleteLink } from "@/features/links/hooks/useLinks";
import { useNewlyCreatedLinkHighlight } from "@/features/links/hooks/useNewlyCreatedLinkHighlight";
import { useLinksMeta } from "@/features/links/hooks/useLinksMeta";
import { getLinkStatus } from "@/features/links/utils/linkStatus";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useResponsive } from "@/lib/theme";
import { ResponsiveContainer } from "@/shared/ui/base";
import { LinkListSkeleton } from "@/shared/ui/feedback/skeletons";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";

import type { LinkResponse } from "@/types";

function LinkListPage() {
  const { isMobile } = useResponsive();
  const { t } = useTranslation("links");
  const { links, loading } = useLinks();
  const tour = useLinksTour({ ready: !loading && links.length > 0 });
  const { mutateAsync: deleteLinkMutation } = useDeleteLink();
  const deleteLink = (id: string): Promise<void> =>
    deleteLinkMutation(id).then(() => undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");

  const hasActiveFilters = Boolean(searchTerm) || statusFilter !== "all";

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchesSearch =
        link.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (link.slug || link.custom_slug)
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const status = getLinkStatus(link);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && status === "active") ||
        (statusFilter === "inactive" && status === "inactive") ||
        (statusFilter === "scheduled" && status === "scheduled") ||
        (statusFilter === "expired" && status === "expired");

      return matchesSearch && matchesStatus;
    });
  }, [links, searchTerm, statusFilter]);

  const linkIds = useMemo(
    () => filteredLinks.map((l) => String(l.id)),
    [filteredLinks],
  );
  const { meta } = useLinksMeta(linkIds);

  const sortedLinks = useMemo(() => {
    const sorted = [...filteredLinks];
    switch (sortBy) {
      case "clicks":
        return sorted.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      case "trend":
        return sorted.sort(
          (a, b) =>
            (meta[String(b.id)]?.trend?.percent_change ?? 0) -
            (meta[String(a.id)]?.trend?.percent_change ?? 0),
        );
      case "last_activity":
        return sorted.sort((a, b) => {
          const aLast = meta[String(a.id)]?.trend?.last_click_at;
          const bLast = meta[String(b.id)]?.trend?.last_click_at;

          if (!aLast && !bLast) {
            return 0;
          }

          if (!aLast) {
            return 1;
          }

          if (!bLast) {
            return -1;
          }

          return new Date(bLast).getTime() - new Date(aLast).getTime();
        });
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
    }
  }, [filteredLinks, sortBy, meta]);

  const visibleLinkIds = useMemo(
    () => sortedLinks.map((l) => String(l.id)),
    [sortedLinks],
  );
  const { highlightedLinkId, highlightLink } =
    useNewlyCreatedLinkHighlight(visibleLinkIds);

  const handleLinkCreated = useCallback(
    (link: LinkResponse) => {
      setSortBy("created_at");
      highlightLink(link);
    },
    [highlightLink],
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("created_at");
  };

  if (loading) {
    return (
      <AuthGuardRedirect
        auth={["user", "admin"]}
        fallback={<LinkListSkeleton isMobile={isMobile} count={6} />}
      >
        <LinkListSkeleton isMobile={isMobile} count={6} />
      </AuthGuardRedirect>
    );
  }

  return (
    <AuthGuardRedirect
      auth={["user", "admin"]}
      fallback={<LinkListSkeleton isMobile={isMobile} count={6} />}
    >
      {/* Cap acima do default (1440): com o grid de 2 colunas a largura extra
          vira aproveitamento real, não linhas quilométricas. */}
      <ResponsiveContainer variant="page" sx={{ maxWidth: 1600 }}>
        <Stack spacing={{ xs: 2.5, sm: 3 }} component="section">
          <Box component="div">
            <LinksListSectionHeading
              icon={<BarChart3 {...ICON_MD} />}
              title={t("list.heading")}
              description={t("list.pageSubtitle")}
              titleVariant="page"
              sx={{ mb: { xs: 1.5, sm: 2 } }}
              action={
                <Button
                  size="small"
                  variant="text"
                  startIcon={<HelpCircle width={16} height={16} />}
                  onClick={tour.start}
                >
                  {t("list.onboarding.help")}
                </Button>
              }
            />
            {links.length > 0 ? (
              <Box data-tour="overview" sx={{ mt: { xs: 2, sm: 2.5 } }}>
                <Typography
                  variant="overline"
                  component="h2"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    mb: { xs: 1, sm: 1.25 },
                  }}
                >
                  {t("list.sections.overview")}
                </Typography>
                <LinkMetrics linksData={links} showTitle={false} />
              </Box>
            ) : null}
          </Box>

          <Box data-tour="quick-create">
            <LinksQuickCreate onLinkCreated={handleLinkCreated} />
          </Box>

          <Box data-tour="links-list">
            <LinksBrowseSection
              highlightedLinkId={highlightedLinkId}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortedLinks={sortedLinks}
              meta={meta}
              loading={loading}
              isMobile={isMobile}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
              onDelete={deleteLink}
            />
          </Box>
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default LinkListPage;
