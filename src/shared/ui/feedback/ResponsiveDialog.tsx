"use client";

import { Dialog, type DialogProps } from "@mui/material";
import useThemeMediaQuery from "@/shared/hooks/useThemeMediaQuery";

/**
 * Drop-in MUI Dialog that becomes fullScreen on phones (< sm), where a
 * centered modal is cramped and easy to mis-tap. All DialogProps pass through;
 * an explicit `fullScreen` prop still wins on larger screens.
 */
export function ResponsiveDialog(props: DialogProps) {
  const isPhone = useThemeMediaQuery((theme) => theme.breakpoints.down("sm"));
  return <Dialog fullScreen={isPhone} {...props} />;
}

export default ResponsiveDialog;
