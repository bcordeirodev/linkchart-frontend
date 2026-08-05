"use client";

import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { dataVizPalette } from "@/lib/theme/dataViz";
import {
  PUBLIC_CARD_GAP,
  PUBLIC_INSET_PAD,
  publicHairline,
} from "@/lib/theme/publicPageStyles";
import { radiusTokens } from "@/lib/theme/designSystem";
import { getCardSurfaceSx, SectionLabel } from "@/shared/ui/base";

/**
 * The five data-viz tones, in series order — the same colours the real charts
 * on this page draw with, so the previews promise what the account delivers.
 * The old palette pulled `warning` and `success` in, which are reserved for
 * meaning (a warning, a healthy link), never for a series.
 */
const TEASER_COLORS = Object.values(dataVizPalette);

// ─── Faux visual helpers ──────────────────────────────────────────────────────

/**
 * Renders a decorative heatmap grid of colored cells to represent geographic
 * distribution. Purely presentational — aria-hidden.
 */
function FauxHeatmapGrid({ colors }: { colors: string[] }) {
  const rows = 5;
  const cols = 8;

  const intensities = [
    0.9, 0.4, 0.7, 0.3, 0.85, 0.5, 0.2, 0.6, 0.3, 0.75, 0.5, 0.95, 0.4, 0.6,
    0.8, 0.3, 0.6, 0.2, 0.45, 0.7, 0.35, 0.9, 0.55, 0.4, 0.8, 0.5, 0.65, 0.3,
    0.7, 0.4, 0.55, 0.9, 0.4, 0.6, 0.3, 0.75, 0.5, 0.2, 0.85, 0.45,
  ];

  return (
    <Box
      aria-hidden="true"
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: "3px",
        width: "100%",
        height: "100%",
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => {
        const colorIdx = i % colors.length;
        const intensity = intensities[i % intensities.length]!;
        return (
          <Box
            key={i}
            sx={{
              borderRadius: "2px",
              bgcolor: alpha(colors[colorIdx] ?? "", intensity),
            }}
          />
        );
      })}
    </Box>
  );
}

/**
 * Renders decorative horizontal bars to represent UTM campaign data.
 *
 * The five rows spread evenly across the full frame height so the drawn
 * content starts and ends on the same lines as the heatmap grid next to it —
 * the three previews share one vertical grammar. Purely presentational —
 * aria-hidden.
 */
