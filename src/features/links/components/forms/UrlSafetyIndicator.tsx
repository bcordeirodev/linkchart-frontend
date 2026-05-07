import { Box, CircularProgress, Typography } from "@mui/material";
import { ShieldAlert, ShieldCheck, ShieldOff } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";

import type { UrlSafetyStatus } from "../../hooks/useUrlSafetyCheck";

interface UrlSafetyIndicatorProps {
  status: UrlSafetyStatus;
  threats?: string[];
}

export function UrlSafetyIndicator({
  status,
  threats = [],
}: UrlSafetyIndicatorProps) {
  const { t } = useTranslation("links");

  if (status === "idle") return null;

  const configs = {
    checking: {
      color: "text.disabled" as const,
      label: t("form.safety.checking"),
      icon: <CircularProgress size={13} color="inherit" />,
    },
    safe: {
      color: "success.main" as const,
      label: t("form.safety.safe"),
      icon: <ShieldCheck {...ICON_SM} />,
    },
    unsafe: {
      color: "error.main" as const,
      label: "",
      icon: <ShieldAlert {...ICON_SM} />,
    },
    error: {
      color: "text.disabled" as const,
      label: t("form.safety.error"),
      icon: <ShieldOff {...ICON_SM} />,
    },
  };

  const cfg = configs[status];
  const label =
    status === "unsafe"
      ? t("form.safety.unsafe", { threats: threats.join(", ") })
      : cfg.label;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        color: cfg.color,
        mt: 0.25,
      }}
    >
      {cfg.icon}
      <Typography
        variant="caption"
        color="inherit"
        fontWeight={status === "unsafe" ? 600 : 400}
      >
        {label}
      </Typography>
    </Box>
  );
}
