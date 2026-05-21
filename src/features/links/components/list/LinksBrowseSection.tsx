"use client";

import { Link2 } from "lucide-react";
import { Box, Divider, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import { LinkCardRich } from "./LinkCardRich";
import { LinksEmptyState } from "./LinksEmptyState";
import { LinksFilters } from "./LinksFilters";
import { LinksListSectionHeading } from "./LinksListSectionHeading";
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

  const count = sortedLinks.length;
  const description = hasActiveFilters
    ? t("list.sections.linksFiltered", { count })
    : t("list.sections.linksBrowseDescription", { count });

  return (
    <EnhancedPaper variant="outlined" animated={false} sx={getLinksPanelSx(theme)}>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <LinksListSectionHeading
          icon={<Link2 {...ICON_MD} />}
          title={t("list.sections.links")}
          description={description}
          iconSize={21}
        />

        <LinksFilters
          embedded
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusChange={onStatusChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />

        <Divider sx={{ my: 2 }} />

        {count === 0 ? (
          <LinksEmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={onClearFilters}
          />
        ) : isMobile ? (
          <LinksMobileCards
            data={sortedLinks}
            meta={meta}
            loading={loading}
            onDelete={onDelete}
            highlightedLinkId={highlightedLinkId}
          />
        ) : (
          <Stack spacing={1}>
            {sortedLinks.map((link) => (
              <LinkCardRich
                key={link.id}
                link={link}
                meta={meta[String(link.id)]}
                onDelete={onDelete}
                isHighlighted={String(link.id) === highlightedLinkId}
              />
            ))}
          </Stack>
        )}
      </Box>
    </EnhancedPaper>
  );
}

export default LinksBrowseSection;
