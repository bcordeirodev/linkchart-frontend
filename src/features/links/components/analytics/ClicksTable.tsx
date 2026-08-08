"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useLinkClicks } from "@/features/links/hooks/useLinkClicks";
import { useResponsive } from "@/lib/theme";
import { radiusTokens } from "@/lib/theme/designSystem";
import { getCardSurfaceSx } from "@/shared/ui/base";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import DataTable from "@/shared/ui/data-display/DataTable";

import {
  BrowserCell,
  DeviceCell,
  formatLocation,
  formatReferer,
  LocationCell,
  QualityTierCell,
  RefererCell,
  SocialPlatformCell,
  SourceCell,
  UtmCell,
  WhenCell,
} from "./ClicksTableCells";
import { ClicksTableSkeleton } from "./ClicksTableSkeleton";

import type { LinkClickItem } from "@/features/links/types/click";
import type {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_VisibilityState,
} from "material-react-table";

interface ClicksTableProps {
  linkId: string;
  /** ISO datetime string — forwarded to the backend as `date_from`. */
  dateFrom?: string | null;
  /** ISO datetime string — forwarded to the backend as `date_to`. */
  dateTo?: string | null;
  /** When true, bot clicks are excluded from the result. */
  excludeBots?: boolean;
}

const SORTABLE_COLUMNS = new Set([
  "created_at",
  "country",
  "city",
  "state",
  "device",
  "browser",
  "referer",
]);

/** True when a click carries a usable `social_platform` value. */
function hasSocialPlatformValue(item: LinkClickItem): boolean {
  return Boolean(item.social_platform);
}

/** True when a click carries a usable UTM value (source, medium or campaign). */
function hasUtmValue(item: LinkClickItem): boolean {
  return Boolean(item.utm?.source || item.utm?.medium || item.utm?.campaign);
}

