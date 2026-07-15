"use client";
/**
 * Ranking of the user's most-clicked links in the selected `/reports` period.
 *
 * Renders a plain MUI `<Table>` on tablet/desktop and a stacked card list on
 * mobile. Unlike `ClicksTable` (the per-link "Cliques" log), this is a
 * top-N summary, not a paginated/sortable dataset — `material-react-table`
 * would be overkill here.
 */

import {
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { Link as RouterLink } from "@/shared/ui/navigation";

import type { TopLinkRow } from "@/features/reports/types";

/**
 * Props accepted by {@link TopLinksTable}.
 *
 * Loading/error/empty are gated by the caller's `AnalyticsStateManager`
 * (see `ReportsPage`) — this component only ever mounts with a non-empty
 * `data`, so it renders the ranking unconditionally.
 */
interface TopLinksTableProps {
  /** Top-N links for the selected period, already sorted by clicks descending. */
  data: TopLinkRow[];
  /** When true, renders the stacked-card layout instead of the table. */
  isMobile?: boolean;
}

/**
 * Builds the short-URL display label — `short_domain/slug` when a custom
 * domain is set, `/slug` otherwise.
 */
function shortLabel(row: TopLinkRow): string {
  return row.short_domain ? `${row.short_domain}/${row.slug}` : `/${row.slug}`;
}

/**
 * The user's own links ranked by clicks in the active period, each linking
 * out to its full per-link dashboard at `/links/analytics/{id}`.
 */
export function TopLinksTable({ data, isMobile = false }: TopLinksTableProps) {
  const theme = useTheme();
  const { t } = useTranslation("reports");

  return (
    <ChartCard
      title={t("topLinks.title")}
      subtitle={t("topLinks.subtitle")}
      icon={<Link2 {...ICON_LG} />}
    >
      {isMobile ? (
        <Stack spacing={1.25}>
          {data.map((row) => (
            <Card
              key={row.link_id}
              variant="outlined"
              sx={{ p: 1.5, borderRadius: `${radiusTokens.sm}px` }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                {row.title || shortLabel(row)}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1 }}
                noWrap
              >
                {shortLabel(row)}
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Typography variant="caption" color="text.secondary" noWrap>
                  {t("topLinks.clicksCount", { count: row.clicks })} ·{" "}
                  {t("topLinks.visitorsCount", { count: row.unique_visitors })}
                </Typography>
                <RouterLink
                  to={`/links/analytics/${row.link_id}`}
                  variant="caption"
                  sx={{ fontWeight: 600, flexShrink: 0 }}
                >
                  {t("topLinks.viewStats")}
                </RouterLink>
              </Stack>
            </Card>
          ))}
        </Stack>
      ) : (
        <TableContainer
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: `${radiusTokens.sm}px`,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("topLinks.columns.link")}</TableCell>
                <TableCell align="right">
                  {t("topLinks.columns.clicks")}
                </TableCell>
                <TableCell align="right">
                  {t("topLinks.columns.visitors")}
                </TableCell>
                <TableCell align="right">{t("topLinks.viewStats")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.link_id} hover>
                  <TableCell sx={{ maxWidth: 260 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {row.title || shortLabel(row)}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                      noWrap
                    >
                      {shortLabel(row)}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {row.clicks.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {row.unique_visitors.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <RouterLink
                      to={`/links/analytics/${row.link_id}`}
                      variant="caption"
                      sx={{ fontWeight: 600 }}
                    >
                      {t("topLinks.viewStats")}
                    </RouterLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </ChartCard>
  );
}

export default TopLinksTable;
