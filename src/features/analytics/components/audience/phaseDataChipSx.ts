import { alpha } from "@mui/material/styles";

import type { SxProps } from "@mui/material";
import type { Theme } from "@mui/material/styles";

export function getPhaseDataChipSx(theme: Theme): SxProps<Theme> {
  const isDark = theme.palette.mode === "dark";

  return {
    bgcolor: alpha(theme.palette.info.main, isDark ? 0.28 : 0.78),
    border: `1px solid ${alpha(theme.palette.info.main, isDark ? 0.58 : 0.88)}`,
    color: alpha(theme.palette.common.white, 0.96),
    fontWeight: 500,
    "& .MuiChip-label": {
      px: 1.2,
    },
    "& .MuiChip-icon": {
      color: alpha(theme.palette.common.white, 0.92),
    },
  };
}
