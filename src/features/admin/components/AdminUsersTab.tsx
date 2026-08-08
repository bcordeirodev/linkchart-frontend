"use client";
/**
 * Tab Usuários do painel `/admin` — tabela server-side (paginação, busca e
 * ordenação resolvidas no backend via `useAdminUsers`) com nome, e-mail,
 * cadastro, último acesso, nº de links e total de cliques (contador por
 * link). Mesmo padrão server-side de `ClicksTable`
 * (`src/features/links/components/analytics/ClicksTable.tsx`):
 * `manualPagination`/`manualSorting` + `state.pagination`/`state.sorting`
 * como única fonte de verdade, `rowCount` vindo de `meta.total`. Todo
 * acesso a este endpoint é auditado no backend.
 */

import { useEffect, useMemo, useState } from "react";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useAdminUsers } from "@/features/admin/hooks/useAdmin";
import { radiusTokens } from "@/lib/theme/designSystem";
import AnalyticsStateManager from "@/shared/ui/base/AnalyticsStateManager";
import DataTable from "@/shared/ui/data-display/DataTable";

import type { AdminUserRow, AdminUsersParams } from "@/features/admin/types";
import type {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
} from "material-react-table";

/** Colunas ordenáveis, mapeadas 1:1 para o whitelist aceito pelo backend. */
const SORTABLE_COLUMNS = new Set([
  "created_at",
  "last_login_at",
  "name",
  "links",
  "clicks",
]);

/** Formata uma data ISO como `dd/mm/aaaa`, ou "—" quando ausente. */
function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleDateString("pt-BR") : "—";
}

/**
 * Tab Usuários: tabela server-side de todos os usuários do produto (busca
 * por nome/e-mail, ordenação por cadastro/último acesso/nome/links/cliques,
 * paginação). `keepPreviousData` (no hook) evita flash de tabela vazia ao
 * trocar de página ou ordenar; a busca é debounced em 350ms — mesmo delay
 * usado pelo `ClicksTable` — para não disparar uma query por tecla digitada.
 */
export function AdminUsersTab() {
  const { t } = useTranslation("admin");

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [sorting, setSorting] = useState<MRT_SortingState>([
    { id: "created_at", desc: true },
  ]);

  // Local state only for the input — keeps typing responsive while the
  // actual query param is debounced (mirrors ClicksTable's search field).
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput);
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    }, 350);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const params: AdminUsersParams = useMemo(() => {
    const sort = sorting[0];
    return {
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
      q: search || undefined,
      sort: (sort?.id as AdminUsersParams["sort"]) ?? "created_at",
      order: sort?.desc === false ? "asc" : "desc",
    };
  }, [pagination, sorting, search]);

  const query = useAdminUsers(params);
  const rows = query.data?.items ?? [];
  const total = query.data?.meta.total ?? 0;

  const columns = useMemo<MRT_ColumnDef<AdminUserRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("users.columns.name"),
      },
      {
        accessorKey: "email",
        header: t("users.columns.email"),
        // Backend rejects `email` in the sort whitelist — see SORTABLE_COLUMNS.
        enableSorting: false,
      },
      {
        accessorKey: "created_at",
        header: t("users.columns.createdAt"),
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
      },
      {
        id: "last_login_at",
        accessorKey: "last_login_at",
        header: t("users.columns.lastLoginAt"),
        Cell: ({ cell }) => {
          const value = cell.getValue<string | null>();
          return value ? formatDate(value) : t("users.neverLoggedIn");
        },
      },
      {
        id: "links",
        accessorKey: "links_count",
        header: t("users.columns.links"),
        Cell: ({ cell }) => cell.getValue<number>().toLocaleString("pt-BR"),
      },
      {
        id: "clicks",
        accessorKey: "total_clicks",
        header: t("users.columns.clicks"),
        Cell: ({ cell }) => cell.getValue<number>().toLocaleString("pt-BR"),
      },
    ],
    [t],
  );

  return (
    <Stack spacing={2}>
      <TextField
        size="small"
        placeholder={t("users.searchPlaceholder")}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        sx={{ maxWidth: { sm: 360 } }}
      />

      <AnalyticsStateManager
        loading={query.isLoading}
        error={query.error ? t("errors.loadFailed") : null}
        hasData={rows.length > 0 || query.isFetching}
        onRetry={() => query.refetch()}
        compact
      >
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: `${radiusTokens.lg}px`,
            overflow: "hidden",
          }}
        >
          <DataTable<AdminUserRow>
            columns={columns}
            data={rows}
            manualPagination
            manualSorting
            rowCount={total}
            state={{
              pagination,
              sorting,
              isLoading: query.isFetching,
              showProgressBars: query.isFetching,
            }}
            onPaginationChange={setPagination}
            onSortingChange={(updater) => {
              const next =
                typeof updater === "function" ? updater(sorting) : updater;
              const sort = next[0];
              if (!sort || SORTABLE_COLUMNS.has(sort.id)) {
                setSorting(next);
              }
            }}
            enableRowSelection={false}
            enableRowActions={false}
            enableGrouping={false}
            enableColumnFilters={false}
            enableColumnActions={false}
            enableColumnOrdering={false}
            enableColumnPinning={false}
            enableGlobalFilter={false}
            // Default page size is 25 (see `pagination` state above), which
            // isn't one of DataTable's own default rowsPerPageOptions
            // ([10, 20, 30]) — without this override MUI's pagination
            // Select would receive an out-of-range value and warn in the
            // console. Same list ClicksTable uses for the same reason.
            muiPaginationProps={{
              color: "secondary",
              rowsPerPageOptions: [10, 25, 50, 100],
              shape: "rounded",
              variant: "outlined",
              showRowsPerPage: true,
            }}
            muiTablePaperProps={{
              elevation: 0,
              square: true,
              className: "flex flex-col flex-auto h-full",
              sx: { overflow: "unset" },
            }}
            muiTableContainerProps={{
              sx: (theme) => ({
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "thin",
                scrollbarColor: `${theme.palette.divider} ${theme.palette.background.paper}`,
                "&::-webkit-scrollbar": { width: "8px", height: "8px" },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: theme.palette.background.paper,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: theme.palette.divider,
                  borderRadius: "4px",
                },
              }),
            }}
          />
        </Box>
      </AnalyticsStateManager>

      <Typography variant="caption" color="text.disabled">
        {t("users.clicksSourceNote")}
      </Typography>
    </Stack>
  );
}

export default AdminUsersTab;
