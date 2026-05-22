"use client";
import type { ReactNode } from "react";
import { Box, CircularProgress } from "@mui/material";
import { ShieldAlert, ShieldCheck, ShieldOff } from "lucide-react";
import { motion } from "framer-motion";
import type { TFunction } from "i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";

import type { UrlSafetyStatus } from "../../hooks/useUrlSafetyCheck";

/**
 * Phantom pill chip for the `safe` URL safety state. Fades and slides in
 * from slightly above so the transition feels deliberate without being noisy.
 */
function SafeChip({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}): ReactNode {
  return (
    <motion.span
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px 2px 6px",
        borderRadius: 100,
        background: "rgba(74, 222, 128, 0.07)",
        border: "1px solid rgba(74, 222, 128, 0.16)",
        color: "#4ade80",
        fontWeight: 500,
        lineHeight: 1.4,
        verticalAlign: "middle",
      }}
    >
      {icon}
      <span>{label}</span>
    </motion.span>
  );
}

/**
 * Returns a ReactNode for use as TextField helperText representing the URL
 * safety check status. Pass directly to the `helperText` prop.
 *
 * The `safe` state renders as a subtle phantom pill chip with an entry
 * animation; all other states render as a plain icon + text span.
 *
 * @param status - current safety check status (must not be "idle")
 * @param threats - threat type strings returned by the safe-browsing API
 * @param t - translation function from useTranslation("links")
 */
export function getUrlSafetyHelperNode(
  status: Exclude<UrlSafetyStatus, "idle">,
  threats: string[],
  t: TFunction<"links">,
): ReactNode {
  const configs = {
    checking: {
      icon: <CircularProgress size={11} color="inherit" />,
      label: t("form.safety.checking"),
      bold: false,
    },
    safe: {
      icon: <ShieldCheck {...ICON_SM} />,
      label: t("form.safety.safe"),
      bold: false,
    },
    unsafe: {
      icon: <ShieldAlert {...ICON_SM} />,
      label: t("form.safety.unsafe", { threats: threats.join(", ") }),
      bold: true,
    },
    error: {
      icon: <ShieldOff {...ICON_SM} />,
      label: t("form.safety.error"),
      bold: false,
    },
  };

  const { icon, label, bold } = configs[status];

  if (status === "safe") {
    return <SafeChip icon={icon} label={label} />;
  }

  return (
    <Box
      component="span"
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
    >
      {icon}
      <Box component="span" sx={{ fontWeight: bold ? 600 : 400 }}>
        {label}
      </Box>
    </Box>
  );
}