function FauxUtmBars({ colors }: { colors: string[] }) {
  const bars = [
    { label: "social", width: "82%", colorIdx: 0 },
    { label: "email", width: "61%", colorIdx: 1 },
    { label: "direct", width: "47%", colorIdx: 2 },
    { label: "search", width: "34%", colorIdx: 3 },
    { label: "referral", width: "22%", colorIdx: 4 },
  ];

  return (
    <Stack
      aria-hidden="true"
      sx={{ width: "100%", height: "100%", justifyContent: "space-between" }}
    >
      {bars.map(({ label, width, colorIdx }) => (
        <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 40,
              flexShrink: 0,
              height: "6px",
              borderRadius: "3px",
              bgcolor: alpha(colors[colorIdx] ?? "", 0.25),
            }}
          />
          <Box
            sx={{
              flex: 1,
              height: "8px",
              borderRadius: "4px",
              bgcolor: alpha(colors[colorIdx] ?? "", 0.18),
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width,
                height: "100%",
                borderRadius: "4px",
                bgcolor: colors[colorIdx],
              }}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

/**
 * Renders a decorative segmented bar to represent the device split.
 *
 * Was a donut. The real device chart on this page is a horizontal stacked bar
 * now, and a preview that shows a shape the product no longer draws is a
 * promise it cannot keep. The layout mirrors the real chart's anatomy — bar
 * centered in the plot zone, legend pinned to the bottom edge and centered —
 * so the drawn content fills the frame like the previews beside it. Purely
 * presentational — aria-hidden.
 */
function FauxDeviceBars({ colors }: { colors: string[] }) {
  const segments = [
    { label: "Mobile", pct: 58, colorIdx: 0 },
    { label: "Desktop", pct: 30, colorIdx: 1 },
    { label: "Tablet", pct: 12, colorIdx: 2 },
  ];

  return (
    <Stack aria-hidden="true" sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: 14,
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          {segments.map(({ label, pct, colorIdx }) => (
            <Box
              key={label}
              sx={{ width: `${pct}%`, bgcolor: colors[colorIdx] }}
            />
          ))}
        </Box>
      </Box>

      <Stack
        direction="row"
        flexWrap="wrap"
        useFlexGap
        gap={1.25}
        sx={{ justifyContent: "center" }}
      >
        {segments.map(({ label, colorIdx }) => (
          <Box
            key={label}
            sx={{ display: "flex", alignItems: "center", gap: 0.625 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "2px",
                bgcolor: colors[colorIdx],
                flexShrink: 0,
              }}
            />
            <Box
              sx={{
                width: 34,
                height: "5px",
                borderRadius: "3px",
                bgcolor: alpha(colors[colorIdx] ?? "", 0.3),
              }}
            />
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

// ─── Single teaser card ───────────────────────────────────────────────────────

type FauxVisualVariant = "geo" | "utm" | "device";

interface TeaserCardProps {
  title: string;
  variant: FauxVisualVariant;
  colors: string[];
}

/**
 * Individual feature preview card with a decorative visual.
 */
function TeaserCard({ title, variant, colors }: TeaserCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const hairline = publicHairline(theme, "inset");

  return (
    <Box
      sx={{
        borderRadius: `${radiusTokens.lg}px`,
        border: `1px solid ${publicHairline(theme)}`,
        ...getCardSurfaceSx(theme),
        p: PUBLIC_INSET_PAD,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {/* Card title — real text for a11y */}
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.8125rem",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: alpha(theme.palette.text.primary, isDark ? 0.82 : 0.88),
        }}
      >
        {title}
      </Typography>

      {/* Faux visual area — fixed height, pinned to the card's bottom edge
          (mt: auto), so the three previews stay aligned as a row even when a
          neighbouring card's title wraps to two lines. */}
      <Box
        sx={{
          position: "relative",
          height: 112,
          mt: "auto",
          borderRadius: `${radiusTokens.md}px`,
          border: `1px solid ${hairline}`,
          bgcolor: alpha(theme.palette.text.primary, isDark ? 0.03 : 0.025),
          overflow: "hidden",
          p: 1.5,
        }}
      >
        {/* Decorative visual — aria-hidden, purely presentational */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {variant === "geo" && <FauxHeatmapGrid colors={colors} />}
          {variant === "utm" && <FauxUtmBars colors={colors} />}
          {variant === "device" && <FauxDeviceBars colors={colors} />}
        </Box>
      </Box>
    </Box>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

/**
 * Static teaser section showing 3 free-account feature previews (geographic
 * heatmap, UTM campaign tracking, device intelligence).
 *
 * Anchored by `SectionLabel`, like every other section in the app — it used to
 * open with a centered caps line tinted primary, a header shape that exists
 * nowhere else. No data fetching: all visuals are decorative, drawn in the
 * data-viz palette, and aria-hidden; every label and title is real text.
 * Reduced motion is respected — nothing here animates on its own.
 */
export const LockedFeaturesTeaser = memo(function LockedFeaturesTeaser() {
  const { t } = useTranslation("public");

  const cards: Array<{ key: FauxVisualVariant; title: string }> = [
    { key: "geo", title: t("publicAnalytics.teaser.geoTitle") },
    { key: "utm", title: t("publicAnalytics.teaser.utmTitle") },
    { key: "device", title: t("publicAnalytics.teaser.deviceTitle") },
  ];

  return (
    <Stack
      component="section"
      spacing={{ xs: 2, md: 2.5 }}
      aria-label={t("publicAnalytics.teaser.heading")}
    >
      <SectionLabel headingLevel={2}>
        {t("publicAnalytics.teaser.heading")}
      </SectionLabel>

      {/* Card grid: 3-up from tablet, 1-up on mobile */}
      <Grid container spacing={PUBLIC_CARD_GAP}>
        {cards.map(({ key, title }) => (
          <Grid key={key} item xs={12} sm={4} md={4}>
            <TeaserCard title={title} variant={key} colors={TEASER_COLORS} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
});
