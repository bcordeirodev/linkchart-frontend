"use client";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import { getLinkFormPanelSx } from "./linkFormPanelStyles";

interface LinkFormShellProps {
  children: React.ReactNode;
  footer: React.ReactNode;
  /** Optional alert above form fields (API errors). */
  alert?: React.ReactNode;
}

/**
 * Outlined form card for create/edit — no hover lift (static workspace).
 */
export function LinkFormShell({ children, footer, alert }: LinkFormShellProps) {
  const theme = useTheme();

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={getLinkFormPanelSx(theme)}
    >
      {alert ? <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: 2 }}>{alert}</Box> : null}
      <Box sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 2, sm: 2.5 } }}>
        {children}
      </Box>
      <Box
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: 1.75,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.02)"
              : "rgba(0,0,0,0.015)",
        }}
      >
        {footer}
      </Box>
    </EnhancedPaper>
  );
}

export default LinkFormShell;
