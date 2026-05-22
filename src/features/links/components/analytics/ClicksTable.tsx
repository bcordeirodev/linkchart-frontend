"use client";

import { Box, Chip, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { format, isValid } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useLinkClicks } from "@/features/links/hooks/useLinkClicks";
import { useResponsive } from "@/lib/theme";
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

/** Device cell — shows device type chip and OS below it. */
function DeviceCell({ row }: CellProps) {
  const click = row.original;
  const label =
    click.device ||
    (click.is_mobile ? "Mobile" : click.is_desktop ? "Desktop" : "—");
  let color: ChipColor = "default";

  if (click.is_bot) {
    color = "warning";
  } else if (click.is_mobile || click.is_tablet) {
    color = "info";
  }

  const osLabel = click.os
    ? click.os_version
      ? `${click.os} ${click.os_version}`
      : click.os
    : null;

  return (
    <Stack spacing={0.25}>
      <Chip
        size="small"
        color={color}
        label={click.is_bot ? `Bot · ${label}` : label}
        variant="outlined"
      />
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

/** Traffic source chip based on `click_source` (direct/social/search/email/referral/unknown). */
function SourceCell({ row }: CellProps) {
  const { t } = useTranslation("links");
  const source = row.original.click_source || "unknown";
  const color = CLICK_SOURCE_COLORS[source] ?? "default";

  return (
    <Chip
      size="small"
      color={color}
      label={t(`analytics.clicksTable.sourceValues.${source}`, {
        defaultValue: source,
      })}
      variant="outlined"
    />
  );
}

function RefererCell({ row }: CellProps) {
  const { t } = useTranslation("links");
  const label = formatReferer(row.original);

  if (label === DIRECT_SOURCE_SENTINEL) {
    return (
      <Chip size="small" label={t("table.directSource")} variant="outlined" />
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
        skeleton={
          <Box>
            {/* Search bar placeholder */}
            <Skeleton
              variant="rounded"
              animation="wave"
              height={52}
              sx={{ mb: 1.5, borderRadius: 2 }}
            />
            {/* Table header */}
            <Skeleton
              variant="rounded"
              animation="wave"
              height={40}
              sx={{ mb: 0.5, borderRadius: 1, opacity: 0.6 }}
            />
            {/* Table rows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                animation="wave"
                height={48}
                sx={{ mb: 0.5, borderRadius: 1, opacity: 1 - i * 0.08 }}
              />
            ))}
          </Box>
        }
        onRetry={refresh}
        loadingMessage={t("analytics.clicksTable.loadingMessage")}
        emptyMessage={t("analytics.clicksTable.emptyMessage")}
        minHeight={300}
      >
        <Box
          sx={{
            width: "100%",
            overflowX: isMobile ? "auto" : "visible",
            WebkitOverflowScrolling: "touch",
            "& .MuiTableContainer-root": {
              minWidth: isMobile ? 600 : "unset",
            },
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
            muiPaginationProps={{
              color: "secondary",
              rowsPerPageOptions: [10, 25, 50, 100],
              shape: "rounded",
              variant: "outlined",
              showRowsPerPage: true,
            }}
            muiSearchTextFieldProps={{
              placeholder: t("analytics.clicksTable.searchPlaceholder"),
              sx: { minWidth: "320px" },
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