export function ClicksTable({
  linkId,
  dateFrom,
  dateTo,
  excludeBots = false,
}: ClicksTableProps) {
  const { isMobile } = useResponsive();
  const { t } = useTranslation("links");
  const theme = useTheme();
  // Same translucent-fill formula as every other in-page card
  // (`getCardSurfaceSx`, shared with the `/links` card shell and the
  // dashboard's `BusinessInsights` cards) — the table surface used to fall
  // through to `DataTable`'s shared `mrtTheme` default
  // (`theme.palette.background.paper`, opaque), which read as the one
  // leftover solid card on an otherwise translucent page. Overridden here
  // rather than in `DataTable` itself: that component is a generic
  // cross-feature primitive used by tables that legitimately want an opaque
  // surface, so the translucent fill is scoped to this one table.
  const translucentTableBg = getCardSurfaceSx(theme).backgroundColor;
  const {
    items,
    meta,
    loading,
    error,
    params,
    setPage,
    setPerPage,
    setSearch,
    setSort,
    refresh,
  } = useLinkClicks({ linkId, dateFrom, dateTo, excludeBots });

  // Single source of truth: MRT state derived directly from hook params.
  // Avoids dual-state sync issues that prevented pagination from working.
  const pagination: MRT_PaginationState = {
    pageIndex: params.page - 1,
    pageSize: params.per_page,
  };

  const sorting = [{ id: params.sort_by, desc: params.sort_dir === "desc" }];

  // Local state only for search — keeps the input responsive while debouncing the API call
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => setSearch(globalFilter ?? ""), 350);
    return () => clearTimeout(handle);
  }, [globalFilter, setSearch]);

  const total = meta?.total ?? 0;

  /**
   * Auto-computed visibility for the two data-dependent columns. "Social
   * Platform" and "UTM" are only worth a column when the current page of
   * clicks actually carries a value for them — an all-NULL page (common:
   * `social_platform` predates May 2026, most traffic has no UTM tags at
   * all) hid nothing before and just showed a column of dashes. Recomputed
   * per page, since a later page can carry data an earlier one didn't.
   */
  const autoColumnVisibility = useMemo<MRT_VisibilityState>(
    () => ({
      social_platform: items.some(hasSocialPlatformValue),
      utm: items.some(hasUtmValue),
    }),
    [items],
  );

  /**
   * Explicit choices made through MRT's built-in "Show/Hide columns"
   * selector. Layered on top of {@link autoColumnVisibility} so a manual
   * reactivation of "Social Platform"/"UTM" sticks even if a later page of
   * data would otherwise auto-hide the column again.
   */
  const [columnVisibilityOverrides, setColumnVisibilityOverrides] =
    useState<MRT_VisibilityState>({});

  const columnVisibility: MRT_VisibilityState = {
    ...autoColumnVisibility,
    ...columnVisibilityOverrides,
  };

  const columns = useMemo<MRT_ColumnDef<LinkClickItem>[]>(
    () => [
      {
        accessorKey: "created_at",
        header: t("analytics.clicksTable.date"),
        minSize: 160,
        size: 200,
        Cell: WhenCell,
      },
      {
        id: "location",
        accessorFn: (row) => formatLocation(row),
        header: t("analytics.clicksTable.location"),
        enableSorting: false,
        minSize: 180,
        size: 240,
        Cell: LocationCell,
      },
      {
        accessorKey: "device",
        header: t("analytics.clicksTable.device"),
        minSize: 120,
        size: 150,
        Cell: DeviceCell,
      },
      {
        accessorKey: "browser",
        header: t("analytics.clicksTable.browser"),
        minSize: 120,
        size: 160,
        Cell: BrowserCell,
      },
      {
        id: "click_source",
        accessorKey: "click_source",
        header: t("analytics.clicksTable.source"),
        enableSorting: false,
        minSize: 110,
        size: 140,
        Cell: SourceCell,
      },
      {
        id: "referer",
        accessorFn: (row) => formatReferer(row),
        header: t("analytics.clicksTable.referer"),
        minSize: 150,
        size: 200,
        Cell: RefererCell,
      },
      {
        accessorKey: "social_platform",
        header: t("analytics.clicksTable.socialPlatform.columnHeader"),
        enableSorting: false,
        minSize: 110,
        size: 140,
        Cell: SocialPlatformCell,
      },
      {
        accessorKey: "quality_tier",
        header: t("analytics.clicksTable.qualityTier.columnHeader"),
        enableSorting: false,
        minSize: 100,
        size: 130,
        Cell: QualityTierCell,
      },
      {
        id: "utm",
        header: t("analytics.clicksTable.utm"),
        enableSorting: false,
        minSize: 160,
        size: 220,
        accessorFn: (row) => row.utm?.campaign || "",
        Cell: UtmCell,
      },
    ],
    [t],
  );

  const isInitialLoading = loading && items.length === 0;

  return (
    <Box>
      <AnalyticsStateManager
        loading={isInitialLoading}
        error={error}
        hasData={items.length > 0 || loading}
        skeleton={<ClicksTableSkeleton isMobile={isMobile} />}
        onRetry={refresh}
        loadingMessage={t("analytics.clicksTable.loadingMessage")}
        emptyMessage={t("analytics.clicksTable.emptyMessage")}
        // The hook's own error text is developer-facing; the user reads this.
        errorMessage={t("analytics.clicksTable.errorMessage")}
        minHeight={300}
      >
        {isMobile ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.75, px: 0.5 }}
          >
            {t("analytics.clicksTable.scrollHint")}
          </Typography>
        ) : null}
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: `${radiusTokens.lg}px`,
            overflow: "hidden",
          }}
        >
          <DataTable<LinkClickItem>
            columns={columns}
            data={items}
            manualPagination
            manualSorting
            manualFiltering
            rowCount={total}
            state={{
              pagination,
              sorting,
              globalFilter,
              isLoading: loading,
              showProgressBars: loading,
              columnVisibility,
            }}
            onColumnVisibilityChange={(updater) => {
              const next =
                typeof updater === "function"
                  ? updater(columnVisibility)
                  : updater;
              setColumnVisibilityOverrides((prev) => ({ ...prev, ...next }));
            }}
            onPaginationChange={(updater) => {
              const next =
                typeof updater === "function" ? updater(pagination) : updater;
              if (next.pageSize !== pagination.pageSize) {
                setPerPage(next.pageSize);
              } else {
                setPage(next.pageIndex + 1);
              }
            }}
            onSortingChange={(updater) => {
              const next =
                typeof updater === "function" ? updater(sorting) : updater;
              const sort = next[0];
              if (sort && SORTABLE_COLUMNS.has(sort.id)) {
                setSort(sort.id, sort.desc ? "desc" : "asc");
              }
            }}
            onGlobalFilterChange={setGlobalFilter}
            enableRowSelection={false}
            enableRowActions={false}
            enableGrouping={false}
            enableColumnFilters={false}
            // This is a read-only log, not a spreadsheet. The per-header "⋮"
            // menu and the reorder/pin affordances behind it are noise here —
            // `DataTable` turns ordering and pinning on by default.
            enableColumnActions={false}
            enableColumnOrdering={false}
            enableColumnPinning={false}
            // Overrides `DataTable`'s shared `mrtTheme` default
            // (`theme.palette.background.paper`, opaque) with the
            // translucent surface — see `translucentTableBg` above. Pinned
            // rows/columns and the header menu stay opaque on purpose: they
            // sit *over* scrolling content, and a translucent fill there
            // would let rows show through underneath them.
            //
            // `table.options.mrtTheme.baseBackgroundColor` is what both
            // `DataTableTopToolbar` (this app's custom top toolbar) and MRT's
            // own built-in bottom toolbar/pagination bar read for their
            // background, so this one override already makes toolbar + body
            // + footer one continuous surface — verified in a live render
            // (top toolbar, table `Paper`, sticky `<thead>`, and the bottom
            // pagination bar all resolved to the same computed
            // `rgba(255,255,255,0.03)`). `muiTopToolbarProps` below is a
            // belt-and-suspenders explicit pin on top of that (same value,
            // same variable) — not needed to fix a currently-visible seam,
            // but keeps the top toolbar's background from ever silently
            // diverging from `mrtTheme` if a future MRT upgrade changes how
            // that's read. `muiBottomToolbarProps` is deliberately NOT
            // touched here: `DataTable`'s own default supplies its layout
            // `className` ("flex items-center min-h-14 h-14"), and `Object
            // .defaults`-style prop merging replaces that whole key instead
            // of merging into it — passing a partial override here would
            // silently drop the className. Its background already matches
            // via `mrtTheme` regardless.
            mrtTheme={() => ({
              baseBackgroundColor: translucentTableBg,
              menuBackgroundColor: theme.palette.background.paper,
              pinnedRowBackgroundColor: theme.palette.background.paper,
              pinnedColumnBackgroundColor: theme.palette.background.paper,
            })}
            muiTopToolbarProps={{
              sx: { backgroundColor: translucentTableBg },
            }}
            muiTablePaperProps={{
              elevation: 0,
              square: true,
              className: "flex flex-col flex-auto h-full",
              sx: {
                // MuiPaper defaults to overflow:hidden which clips the TableContainer's
                // horizontal scrollbar. Setting overflow to unset (resolves to visible)
                // allows the TableContainer's own overflow:auto to render its scrollbar.
                overflow: "unset",
                backgroundColor: translucentTableBg,
              },
            }}
            muiTableContainerProps={{
              // Refined scrollbars on both axes — matches the app shell pattern
              // in MainLayout (thin thumb on `divider`, paper track) so the
              // table's horizontal + vertical scroll stop looking like raw
              // browser defaults. scrollbar-* props cover Firefox.
              sx: (theme) => ({
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "thin",
                scrollbarColor: `${theme.palette.divider} ${theme.palette.background.paper}`,
                "&::-webkit-scrollbar": {
                  width: "8px",
                  height: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: theme.palette.background.paper,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: theme.palette.divider,
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
                "&::-webkit-scrollbar-corner": {
                  backgroundColor: theme.palette.background.paper,
                },
              }),
            }}
            muiPaginationProps={{
              color: "secondary",
              rowsPerPageOptions: [10, 25, 50, 100],
              shape: "rounded",
              variant: "outlined",
              showRowsPerPage: true,
            }}
            muiSearchTextFieldProps={{
              placeholder: t("analytics.clicksTable.searchPlaceholder"),
              sx: {
                minWidth: { xs: "auto", sm: "280px" },
                flex: { xs: 1, sm: "none" },
              },
              variant: "outlined",
              size: "small",
            }}
          />
        </Box>
      </AnalyticsStateManager>
    </Box>
  );
}

export default ClicksTable;
