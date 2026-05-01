import { Box, CircularProgress, Typography } from "@mui/material";
import { ShieldAlert, ShieldCheck, ShieldOff } from "lucide-react";

import { ICON_SM } from "@/lib/theme/iconDefaults";

import type { UrlSafetyStatus } from "../../hooks/useUrlSafetyCheck";

interface UrlSafetyIndicatorProps {
  status: UrlSafetyStatus;
  threats?: string[];
}

const configs = {
  checking: {
    color: "text.disabled" as const,
    label: "Verificando segurança...",
    icon: <CircularProgress size={13} color="inherit" />,
  },
  safe: {
    color: "success.main" as const,
    label: "URL verificada — nenhuma ameaça detectada",
    icon: <ShieldCheck {...ICON_SM} />,
  },
  unsafe: {
    color: "error.main" as const,
    label: "",
    icon: <ShieldAlert {...ICON_SM} />,
  },
  error: {
    color: "text.disabled" as const,
    label: "Verificação de segurança indisponível",
    icon: <ShieldOff {...ICON_SM} />,
  },
};

export function UrlSafetyIndicator({
  status,
  threats = [],
}: UrlSafetyIndicatorProps) {
  if (status === "idle") return null;

  const cfg = configs[status];
  const label =
    status === "unsafe" ? `URL bloqueada: ${threats.join(", ")}` : cfg.label;

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
