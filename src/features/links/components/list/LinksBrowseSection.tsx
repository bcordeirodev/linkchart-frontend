"use client";

import { CheckSquare } from "lucide-react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useBulkActions } from "@/features/links/hooks/useBulkActions";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import { BulkActionsBar } from "./BulkActionsBar";
import { LinkCardRich } from "./LinkCardRich";
import { LinksDemoSeedingState } from "./LinksDemoSeedingState";
import { LinksEmptyState } from "./LinksEmptyState";
import { LinksFilters } from "./LinksFilters";
import { LinksMobileCards } from "./LinksMobileCards";
import { LinksListSectionHeading } from "./LinksListSectionHeading";
import {
  getLinksPanelSx,
  getLinksBorderColor,
  getLinksBrowseGridSx,
  getLinkCardShellSx,
} from "./linksPanelStyles";

import type { LinksMeta } from "@/lib/query/keys";
import type { BatchMetaResponse, LinkResponse } from "@/types";

/**
 * Links requested per page from the server (`per_page` query param).
 *
 * Kept at 8 (rather than the backend's own default of 12) to preserve the
 * pagination density/UX this list already had under client-side slicing —
 * the grid's stagger animation and column layout were tuned around this number.
 */
export const LINKS_PAGE_SIZE = 8;

interface LinksBrowseSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  /** Current page's links, already filtered/sorted/paginated server-side (and tag-filtered client-side by the caller). */
  links: LinkResponse[];
  /** Server pagination metadata for the *unfiltered-by-tag* result set (see caller for the tag caveat). */
  paginationMeta: LinksMeta;
  /** Current page number (1-based); controlled by the parent so it can drive the search query. */
  page: number;
  /** Requests a page change; the parent updates its `page` state, which re-triggers `useLinksSearch`. */
  onPageChange: (page: number) => void;
  /** Batch-fetched per-link metadata (preview, trend) for `links` — unrelated to `paginationMeta`. */
  linkMeta: BatchMetaResponse;
  /** True on the very first fetch for the current filters (no cached page to show yet). */
  loading: boolean;
  /** True while a background refetch (page/filter/sort change) is in flight; a page is already on screen. */
  isFetching: boolean;
  isMobile: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onDelete: (id: string) => Promise<void>;
  highlightedLinkId?: string | null;
  /** Selected tag id filter, or `null` when no tag filter is active. */
  tagFilter?: number | null;
  /** Called when the user picks (or clears) a tag filter chip. */
  onTagFilterChange?: (tagId: number | null) => void;
  /** True while a new user's demo link is still being seeded server-side. */
  isSeedingDemo?: boolean;
}

/**
 * Renders `LINKS_PAGE_SIZE` placeholder rects shaped like the real cards, for
 * the very first fetch of a filter/sort combination the query has never seen.
 * Subsequent page/filter changes reuse `placeholderData` (see `useLinksSearch`)
 * and never hit this branch — the previous page just dims via `isFetching`.
 */
function BrowseSectionSkeleton({ isMobile }: { isMobile: boolean }) {
  const theme = useTheme();

  return (
    <Box sx={isMobile ? undefined : getLinksBrowseGridSx(LINKS_PAGE_SIZE)}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          height={isMobile ? 132 : 108}
          sx={{
            ...getLinkCardShellSx(theme),
            mb: isMobile ? 2 : 0,
            animation: "none",
          }}
        />
      ))}
    </Box>
  );
}

/**
 * Filters + link list in one card so users see filters apply to the list below.
 *
 * The section announces itself as "Seus links" via `LinksListSectionHeading`,
 * distinct from the page-level heading. The count/context caption is displayed
 * as the heading's description.
 *
 * @remarks
 * Pagination, search, status filter and sort are server-side (`useLinksSearch`,
 * driven by the parent page): this component only renders whatever page it's
 * handed and reports page changes upward. The tag filter is the one exception —
 * it still narrows `links` on the client, over the current page only (see the
 * parent for why).
 */
