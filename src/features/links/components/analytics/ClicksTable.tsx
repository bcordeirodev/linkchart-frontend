"use client";

import { Box, Chip, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { format, isValid } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useLinkClicks } from "@/features/links/hooks/useLinkClicks";
import { useResponsive } from "@/lib/theme";
import { radiusTokens } from "@/lib/theme/designSystem";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import DataTable from "@/shared/ui/data-display/DataTable";

import type { LinkClickItem } from "@/features/links/types/click";
import type {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
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

interface CellProps {
  row: MRT_Row<LinkClickItem>;
  cell?: MRT_Cell<LinkClickItem, unknown>;
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

/** click_source values emitted by the backend categoriseClickSource(). */
const CLICK_SOURCE_COLORS: Record<
  string,
  "default" | "primary" | "success" | "info" | "warning" | "secondary"
> = {
  direct: "default",
  social: "primary",
  search: "success",
  email: "info",
  referral: "secondary",
  unknown: "default",
};

/** quality_tier chip color map for Phase 3 scoring values. */
const QUALITY_TIER_COLORS: Record<string, "success" | "warning" | "error"> = {
  organic: "success",
  suspicious: "warning",
  likely_fraud: "error",
};

function formatDate(value: string | null, fmt: string): string {
  if (!value) {
    return "—";
  }

  const d = new Date(value);

  if (!isValid(d)) {
    return "—";
  }

  return format(d, fmt);
}

function formatLocation(click: LinkClickItem): string {
  const parts = [
    click.city,
    click.state_name || click.state,
    click.country,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

const DIRECT_SOURCE_SENTINEL = "__direct__";

function formatReferer(click: LinkClickItem): string {
  if (!click.referer || click.referer === "-") {
    return DIRECT_SOURCE_SENTINEL;
  }

  return click.referer_host || click.referer;
}

/** Date/time cell — also shows timezone caption and a "Returning" badge. */
function WhenCell({ row }: CellProps) {
  const { t } = useTranslation("links");
  const click = row.original;

  return (
    <Stack spacing={0.25}>
      <Typography variant="body2">
        {formatDate(click.created_at, t("analytics.clicksTable.dateFormat"))}
      </Typography>
      <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
        {click.timezone ? (
          <Typography variant="caption" color="text.secondary">
            {click.timezone}
          </Typography>
        ) : null}
        {click.is_return_visitor ? (
          <Chip
            size="small"
            label={t("analytics.clicksTable.returnVisitor")}
            color="secondary"
            variant="outlined"
            sx={{
              height: 16,
              fontSize: "0.6rem",
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        ) : null}
      </Stack>
    </Stack>
  );
}

function LocationCell({ row }: CellProps) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="body2">{formatLocation(row.original)}</Typography>
      {row.original.iso_code ? (
        <Typography variant="caption" color="text.secondary">
          {row.original.iso_code}
          {row.original.continent ? ` · ${row.original.continent}` : ""}
        </Typography>
      ) : null}
    </Stack>
  );
}

type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

/**
 * Device cell — device type as quiet text with the OS below it.
 *
 * Every row has a device, so a chip here was pure noise; the chip survives
 * only for bots, which are an actual signal worth catching while scanning.
 */
function DeviceCell({ row }: CellProps) {
  const click = row.original;
  const label =
    click.device ||
    (click.is_mobile ? "Mobile" : click.is_desktop ? "Desktop" : "—");

  const osLabel = click.os
    ? click.os_version
      ? `${click.os} ${click.os_version}`
      : click.os
    : null;

  return (
    <Stack spacing={0.25}>
      {click.is_bot ? (
        <Chip
          size="small"
          color="warning"
          label={`Bot · ${label}`}
          variant="outlined"
          sx={{ alignSelf: "flex-start" }}
        />
      ) : (
        <Typography variant="body2">{label}</Typography>
      )}
      {osLabel ? (
        <Typography variant="caption" color="text.secondary">
          {osLabel}
        </Typography>
      ) : null}
    </Stack>
  );
}

function BrowserCell({ row }: CellProps) {
  const { browser, browser_version: ver } = row.original;

  if (!browser) {
    return <span>—</span>;
  }

  return <span>{ver ? `${browser} ${ver}` : browser}</span>;
}

/**
 * Traffic source based on `click_source` (direct/social/search/email/referral).
 *
 * Direct/unknown is the default state and reads quiet; the named sources keep
 * their semantic color as text — color only where it carries information.
 */
function SourceCell({ row }: CellProps) {
  const { t } = useTranslation("links");
  const source = row.original.click_source || "unknown";
  const color = CLICK_SOURCE_COLORS[source] ?? "default";
  const isSignal = color !== "default";

  return (
    <Typography
      variant="body2"
      sx={{
        color: isSignal ? `${color}.main` : "text.secondary",
        fontWeight: isSignal ? 500 : 400,
      }}
    >
      {t(`analytics.clicksTable.sourceValues.${source}`, {
        defaultValue: source,
      })}
    </Typography>
  );
}

function RefererCell({ row }: CellProps) {
  const { t } = useTranslation("links");
  const label = formatReferer(row.original);

  if (label === DIRECT_SOURCE_SENTINEL) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t("table.directSource")}
      </Typography>
    );
  }

  return (
    <Tooltip title={row.original.referer || ""} arrow>
      <Typography variant="body2" noWrap>
        {label}
      </Typography>
    </Tooltip>
  );
}

/**
 * Cell for the `social_platform` column.
 *
 * Renders the detected social platform name when present. For rows where
 * `social_platform` is NULL (clicks recorded before May 2026), renders an
 * em-dash with a tooltip explaining the tracking gap.
 */
function SocialPlatformCell({ row }: CellProps) {
  const { t } = useTranslation("links");
  const platform = row.original.social_platform;

  if (!platform) {
    return (
      <Tooltip
        title={t("analytics.clicksTable.socialPlatform.nullTooltip")}
        arrow
      >
        <Typography variant="body2" color="text.secondary">
          {"—"}
        </Typography>
      </Tooltip>
    );
  }

  return <Typography variant="body2">{platform}</Typography>;
}

/**
 * Cell for the `quality_tier` column.
 *
 * Renders a color-coded MUI Chip for known tiers (organic → success/green,
 * suspicious → warning/amber, likely_fraud → error/red). For NULL values
 * (clicks recorded before Phase 3 quality scoring was implemented) renders
 * an em-dash with a descriptive tooltip.
 */
function QualityTierCell({ row }: CellProps) {
  const { t } = useTranslation("links");
  const tier = row.original.quality_tier;

  if (!tier) {
    return (
      <Tooltip title={t("analytics.clicksTable.qualityTier.nullTooltip")} arrow>
        <Typography variant="body2" color="text.secondary">
          {"—"}
        </Typography>
      </Tooltip>
    );
  }

  const color = QUALITY_TIER_COLORS[tier] ?? "default";
  const labelKey =
    tier === "likely_fraud"
      ? "analytics.clicksTable.qualityTier.likelyFraud"
      : `analytics.clicksTable.qualityTier.${tier}`;

  return (
    <Chip
      size="small"
      color={color as ChipColor}
      label={t(labelKey, { defaultValue: tier })}
      variant="outlined"
    />
  );
}

function UtmCell({ row }: CellProps) {
  const utm = row.original.utm;

  if (!utm || (!utm.source && !utm.medium && !utm.campaign)) {
    return (
      <Typography variant="caption" color="text.secondary">
        —
      </Typography>
    );
  }

  return (
    <Stack spacing={0.25}>
      {utm.campaign ? (
        <Typography variant="body2">{utm.campaign}</Typography>
      ) : null}
      <Typography variant="caption" color="text.secondary">
        {[utm.source, utm.medium].filter(Boolean).join(" · ") || "—"}
      </Typography>
    </Stack>
  );
}

interface ColSkeletonConfig {
  /** Proportional flex value, derived from the column `size` config. */
  flex: number;
  /** Width of the header label skeleton (percentage string). */
  headerW: string;
  /** Cell anatomy type — drives which inner skeleton shapes are rendered. */
  type: "twoLine" | "chipLine" | "chip" | "text";
  /** Primary (top) line / chip width. */
  l1: string;
  /** Secondary (bottom) caption width — only for twoLine / chipLine. */
  l2?: string;
}

/**
 * Column-aware skeleton that mirrors the anatomy of ClicksTable before data
 * arrives.  Each column uses its real `size` proportion and renders the same
 * inner structure as the live cell (two-line text, chip + caption, etc.).
 */
function ClicksTableSkeleton({ isMobile }: { isMobile: boolean }) {
  /** Proportional flex values are derived from each column's `size` config. */
  const cols: ColSkeletonConfig[] = [
    { flex: 2.0, headerW: "62%", type: "twoLine", l1: "80%", l2: "52%" }, // Date
    { flex: 2.4, headerW: "68%", type: "twoLine", l1: "88%", l2: "38%" }, // Location
    { flex: 1.5, headerW: "55%", type: "chipLine", l1: "68%", l2: "48%" }, // Device
    { flex: 1.6, headerW: "62%", type: "text", l1: "72%" }, // Browser
    { flex: 1.4, headerW: "50%", type: "chip", l1: "78%" }, // Source
    { flex: 2.0, headerW: "65%", type: "text", l1: "82%" }, // Referer
    { flex: 1.4, headerW: "60%", type: "text", l1: "65%" }, // Social Platform
    { flex: 1.3, headerW: "55%", type: "chip", l1: "70%" }, // Quality
    { flex: 2.2, headerW: "52%", type: "twoLine", l1: "65%", l2: "45%" }, // UTM
  ];

  const tableContent = (
    <>
      {/* Column header row */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          px: 2,
          py: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {cols.map((col, i) => (
          <Box key={i} sx={{ flex: col.flex, minWidth: 0 }}>
            <Skeleton
              variant="rounded"
              animation="wave"
              height={13}
              width={col.headerW}
            />
          </Box>
        ))}
      </Box>

      {/* Data rows — opacity fades to hint at pagination boundary */}
      {Array.from({ length: 8 }).map((_, row) => (
        <Box
          key={row}
          sx={{
            display: "flex",
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            opacity: Math.max(0.18, 1 - row * 0.1),
            alignItems: "flex-start",
          }}
        >
          {cols.map((col, c) => (
            <Box key={c} sx={{ flex: col.flex, minWidth: 0 }}>
              {col.type === "twoLine" && (
                <Stack spacing={0.6}>
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={14}
                    width={col.l1}
                  />
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={11}
                    width={col.l2}
                  />
                </Stack>
              )}
              {col.type === "chipLine" && (
                <Stack spacing={0.6}>
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={22}
                    width={col.l1}
                    sx={{ borderRadius: "12px" }}
                  />
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={11}
                    width={col.l2}
                  />
                </Stack>
              )}
              {col.type === "chip" && (
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={22}
                  width={col.l1}
                  sx={{ borderRadius: "12px" }}
                />
              )}
              {col.type === "text" && (
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={14}
                  width={col.l1}
                />
              )}
            </Box>
          ))}
        </Box>
      ))}
    </>
  );

  return (
    <Box>
      {/* Toolbar: search + optional date-range pickers */}
      <Stack direction="row" spacing={1} sx={{ mb: 1.5, px: 0.5 }}>
        <Skeleton
          variant="rounded"
          animation="wave"
          height={40}
          sx={{ flex: 2, borderRadius: 1.5 }}
        />
        {!isMobile && (
          <>
            <Skeleton
              variant="rounded"
              animation="wave"
              height={40}
              sx={{ width: 140, flexShrink: 0, borderRadius: 1.5 }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              height={40}
              sx={{ width: 140, flexShrink: 0, borderRadius: 1.5 }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              height={40}
              sx={{ width: 36, flexShrink: 0, borderRadius: 1.5 }}
            />
          </>
        )}
      </Stack>

      {/* Table body — horizontal scroll on all viewports when columns exceed container */}
      <Box sx={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <Box sx={{ minWidth: 600 }}>{tableContent}</Box>
      </Box>
    </Box>
  );
}

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
