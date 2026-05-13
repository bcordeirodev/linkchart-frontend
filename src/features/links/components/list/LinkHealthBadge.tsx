"use client";
import { Box, Tooltip, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import type { LinkHealth, LinkHealthStatus } from "@/types";

const HEALTH_COLORS: Record<LinkHealthStatus, string> = {
  ok: "success.main",
  error: "error.main",
  unknown: "text.disabled",
};

const HEALTH_LABEL_KEYS = {
  ok: "health.ok",
  error: "health.error",
  unknown: "health.unknown",
} as const;

const HEALTH_TOOLTIP_KEYS = {
  ok: "health.tooltip.ok",
  error: "health.tooltip.error",
  unknown: "health.tooltip.unknown",
} as const;

interface LinkHealthBadgeProps {
  health?: LinkHealth | null;
}

export function LinkHealthBadge({ health }: LinkHealthBadgeProps) {
  const { t, i18n } = useTranslation("links");
  const dateLocale = i18n.language === "pt-BR" ? ptBR : enUS;

  const status: LinkHealthStatus = health?.status ?? "unknown";
  const color = HEALTH_COLORS[status];
  const label = t(HEALTH_LABEL_KEYS[status]);

  const tooltipContent = (
    <Box>
      <Typography variant="caption" display="block">
        {t(HEALTH_TOOLTIP_KEYS[status])}
      </Typography>
      {health?.last_checked_at && (
        <Typography variant="caption" display="block" sx={{ opacity: 0.75 }}>
          {t("health.tooltip.checked_ago", {
            time: formatDistanceToNow(new Date(health.last_checked_at), {
              locale: dateLocale,
            }),
          })}
        </Typography>
      )}
    </Box>
  );

  return (
    <Tooltip title={tooltipContent}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: color,
            flexShrink: 0,
          }}
        />
        <Typography variant="caption" sx={{ color, fontWeight: 500 }}>
          {label}
        </Typography>
      </Box>
    </Tooltip>
  );
}
