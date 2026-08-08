"use client";

import { Chip, Stack, Tooltip, Typography } from "@mui/material";
import { format, isValid } from "date-fns";
import { useTranslation } from "react-i18next";

import { formatAnalyticsLabel } from "@/features/analytics/utils/displayLabels";
import type { LinkClickItem } from "@/features/links/types/click";
import type { MRT_Cell, MRT_Row } from "material-react-table";

interface CellProps {
  row: MRT_Row<LinkClickItem>;
  cell?: MRT_Cell<LinkClickItem, unknown>;
}

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

export function formatLocation(click: LinkClickItem): string {
  const parts = [
    click.city,
    click.state_name || click.state,
    click.country,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

const DIRECT_SOURCE_SENTINEL = "__direct__";

export function formatReferer(click: LinkClickItem): string {
  if (!click.referer || click.referer === "-") {
    return DIRECT_SOURCE_SENTINEL;
  }

  return click.referer_host || click.referer;
}

/** Date/time cell — also shows timezone caption and a "Returning" badge. */
export function WhenCell({ row }: CellProps) {
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

export function LocationCell({ row }: CellProps) {
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
export function DeviceCell({ row }: CellProps) {
  const click = row.original;
  const label = click.device
    ? formatAnalyticsLabel(click.device)
    : click.is_mobile
      ? "Mobile"
      : click.is_desktop
        ? "Desktop"
        : "—";

  const osLabel = click.os
    ? click.os_version
      ? `${formatAnalyticsLabel(click.os)} ${click.os_version}`
      : formatAnalyticsLabel(click.os)
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

export function BrowserCell({ row }: CellProps) {
  const { browser, browser_version: ver } = row.original;

  if (!browser) {
    return <span>—</span>;
  }

  const browserLabel = formatAnalyticsLabel(browser);
  return <span>{ver ? `${browserLabel} ${ver}` : browserLabel}</span>;
}

/**
 * Traffic source based on `click_source` (direct/social/search/email/referral).
 *
 * Direct/unknown is the default state and reads quiet; the named sources keep
 * their semantic color as text — color only where it carries information.
 */
export function SourceCell({ row }: CellProps) {
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

export function RefererCell({ row }: CellProps) {
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
export function SocialPlatformCell({ row }: CellProps) {
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
export function QualityTierCell({ row }: CellProps) {
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

export function UtmCell({ row }: CellProps) {
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
