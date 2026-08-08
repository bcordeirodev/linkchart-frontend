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
 *
 * Abaixo de `md` a tabela vira lista de cards (`AdminUsersMobileCards`,
 * no fim deste arquivo) sobre o mesmo estado server-side — a tabela de seis
 * colunas não cabe num telefone.
 */

import { useEffect, useMemo, useState } from "react";
import { Box, Pagination, Stack, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useAdminUsers } from "@/features/admin/hooks/useAdmin";
import { useResponsive } from "@/lib/theme";
import { radiusTokens, typographyScale } from "@/lib/theme/designSystem";
import { formatCount } from "@/lib/utils/formatNumber";
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

/**
 * Formata uma data ISO no formato curto do idioma ativo.
 *
 * Recebe `string` (não `string | null`): a única coluna nula é
 * `last_login_at`, e o "nunca acessou" é decidido no chamador com a chave
 * `users.neverLoggedIn` — um fallback aqui dentro duplicaria esse texto.
 *
 * @param value Timestamp ISO vindo do backend.
 * @param locale Idioma ativo (`i18n.language`).
 */
function formatDate(value: string, locale: string): string {
  return new Date(value).toLocaleDateString(locale);
}

/**
 * Tab Usuários: tabela server-side de todos os usuários do produto (busca
 * por nome/e-mail, ordenação por cadastro/último acesso/nome/links/cliques,
 * paginação). `keepPreviousData` (no hook) evita flash de tabela vazia ao
 * trocar de página ou ordenar; a busca é debounced em 350ms — mesmo delay
 * usado pelo `ClicksTable` — para não disparar uma query por tecla digitada.
 */
export function AdminUsersTab() {
  const { t, i18n } = useTranslation("admin");
  const locale = i18n.language;
  const { isMobile } = useResponsive();

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
        Cell: ({ cell }) => formatDate(cell.getValue<string>(), locale),
      },
      {
        id: "last_login_at",
        accessorKey: "last_login_at",
        header: t("users.columns.lastLoginAt"),
        Cell: ({ cell }) => {
          const value = cell.getValue<string | null>();
          return value ? formatDate(value, locale) : t("users.neverLoggedIn");
        },
      },
      {
        id: "links",
        accessorKey: "links_count",
        header: t("users.columns.links"),
        Cell: ({ cell }) => formatCount(cell.getValue<number>(), locale),
      },
      {
        id: "clicks",
        accessorKey: "total_clicks",
        header: t("users.columns.clicks"),
        Cell: ({ cell }) => formatCount(cell.getValue<number>(), locale),
      },
    ],
    [t, locale],
  );

  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));

  return (
    <Stack spacing={2}>
      <TextField
        size="small"
        placeholder={t("users.searchPlaceholder")}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        // Sem `label` (o campo é só placeholder), então o leitor de tela não
        // teria nome acessível nenhum — o placeholder repetido como aria-label
        // é o padrão da casa (ver LinksQuickCreate/URLShortenerForm).
        slotProps={{
          htmlInput: { "aria-label": t("users.searchPlaceholder") },
        }}
        sx={{ maxWidth: { sm: 360 } }}
      />

      <AnalyticsStateManager
        loading={query.isLoading}
        error={query.error ? t("errors.loadFailed") : null}
        hasData={rows.length > 0 || query.isFetching}
        onRetry={() => query.refetch()}
        compact
      >
        {isMobile ? (
          <Stack spacing={2}>
            <AdminUsersMobileCards rows={rows} locale={locale} />
            {totalPages > 1 ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={totalPages}
                  page={pagination.pageIndex + 1}
                  onChange={(_, nextPage) =>
                    setPagination((p) => ({ ...p, pageIndex: nextPage - 1 }))
                  }
                  disabled={query.isFetching}
                  color="primary"
                  shape="rounded"
                  size="small"
                  siblingCount={0}
                />
              </Box>
            ) : null}
          </Stack>
        ) : (
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
        )}
      </AnalyticsStateManager>

      <Typography variant="caption" color="text.disabled">
        {t("users.clicksSourceNote")}
      </Typography>
    </Stack>
  );
}

interface AdminUsersMobileCardsProps {
  /** Página atual de usuários, já resolvida no servidor. */
  rows: AdminUserRow[];
  /** Idioma ativo (`i18n.language`) — datas e separadores de milhar. */
  locale: string;
}

/**
 * Lista de cards para viewport estreito — mesma decisão da lista de links
 * (`LinksMobileCards`): seis colunas não cabem em 390px e a rolagem
 * horizontal esconde justamente as duas de valor (links e cliques).
 *
 * O estado é o mesmo da tabela (busca, paginação e ordenação continuam
 * server-side); só a apresentação muda. Ordenação fica fora do mobile de
 * propósito: exigiria um seletor extra acima da lista para uma tela onde o
 * uso típico é buscar um usuário, não varrer a base ordenada.
 *
 * @param props.rows Página atual de usuários.
 * @param props.locale Idioma ativo.
 * @returns Pilha de cards compactos, um por usuário.
 */
function AdminUsersMobileCards({ rows, locale }: AdminUsersMobileCardsProps) {
  const { t } = useTranslation("admin");

  return (
    <Stack spacing={1.25}>
      {rows.map((row) => (
        <Box
          key={row.id}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: `${radiusTokens.lg}px`,
            px: 1.75,
            py: 1.5,
          }}
        >
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {row.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            title={row.email}
            sx={{
              display: "block",
              fontFamily: typographyScale.code.fontFamily,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {row.email}
          </Typography>

          <Typography
            variant="caption"
            color="text.disabled"
            sx={{
              display: "block",
              mt: 0.75,
              fontFamily: typographyScale.code.fontFamily,
            }}
          >
            {t("users.columns.createdAt")} {formatDate(row.created_at, locale)}{" "}
            · {t("users.columns.lastLoginAt")}{" "}
            {row.last_login_at
              ? formatDate(row.last_login_at, locale)
              : t("users.neverLoggedIn")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              mt: 1.25,
              pt: 1.25,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <MobileCardMetric
              label={t("users.columns.links")}
              value={formatCount(row.links_count, locale)}
            />
            <MobileCardMetric
              label={t("users.columns.clicks")}
              value={formatCount(row.total_clicks, locale)}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

/**
 * Par rótulo/valor do rodapé do card mobile — número em mono tabular, na
 * mesma linguagem das fileiras de métrica do painel (sem card nem ícone).
 *
 * @param props.label Rótulo já traduzido.
 * @param props.value Valor já formatado no idioma ativo.
 */
function MobileCardMetric({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          fontFamily: typographyScale.code.fontFamily,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default AdminUsersTab;
