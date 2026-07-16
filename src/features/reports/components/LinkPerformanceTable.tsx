"use client";
/**
 * Portfolio leaderboard — ranks the user's own links by clicks in the
 * selected period, with each row also showing the variation vs. the
 * immediately preceding period of equal length and this link's share of the
 * user's total clicks.
 *
 * Unlike `TopLinksTable` (clicks + unique visitors, a per-period snapshot),
 * this answers a portfolio-level question per-link analytics can't: which of
 * my links is trending up or down right now, and how much of my total
 * traffic does each one represent?
 */

import {
  Box,
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
import { alpha, useTheme } from "@mui/material/styles";
import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import { useNavigate } from "@/shared/hooks";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import { LinkSparkline } from "@/features/reports/components/LinkSparkline";
import {
  formatSignedPct,
  getVariationPillSx,
} from "@/features/reports/utils/variationPillStyles";

import type { LinkPerformanceRow } from "@/features/reports/types";

/**
 * Props accepted by {@link LinkPerformanceTable}.
 *
 * Loading/error/empty are gated by the caller's `AnalyticsStateManager` (see
 * `ReportsPage`) — this component only ever mounts with a non-empty `data`.
 */
interface LinkPerformanceTableProps {
  /** Links ranked by clicks in the selected period, already sorted descending. */
  data: LinkPerformanceRow[];
  /** When true, renders the stacked-card layout instead of the table. */
  isMobile?: boolean;
}

/**
 * Builds the short-URL display label — `short_domain/slug` when a custom
 * domain is set, `/slug` otherwise. Mirrors `TopLinksTable`'s helper.
 */
function shortLabel(row: LinkPerformanceRow): string {
  return row.short_domain ? `${row.short_domain}/${row.slug}` : `/${row.slug}`;
}

/** Renders a variation value as a colored pill — "▲ 12%" / "▼ 5%" / "—". */
function VariationPill({ pct }: { pct: number | null }) {
  const theme = useTheme();
  const sx = getVariationPillSx(theme, pct === null ? null : pct >= 0);

  return (
    <Typography
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1,
        py: 0.25,
        borderRadius: 999,
        fontSize: "0.75rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
        ...sx,
      }}
    >
      {formatSignedPct(pct)}
    </Typography>
  );
}

/**
 * The user's own links ranked by clicks in the active period, each with a
 * trend pill and its share of total clicks. Renders a plain MUI `<Table>` on
 * tablet/desktop and a stacked card list on mobile — same pattern as
 * `TopLinksTable`.
 */
export function LinkPerformanceTable({
  data,
  isMobile = false,
}: LinkPerformanceTableProps) {
  const theme = useTheme();
  const { t } = useTranslation("reports");
  const navigate = useNavigate();

  return (
    <ChartCard
      title={t("linkPerformance.title")}
      subtitle={t("linkPerformance.subtitle")}
      icon={<Trophy {...ICON_LG} />}
    >
      {isMobile ? (
        <Stack spacing={1.25}>
          {data.map((row) => (
            <Card
              key={row.link_id}
              variant="outlined"
              onClick={() => navigate(`/links/analytics/${row.link_id}`)}
              sx={{
                p: 1.5,
                borderRadius: `${radiusTokens.sm}px`,
                cursor: "pointer",
                transition: "border-color 140ms ease",
                "&:hover": { borderColor: theme.palette.primary.main },
              }}
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
                  {row.share_pct}%
                </Typography>
                <LinkSparkline data={row.spark} width={72} height={22} />
                <VariationPill pct={row.variation_pct} />
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
                <TableCell>{t("linkPerformance.columns.link")}</TableCell>
                <TableCell align="center" sx={{ width: 112 }}>
                  {t("linkPerformance.columns.trend")}
                </TableCell>
                <TableCell align="right">
                  {t("linkPerformance.columns.clicks")}
                </TableCell>
                <TableCell align="right">
                  {t("linkPerformance.columns.variation")}
                </TableCell>
                <TableCell align="right">
                  {t("linkPerformance.columns.share")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.link_id}
                  hover
                  onClick={() => navigate(`/links/analytics/${row.link_id}`)}
                  sx={{ cursor: "pointer" }}
                >
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
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <LinkSparkline data={row.spark} />
                    </Box>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {row.clicks.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <VariationPill pct={row.variation_pct} />
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {row.share_pct}%
                    <Box
                      sx={{
                        mt: 0.5,
                        ml: "auto",
                        width: 64,
                        height: 4,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.min(100, row.share_pct)}%`,
                          height: "100%",
                          borderRadius: 2,
                          bgcolor: theme.palette.primary.main,
                        }}
                      />
                    </Box>
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

export default LinkPerformanceTable;
