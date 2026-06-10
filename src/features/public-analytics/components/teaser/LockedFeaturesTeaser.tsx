"use client";

import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Lock } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { getPublicChartPalette } from "@/lib/theme/publicChartTheme";
import {
  PUBLIC_CARD_GAP,
  PUBLIC_INSET_PAD,
  getPublicPanelSx,
  getPublicSectionHeadingSx,
  publicHairline,
} from "@/lib/theme/publicPageStyles";
import { radiusTokens } from "@/lib/theme/designSystem";

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
        const intensity = intensities[i % intensities.length];
        return (
          <Box
            key={i}
            sx={{
              borderRadius: "2px",
              bgcolor: alpha(colors[colorIdx], intensity),
            }}
          />
        );
      })}
    </Box>
  );
}

/**
 * Renders decorative horizontal bars to represent UTM campaign data.
 * Purely presentational — aria-hidden.
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
    <Stack aria-hidden="true" spacing={0.75} sx={{ width: "100%", pt: 0.5 }}>
      {bars.map(({ label, width, colorIdx }) => (
        <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 40,
              flexShrink: 0,
              height: "6px",
              borderRadius: "3px",
              bgcolor: alpha(colors[colorIdx], 0.25),
            }}
          />
          <Box
            sx={{
              flex: 1,
              height: "8px",
              borderRadius: "4px",
              bgcolor: alpha(colors[colorIdx], 0.18),
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width,
                height: "100%",
                borderRadius: "4px",
                bgcolor: colors[colorIdx],
                opacity: 0.85,
              }}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

/**
 * Renders a decorative donut chart to represent device split.
 * Purely presentational — aria-hidden.
 */
function FauxDeviceDonut({ colors }: { colors: string[] }) {
  const segments = [
    { pct: 58, color: colors[0] },
    { pct: 30, color: colors[1] },
    { pct: 12, color: colors[2] },
  ];

  const size = 72;
  const cx = size / 2;
  const cy = size / 2;
  const r = 26;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * r;

  let offset = -circumference * 0.25; // start at 12 o'clock

  return (
    <Box
      aria-hidden="true"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        width: "100%",
        height: "100%",
      }}
    >
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {segments.map(({ pct, color }, i) => {
          const dash = (pct / 100) * circumference;
          const gap = circumference - dash;
          const el = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              opacity={0.85}
            />
          );
          offset -= dash;
          return el;
        })}
      </svg>
      <Stack spacing={0.75}>
        {["Mobile", "Desktop", "Tablet"].map((label, i) => (
          <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: colors[i],
                opacity: 0.85,
                flexShrink: 0,
              }}
            />
            <Box
              sx={{
                width: 32,
                height: "5px",
                borderRadius: "3px",
                bgcolor: alpha(colors[i], 0.3),
              }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

// ─── Lock overlay ─────────────────────────────────────────────────────────────

interface LockOverlayProps {
  label: string;
}

/**
 * Absolute-positioned scrim with a lock icon and label, placed over the blurred
 * faux visual. The scrim text is real for screen readers; the visual behind is
 * aria-hidden.
 */
function LockOverlay({ label }: LockOverlayProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        borderRadius: `${radiusTokens.md}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.75,
        background: isDark
          ? `linear-gradient(160deg, ${alpha(theme.palette.background.paper, 0.55)} 0%, ${alpha(theme.palette.background.default, 0.72)} 100%)`
          : `linear-gradient(160deg, ${alpha(theme.palette.background.paper, 0.6)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
        backdropFilter: "blur(1px)",
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.12),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.32)}`,
          color: theme.palette.primary.main,
        }}
      >
        <Lock size={15} strokeWidth={2.2} />
      </Box>
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.03em",
          color: alpha(theme.palette.text.primary, isDark ? 0.7 : 0.65),
          textAlign: "center",
          px: 1,
          lineHeight: 1.35,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

// ─── Single teaser card ───────────────────────────────────────────────────────

type FauxVisualVariant = "geo" | "utm" | "device";

interface TeaserCardProps {
  title: string;
  lockedLabel: string;
  variant: FauxVisualVariant;
  colors: string[];
}

/**
 * Individual locked feature card showing a blurred faux visual, a lock overlay,
 * and an accessible title.
 */
function TeaserCard({ title, lockedLabel, variant, colors }: TeaserCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const hairline = publicHairline(theme, "inset");

  return (
    <Box
      sx={{
        ...getPublicPanelSx(theme),
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

      {/* Faux visual area with blur + overlay */}
      <Box
        sx={{
          position: "relative",
          flex: 1,
          minHeight: 96,
          borderRadius: `${radiusTokens.md}px`,
          border: `1px solid ${hairline}`,
          bgcolor: alpha(theme.palette.text.primary, isDark ? 0.03 : 0.025),
          overflow: "hidden",
          p: 1.5,
        }}
      >
        {/* Blurred decorative visual — aria-hidden, purely presentational */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            filter: "blur(6px)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {variant === "geo" && <FauxHeatmapGrid colors={colors} />}
          {variant === "utm" && <FauxUtmBars colors={colors} />}
          {variant === "device" && <FauxDeviceDonut colors={colors} />}
        </Box>

        {/* Lock scrim + label */}
        <LockOverlay label={lockedLabel} />
      </Box>
    </Box>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

/**
 * Static teaser section showing 3 blurred, locked premium feature cards
 * (geographic heatmap, UTM campaign tracking, device intelligence).
 *
 * No data fetching — all visuals are purely decorative and representative.
 * Reduced motion is respected: no entrance animations are used by default.
 * Blurred faux visuals are aria-hidden; all labels and titles are real text.
 */
export const LockedFeaturesTeaser = memo(function LockedFeaturesTeaser() {
  const { t } = useTranslation("public");
  const theme = useTheme();
  const colors = getPublicChartPalette(theme);
  const isDark = theme.palette.mode === "dark";

  const lockedLabel = t("publicAnalytics.teaser.lockedLabel");

  const cards: Array<{ key: FauxVisualVariant; title: string }> = [
    { key: "geo", title: t("publicAnalytics.teaser.geoTitle") },
    { key: "utm", title: t("publicAnalytics.teaser.utmTitle") },
    { key: "device", title: t("publicAnalytics.teaser.deviceTitle") },
  ];

  return (
    <Box
      component="section"
      aria-label={t("publicAnalytics.teaser.heading")}
    >
      {/* Section heading */}
      <Typography
        component="p"
        sx={{
          ...getPublicSectionHeadingSx(theme),
          color: alpha(theme.palette.primary.main, isDark ? 0.72 : 0.65),
        }}
      >
        {t("publicAnalytics.teaser.heading")}
      </Typography>

      {/* Card grid: 3-up on desktop, 3-up at tablet, 1-up on mobile */}
      <Grid container spacing={PUBLIC_CARD_GAP}>
        {cards.map(({ key, title }) => (
          <Grid key={key} item xs={12} sm={4} md={4}>
            <TeaserCard
              title={title}
              lockedLabel={lockedLabel}
              variant={key}
              colors={colors}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});
