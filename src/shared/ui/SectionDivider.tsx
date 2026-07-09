import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface SectionDividerProps {
  /** Section heading text (already translated). */
  title: string;
  /** Optional icon rendered before the title. */
  icon?: ReactNode;
  /** Bottom margin (theme spacing units). Defaults to 2. */
  mb?: number;
}

/**
 * High-contrast section heading with a thin rule filling the remaining width.
 *
 * Replaces low-contrast uppercase caption labels (e.g. a faint "TRAFFIC
 * PATTERNS"): the title uses `subtitle2` weight 600 in `text.primary` so it
 * reads clearly on the dark surface.
 */
export function SectionDivider({ title, icon, mb = 2 }: SectionDividerProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb }}>
      {icon ? (
        <Box
          sx={{
            display: "inline-flex",
            color: "text.secondary",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      ) : null}
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: "text.primary",
          letterSpacing: "-0.01em",
          flexShrink: 0,
        }}
      >
        {title}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
    </Box>
  );
}

export default SectionDivider;
