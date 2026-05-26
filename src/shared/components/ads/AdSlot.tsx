// src/shared/components/ads/AdSlot.tsx
"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "leaderboard";
  className?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle: any[];
  }
}

/** Approximate reserved height per format, matching real AdSense slot sizes. */
const FORMAT_MIN_HEIGHT: Record<NonNullable<AdSlotProps["format"]>, number> = {
  rectangle: 280,
  leaderboard: 90,
  auto: 120,
};

/** Human-readable label shown inside the dev placeholder box. */
const FORMAT_LABEL: Record<NonNullable<AdSlotProps["format"]>, string> = {
  rectangle: "Rectangle 336×280",
  leaderboard: "Leaderboard 728×90",
  auto: "Responsive",
};

const isDev = process.env.NODE_ENV === "development";

/**
 * Renders a Google AdSense `<ins>` slot.
 *
 * In development, or when `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` is not defined,
 * renders a labelled placeholder box that reserves the same space the real ad
 * would occupy — so layout shifts caused by a missing ad are visible locally.
 *
 * In production without a publisher ID the component returns `null` to avoid
 * emitting an empty `<ins>` that AdSense would flag as invalid.
 */
export function AdSlot({ slot, format = "auto", className }: AdSlotProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const hasSlot = Boolean(slot);
  const pushed = useRef(false);

  useEffect(() => {
    if (!publisherId || !hasSlot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not yet loaded — push will be retried on hydration
    }
  }, [publisherId, hasSlot]);

  // ── Dev / missing-env fallback ──────────────────────────────────────────────
  if (isDev || !publisherId) {
    // In production without a publisher ID, stay silent — no empty <ins>.
    if (!isDev) return null;

    const minHeight = FORMAT_MIN_HEIGHT[format];
    const label = FORMAT_LABEL[format];

    return (
      <Box
        sx={{
          my: 2,
          width: "100%",
          minHeight,
          border: "1.5px dashed",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.02)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <Typography variant="caption" color="text.disabled" fontWeight={600}>
          Ad slot — {label}
        </Typography>
        {hasSlot ? (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ opacity: 0.6 }}
          >
            slot {slot}
          </Typography>
        ) : (
          <Typography
            variant="caption"
            sx={{ color: "warning.main", opacity: 0.8 }}
          >
            ⚠ NEXT_PUBLIC_ADSENSE_SLOT_* not set
          </Typography>
        )}
      </Box>
    );
  }

  // ── Production: skip render entirely when slot is missing ───────────────────
  if (!hasSlot) return null;

  return (
    <Box sx={{ textAlign: "center", my: 2, overflow: "hidden", minHeight: 0 }}>
      <ins
        className={`adsbygoogle${className ? ` ${className}` : ""}`}
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </Box>
  );
}
