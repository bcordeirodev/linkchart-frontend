"use client";
import { Stack } from "@mui/material";
import { useMemo, useState } from "react";

import { LinkMetrics } from "@/features/links/components/LinkMetrics";
import {
  LinkCardRich,
  LinksEmptyState,
  LinksFilters,
  LinksHeader,
  LinksMobileCards,
} from "@/features/links/components/list";
import { useLinks, useDeleteLink } from "@/features/links/hooks/useLinks";
import { useLinksMeta } from "@/features/links/hooks/useLinksMeta";
import { getLinkStatus } from "@/features/links/utils/linkStatus";
import { useResponsive } from "@/lib/theme";
import { ResponsiveContainer } from "@/shared/ui/base";
import { LinkListSkeleton } from "@/shared/ui/feedback/skeletons";
import type { LinkResponse } from "@/types";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";

function LinkListPage() {
  const { isMobile } = useResponsive();
  const { links, loading } = useLinks();
  const { mutateAsync: deleteLinkMutation } = useDeleteLink();
  const deleteLink = (id: string): Promise<void> =>
    deleteLinkMutation(id).then(() => undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");

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

  if (loading) {
    return (
      <AuthGuardRedirect auth={["user", "admin"]}>
        <LinkListSkeleton isMobile={isMobile} count={6} />
      </AuthGuardRedirect>
    );
  }

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("created_at");
  };

  return (
    <AuthGuardRedirect auth={["user", "admin"]}>
      <ResponsiveContainer variant="page">
        <LinksHeader />

        <LinkMetrics linksData={links} showTitle={false} />

        <LinksFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {sortedLinks.length === 0 ? (
          <LinksEmptyState
            hasActiveFilters={Boolean(searchTerm) || statusFilter !== "all"}
            onClearFilters={handleClearFilters}
          />
        ) : isMobile ? (
          <LinksMobileCards
            data={sortedLinks}
            meta={meta}
            loading={loading}
            onDelete={deleteLink}
          />
        ) : (
          <Stack spacing={2}>
            {sortedLinks.map((link: LinkResponse) => (
              <LinkCardRich
                key={link.id}
                link={link}
                meta={meta[String(link.id)]}
                onDelete={deleteLink}
              />
            ))}
          </Stack>
        )}
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default LinkListPage;
