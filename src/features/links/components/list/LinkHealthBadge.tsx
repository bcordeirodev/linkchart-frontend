"use client";
import { Box, Tooltip, Typography } from "@mui/material";
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

interface LinkHealthBadgeProps {
  health?: LinkHealth | null;
}

export function LinkHealthBadge({ health }: LinkHealthBadgeProps) {
  const { t } = useTranslation("links");
  const status: LinkHealthStatus = health?.status ?? "unknown";
  const color = HEALTH_COLORS[status];
  const label = t(HEALTH_LABEL_KEYS[status]);

  return (
    <Tooltip title={label}>
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
