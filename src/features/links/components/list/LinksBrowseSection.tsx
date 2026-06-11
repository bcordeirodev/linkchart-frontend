"use client";

import { Link2 } from "lucide-react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

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

  const count = sortedLinks.length;
  const description = hasActiveFilters
    ? t("list.sections.linksFiltered", { count })
    : t("list.sections.linksBrowseDescription", { count });

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={getLinksPanelSx(theme)}
    >
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
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
            sx={{ display: "inline-flex", flexShrink: 0, "& svg": { width: 21, height: 21 } }}
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
          <Stack spacing={0}>
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
