"use client";

import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useLinkClicks } from "@/features/links/hooks/useLinkClicks";
import { useResponsive } from "@/lib/theme";
import { radiusTokens } from "@/lib/theme/designSystem";
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
import type { MRT_ColumnDef, MRT_PaginationState } from "material-react-table";

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

export function ClicksTable({
  linkId,
  dateFrom,
  dateTo,
  excludeBots = false,
}: ClicksTableProps) {
  const { isMobile } = useResponsive();
  const { t } = useTranslation("links");
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
            muiTablePaperProps={{
              elevation: 0,
              square: true,
              className: "flex flex-col flex-auto h-full",
              // MuiPaper defaults to overflow:hidden which clips the TableContainer's
              // horizontal scrollbar. Setting overflow to unset (resolves to visible)
              // allows the TableContainer's own overflow:auto to render its scrollbar.
              sx: { overflow: "unset" },
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