export function LinksBrowseSection({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  links,
  paginationMeta,
  page,
  onPageChange,
  linkMeta,
  loading,
  isFetching,
  isMobile,
  hasActiveFilters,
  onClearFilters,
  onDelete,
  highlightedLinkId = null,
  tagFilter = null,
  onTagFilterChange,
  isSeedingDemo = false,
}: LinksBrowseSectionProps) {
  const theme = useTheme();
  const { t } = useTranslation("links");

  const {
    selectedIds,
    toggle: toggleSelected,
    clear: clearSelection,
    selectAllVisible,
    run: runBulkAction,
    isRunning: bulkActionRunning,
    isMaxReached: bulkMaxReached,
  } = useBulkActions();
  const [selectionMode, setSelectionMode] = useState(false);

  const count = links.length;
  const description = hasActiveFilters
    ? t("list.sections.linksFiltered", { count: paginationMeta.total })
    : t("list.sections.linksBrowseDescription", {
        count: paginationMeta.total,
      });

  const visibleIds = useMemo(() => links.map((l) => String(l.id)), [links]);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const someVisibleSelected = visibleIds.some((id) => selectedIds.includes(id));

  /** Enters/exits selection mode; leaving it always drops the current selection. */
  const handleToggleSelectionMode = useCallback(() => {
    setSelectionMode((prev) => {
      if (prev) {
        clearSelection();
      }
      return !prev;
    });
  }, [clearSelection]);

  /** Selects (or clears) every link on the current page — see `useBulkActions.selectAllVisible`. */
  const handleSelectAllVisibleToggle = useCallback(() => {
    if (allVisibleSelected) {
      clearSelection();
    } else {
      selectAllVisible(visibleIds);
    }
  }, [allVisibleSelected, clearSelection, selectAllVisible, visibleIds]);

  const handleBulkActivate = useCallback(() => {
    void runBulkAction("activate");
  }, [runBulkAction]);

  const handleBulkDeactivate = useCallback(() => {
    void runBulkAction("deactivate");
  }, [runBulkAction]);

  const handleBulkDelete = useCallback(() => {
    void runBulkAction("delete");
  }, [runBulkAction]);

  /** Exits selection mode from the bulk actions bar's cancel/close control. */
  const handleBulkCancel = useCallback(() => {
    clearSelection();
    setSelectionMode(false);
  }, [clearSelection]);

  const topRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, paginationMeta.last_page);
  const showPagination = totalPages > 1;
  const rangeStart =
    paginationMeta.total === 0
      ? 0
      : (paginationMeta.current_page - 1) * paginationMeta.per_page + 1;
  const rangeEnd = Math.min(
    paginationMeta.current_page * paginationMeta.per_page,
    paginationMeta.total,
  );

  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, next: number) => {
      onPageChange(next);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [onPageChange],
  );

  // A entrada suave dos cards é uma animação de *mount* (ver getLinkCardShellSx)
  // e os cards são keyed por link.id — quem sobrevive a um filtro nunca remonta,
  // logo a animação não tocaria de novo e o resultado da busca aparecia num corte
  // seco. Remontar esta região a cada mudança de filtro faz a entrada escalonada
  // repetir na busca/filtro/ordenação/paginação, e o vai-e-vem do estado vazio
  // passa a ter o mesmo fade.
  //
  // A chave é a dos *filtros*, não a dos ids visíveis: com ids, apagar um link
  // re-animaria a lista toda, e o `highlightedLinkId` (que limpa por timer depois
  // de criar um link) redistribuiria as cartas sozinho. Um link recém-criado
  // continua entrando animado — o card dele monta pela primeira vez de qualquer
  // forma.
  const resultsKey = `${searchTerm}|${statusFilter}|${tagFilter ?? ""}|${sortBy}|${page}`;

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={getLinksPanelSx(theme)}
    >
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box ref={topRef} sx={{ scrollMarginTop: { xs: 64, sm: 80 } }} />
        <LinksListSectionHeading
          title={t("list.sections.links")}
          description={description}
          titleVariant="section"
          sx={{ mb: { xs: 1.5, sm: 2 } }}
          action={
            count > 0 || selectionMode ? (
              <Button
                size="small"
                variant="text"
                startIcon={<CheckSquare {...ICON_SM} />}
                onClick={handleToggleSelectionMode}
                sx={{ minHeight: 44 }}
              >
                {selectionMode ? t("bulk.cancel") : t("bulk.select")}
              </Button>
            ) : undefined
          }
        />
        <LinksFilters
          embedded
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusChange={onStatusChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          tagFilter={tagFilter}
          onTagFilterChange={onTagFilterChange}
        />

        {selectionMode && count > 0 ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ mt: 1.5 }}
          >
            <Checkbox
              size="small"
              checked={allVisibleSelected}
              indeterminate={someVisibleSelected && !allVisibleSelected}
              onChange={handleSelectAllVisibleToggle}
              inputProps={{ "aria-label": t("bulk.selectAllVisible") }}
            />
            <Typography variant="body2" color="text.secondary">
              {t("bulk.selectAllVisible")}
            </Typography>
          </Stack>
        ) : null}

        {selectedIds.length > 0 ? (
          <Box sx={{ mt: 2 }}>
            <BulkActionsBar
              selectedCount={selectedIds.length}
              isMobile={isMobile}
              isRunning={bulkActionRunning}
              isMaxReached={bulkMaxReached}
              onActivate={handleBulkActivate}
              onDeactivate={handleBulkDeactivate}
              onConfirmDelete={handleBulkDelete}
              onCancel={handleBulkCancel}
            />
          </Box>
        ) : null}

        <Divider sx={{ my: 2 }} />
        {/* `key` remonta esta região quando o conjunto visível muda, e só então
            — é o que faz a lista e o estado vazio reentrarem com o mesmo fade
            escalonado do primeiro load. A paginação fica de fora de propósito:
            ela é chrome fixo e não deve piscar a cada busca. `opacity`+`pointerEvents`
            dão o feedback de "atualizando" durante um refetch em background
            (`isFetching`) sem esconder a página anterior — é o efeito prático de
            `placeholderData: keepPreviousData` em `useLinksSearch`. */}
        <Box
          key={resultsKey}
          sx={{
            opacity: isFetching && !loading ? 0.6 : 1,
            pointerEvents: isFetching && !loading ? "none" : "auto",
            transition: "opacity 150ms ease",
          }}
        >
          {loading ? (
            <BrowseSectionSkeleton isMobile={isMobile} />
          ) : count === 0 && isSeedingDemo ? (
            // Um cadastro novo cai aqui antes de o SeedDemoLinkJob terminar. Sem
            // isto, ele veria o convite a criar o primeiro link e, segundos
            // depois, um link que não criou apareceria do nada.
            <LinksDemoSeedingState />
          ) : count === 0 ? (
            <LinksEmptyState
              hasActiveFilters={hasActiveFilters}
              onClearFilters={onClearFilters}
            />
          ) : isMobile ? (
            <LinksMobileCards
              data={links}
              meta={linkMeta}
              onDelete={onDelete}
              highlightedLinkId={highlightedLinkId}
              selectionMode={selectionMode}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelected}
              selectionMaxReached={bulkMaxReached}
            />
          ) : (
            /* Mobile-first: 1 coluna é o estado natural; o auto-fill só abre
               a 2ª coluna quando o painel comporta dois cards de ≥560px. */
            <Box sx={getLinksBrowseGridSx(LINKS_PAGE_SIZE)}>
              {links.map((link) => {
                const idStr = String(link.id);
                const selected = selectedIds.includes(idStr);

                return (
                  <LinkCardRich
                    key={link.id}
                    link={link}
                    meta={linkMeta[idStr]}
                    onDelete={onDelete}
                    isHighlighted={idStr === highlightedLinkId}
                    selectionMode={selectionMode}
                    selected={selected}
                    onToggleSelect={toggleSelected}
                    selectionDisabled={!selected && bulkMaxReached}
                  />
                );
              })}
            </Box>
          )}
        </Box>
        {isMobile && selectedIds.length > 0 ? (
          // O BulkActionsBar fica `position: fixed` no mobile — este espaçador
          // evita que ele cubra o último card/rodapé de paginação.
          <Box sx={{ height: 88 }} />
        ) : null}
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
              borderTop: `1px solid ${getLinksBorderColor(theme)}`,
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
                total: paginationMeta.total,
              })}
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              disabled={isFetching}
              color="primary"
              shape="rounded"
              size="small"
              siblingCount={isMobile ? 0 : 1}
            />
          </Box>
        ) : null}
      </Box>
    </EnhancedPaper>
  );
}

export default LinksBrowseSection;
