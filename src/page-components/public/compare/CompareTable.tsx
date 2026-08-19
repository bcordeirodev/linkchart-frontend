"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Check, Minus, X } from "lucide-react";

import { typographyScale } from "@/lib/theme";
import {
  getPublicElevatedSx,
  getPublicFineprintSx,
  publicHairline,
} from "@/lib/theme/publicPageStyles";

/**
 * Visual verdict for a comparison cell — the three-state vocabulary shared by
 * every public comparison surface. `yes` = fully covered, `partial` =
 * limited/conditional, `no` = not available.
 */
export type Mark = "yes" | "partial" | "no";

/** One verdict column of the table (the header label + its treatment). */
export interface CompareTableColumn {
  /** Column header label. */
  label: string;
  /**
   * Brand-tinted column — reserved for the Link Charts side of a head-to-head.
   * At most one column should set it; a listicle uses none.
   */
  accent?: boolean;
}

/** A single verdict cell: the value plus the mark rendered beside it. */
export interface CompareTableCell {
  value: string;
  mark: Mark;
}

/**
 * One table row: the leading label (feature or option name) and one cell per
 * verdict column. `emphasis` tints the row and, when the table defines
 * `emphasisBadge`, adds the badge next to the label.
 */
export interface CompareTableRow {
  label: string;
  cells: CompareTableCell[];
  emphasis?: boolean;
}

/**
 * Spacing/typography preset. `headToHead` is the two-column `/comparar/*`
 * table (wider gutters, larger header type); `listicle` is the denser
 * multi-option summary used by the `/guia/*` roundups, where the leading
 * column carries service names instead of short feature labels.
 */
export type CompareTableDensity = "headToHead" | "listicle";

const DENSITY = {
  headToHead: {
    labelColumnFr: 1.5,
    labelPx: { xs: 1.5, md: 2.5 },
    cellPx: { xs: 1, md: 2 },
    headerCellPx: { xs: 1, md: 2 },
    headerFontSize: { xs: "0.8125rem", md: "0.9375rem" },
  },
  listicle: {
    labelColumnFr: 1.4,
    labelPx: { xs: 1.25, md: 2 },
    cellPx: { xs: 0.75, md: 2 },
    headerCellPx: { xs: 1.25, md: 2 },
    headerFontSize: { xs: "0.75rem", md: "0.875rem" },
  },
} as const;

/** Props for {@link CompareTable}. */
export interface CompareTableProps {
  /**
   * Header label for the leading column. Omitted on `/comparar/*`, where the
   * corner cell is deliberately blank so the two brand columns read as the
   * table's only headers.
   */
  labelHeader?: string;
  /** Verdict columns, left to right. */
  columns: CompareTableColumn[];
  /** Data rows, in display order. */
  rows: CompareTableRow[];
  /** Badge label rendered beside the label of every `emphasis` row. */
  emphasisBadge?: string;
  /** Fine print under the table: what was checked, where and when. */
  disclaimer?: string;
  /** Spacing preset — see {@link CompareTableDensity}. */
  density?: CompareTableDensity;
}

/**
 * Renders the mark icon for a comparison cell.
 *
 * @param mark - the visual verdict for the cell
 * @param color - resolved icon color
 */
export function MarkIcon({ mark, color }: { mark: Mark; color: string }) {
  const props = { size: 15, color, strokeWidth: 2.5 };
  if (mark === "yes") return <Check {...props} />;
  if (mark === "no") return <X {...props} />;
  return <Minus {...props} />;
}

/**
 * The comparison table shared by `/comparar/{competitor}` and the `/guia/*`
 * roundups — one implementation of the hairline grid, the mark icons and the
 * mono + tabular-nums verdict cells, so restyling one surface can never leave
 * the other behind.
 *
 * Every cell carries its own mark, on every column: nothing in the markup
 * favours the Link Charts side beyond the optional `accent` tint, so ties and
 * losses render exactly as honestly as wins. The caller owns the surrounding
 * `<section>` and heading; this renders the card and the disclaimer only.
 *
 * @param props - see {@link CompareTableProps}
 */
