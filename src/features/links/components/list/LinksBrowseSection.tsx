"use client";

import { Link2 } from "lucide-react";
import { Box, Divider, Pagination, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useLinkDensity } from "@/features/links/hooks/useLinkDensity";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

/** Links shown per page in the browse list (client-side pagination). */
const PAGE_SIZE = 8;

import { LinkCardRich } from "./LinkCardRich";
import { LinksEmptyState } from "./LinksEmptyState";
import { LinksFilters } from "./LinksFilters";
import { LinksMobileCards } from "./LinksMobileCards";
import { getLinksPanelSx } from "./linksPanelStyles";

import type { BatchMetaResponse, LinkResponse } from "@/types";

interface LinksBrowseSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  sortedLinks: LinkResponse[];
  meta: BatchMetaResponse;
  loading: boolean;
  isMobile: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onDelete: (id: string) => Promise<void>;
  highlightedLinkId?: string | null;
}

/**
 * Filters + link list in one card so users see filters apply to the list below.
 *
 * The big "Meus links" section title is intentionally omitted — the page-level
 * `PageSectionHeading` already carries that heading.  Only the count/context
 * caption (icon + description row) is rendered here.
 */
export function LinksBrowseSection({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  sortedLinks,
  meta,
  loading,
  isMobile,
  hasActiveFilters,
  onClearFilters,
  onDelete,
  highlightedLinkId = null,
}: LinksBrowseSectionProps) {
  const theme = useTheme();
  const { t } = useTranslation("links");
  const { density, setDensity } = useLinkDensity();

  const count = sortedLinks.length;
  const description = hasActiveFilters
    ? t("list.sections.linksFiltered", { count })
    : t("list.sections.linksBrowseDescription", { count });

  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  // Jump back to page 1 whenever the result set changes (search/filter/sort) or
  // a freshly created link needs to be revealed at the top.
  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, sortBy, highlightedLinkId]);

  // Clamp the page if it falls out of range (e.g. after deleting the last item
  // on the final page).
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageLinks = useMemo(
    () => sortedLinks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedLinks, page],
  );

  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, next: number) => {
      setPage(next);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [],
  );

  const showPagination = count > PAGE_SIZE;
  const rangeStart = (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, count);

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={getLinksPanelSx(theme)}
    >
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box ref={topRef} sx={{ scrollMarginTop: { xs: 64, sm: 80 } }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1.75,
            color: "text.secondary",
          }}
        >
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              flexShrink: 0,
              "& svg": { width: 21, height: 21 },
            }}
          >
            <Link2 {...ICON_MD} />
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.75rem", lineHeight: 1.4 }}
          >
            {description}
          </Typography>
        </Box>

        <LinksFilters
          embedded
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusChange={onStatusChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          density={density}
          onDensityChange={setDensity}
          showDensityToggle={!isMobile}
        />

        <Divider sx={{ my: 2 }} />

        {count === 0 ? (
          <LinksEmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={onClearFilters}
          />
        ) : (
          <>
            {isMobile ? (
              <LinksMobileCards
                data={pageLinks}
                meta={meta}
                loading={loading}
                onDelete={onDelete}
                highlightedLinkId={highlightedLinkId}
              />
            ) : (
              <Stack spacing={0}>
                {pageLinks.map((link) => (
                  <LinkCardRich
                    key={link.id}
                    link={link}
                    meta={meta[String(link.id)]}
                    onDelete={onDelete}
                    isHighlighted={String(link.id) === highlightedLinkId}
                    density={density}
                  />
                ))}
              </Stack>
            )}

            {showPagination ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                  mt: 2,
                  pt: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.75rem" }}
                >
                  {t("list.pagination.showing", {
                    from: rangeStart,
                    to: rangeEnd,
                    total: count,
                  })}
                </Typography>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size="small"
                  siblingCount={isMobile ? 0 : 1}
                />
              </Box>
            ) : null}
          </>
        )}
      </Box>
    </EnhancedPaper>
  );
}

export default LinksBrowseSection;
