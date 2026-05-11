import type { ReactNode } from "react";
import { Box, CircularProgress } from "@mui/material";
import { ShieldAlert, ShieldCheck, ShieldOff } from "lucide-react";
import type { TFunction } from "i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";

import type { UrlSafetyStatus } from "../../hooks/useUrlSafetyCheck";

/**
 * Returns a ReactNode for use as TextField helperText representing the URL
 * safety check status. Pass directly to the `helperText` prop.
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