export function CompareTable({
  labelHeader,
  columns,
  rows,
  emphasisBadge,
  disclaimer,
  density = "headToHead",
}: CompareTableProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const spec = DENSITY[density];

  const gridTemplateColumns = `${spec.labelColumnFr}fr repeat(${columns.length}, 1fr)`;
  /** Subtle brand tint for the accent column (no fake winning). */
  const accentTint = alpha(primary, isDark ? 0.08 : 0.06);
  const emphasisTint = alpha(primary, isDark ? 0.05 : 0.035);
  const mutedIcon = alpha(theme.palette.text.primary, isDark ? 0.45 : 0.5);

  return (
    <>
      <Box sx={{ ...getPublicElevatedSx(theme), overflow: "hidden", p: 0 }}>
        {/* Header row */}
        <Box
          sx={{ display: "grid", gridTemplateColumns, alignItems: "stretch" }}
        >
          {labelHeader ? (
            <Box
              sx={{
                px: spec.labelPx,
                py: 1.5,
                borderBottom: `1px solid ${publicHairline(theme)}`,
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: spec.headerFontSize,
                  fontWeight: 600,
                  lineHeight: 1.35,
                  color: theme.palette.text.secondary,
                }}
              >
                {labelHeader}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ px: spec.labelPx, py: 1.5 }} />
          )}
          {columns.map((column) => (
            <Box
              key={column.label}
              sx={{
                px: spec.headerCellPx,
                py: 1.5,
                textAlign: "center",
                ...(column.accent
                  ? {
                      bgcolor: accentTint,
                      borderBottom: `2px solid ${alpha(primary, 0.5)}`,
                    }
                  : {
                      borderBottom: `1px solid ${publicHairline(theme)}`,
                    }),
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: spec.headerFontSize,
                  fontWeight: column.accent ? 800 : 600,
                  lineHeight: 1.35,
                  color: column.accent ? primary : theme.palette.text.secondary,
                }}
              >
                {column.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Data rows */}
        {rows.map((row) => {
          const emphasis = row.emphasis === true;
          return (
            <Box
              key={row.label}
              sx={{
                display: "grid",
                gridTemplateColumns,
                alignItems: "center",
                borderTop: `1px solid ${publicHairline(theme)}`,
                ...(emphasis && { bgcolor: emphasisTint }),
              }}
            >
              {/* Leading label (feature or option) */}
              <Box sx={{ px: spec.labelPx, py: { xs: 1.25, md: 1.5 } }}>
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: "0.75rem", md: "0.8125rem" },
                    fontWeight: emphasis ? 700 : 500,
                    lineHeight: 1.35,
                    color: theme.palette.text.primary,
                    overflowWrap: "anywhere",
                  }}
                >
                  {row.label}
                </Typography>
                {emphasis && emphasisBadge && (
                  <Typography
                    component="span"
                    sx={{
                      display: "inline-block",
                      ml: 1,
                      px: 0.75,
                      py: 0.125,
                      borderRadius: 1,
                      fontSize: "0.625rem",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: primary,
                      bgcolor: alpha(primary, 0.14),
                      verticalAlign: "middle",
                    }}
                  >
                    {emphasisBadge}
                  </Typography>
                )}
              </Box>

              {/* Verdict cells — same recipe on every column: mark icon + the
                  value in the monospace face with tabular numerals, the app's
                  convention for spec-sheet values (see LinkPerformanceTable). */}
              {row.cells.map((cell, index) => {
                const accent = columns[index]?.accent === true;
                return (
                  <Box
                    key={`${row.label}-${columns[index]?.label ?? index}`}
                    sx={{
                      px: spec.cellPx,
                      py: { xs: 1.25, md: 1.5 },
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.75,
                      ...(accent && { bgcolor: accentTint }),
                    }}
                  >
                    <MarkIcon
                      mark={cell.mark}
                      color={cell.mark === "yes" ? primary : mutedIcon}
                    />
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: typographyScale.code.fontFamily,
                        fontVariantNumeric: "tabular-nums",
                        fontSize: { xs: "0.75rem", md: "0.8125rem" },
                        fontWeight: cell.mark === "yes" ? 700 : 500,
                        color:
                          cell.mark === "yes"
                            ? theme.palette.text.primary
                            : theme.palette.text.secondary,
                        textAlign: "center",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {cell.value}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>

      {disclaimer && (
        <Typography
          component="p"
          sx={{ ...getPublicFineprintSx(theme), mt: 1.25 }}
        >
          {disclaimer}
        </Typography>
      )}
    </>
  );
}

export default CompareTable;
