/**
 * 🎯 TAB PANEL - COMPONENTE BASE
 * Componente base para painéis de tabs reutilizável
 */

import { Box, Fade } from "@mui/material";

import type { TabPanelProps } from "../components";

/**
 * Accessible MUI-style tab panel — renders children only when `value === index`.
 *
 * Inactive panels short-circuit to `hidden` with no DOM body. Active panels mount inside `<Fade timeout={180}>` for a soft cross-fade. `TabPanelProps` (`value`, `index`, `children`, `sx`) lives in `../components`.
 */
export function TabPanel({
  children,
  value,
  index,
  sx,
  ...other
}: TabPanelProps) {
  const isActive = value === index;

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {isActive ? (
        <Fade in timeout={180}>
          <Box sx={{ py: 3, ...sx }}>{children}</Box>
        </Fade>
      ) : null}
    </div>
  );
}

export default TabPanel;
