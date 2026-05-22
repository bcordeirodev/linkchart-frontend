import { getLinksPanelSx } from "@/features/links/components/list/linksPanelStyles";

import type { Theme } from "@mui/material/styles";

/** Panel shell for create/edit link forms — matches links list cards. */
export function getLinkFormPanelSx(theme: Theme) {
  return getLinksPanelSx(theme);
}
