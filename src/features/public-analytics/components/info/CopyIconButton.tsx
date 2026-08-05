"use client";

import { IconButton, useTheme } from "@mui/material";
import { Copy, Check } from "lucide-react";
import { alpha } from "@mui/material/styles";

import { ICON_SM } from "@/lib/theme/iconDefaults";
import { publicHairline } from "@/lib/theme/publicPageStyles";

interface CopyIconButtonProps {
  /** Whether the text was recently copied (controls icon + color). */
  copied: boolean;
  /** Called when the button is clicked. */
  onClick: () => void;
  /** Accessible label for screen readers (e.g. "Copy analytics page URL"). */
  ariaLabel: string;
  /** Disables the button when the text to copy is not yet available. */
  disabled?: boolean;
}

/**
 * Hairline square that toggles between Copy and Check icons.
 *
 * Same quiet grammar as the icon actions in the hero card's action row —
 * transparent fill, 1 px hairline, and the control radius and 36 px box the
 * theme already gives `MuiIconButton` — so the card has one kind of icon
 * button, not two. It used to carry a `background.paper` fill, which read as a
 * raised chip on top of the strip it belonged to.
 *
 * @remarks
 * Relies on the caller to manage clipboard state via `useClipboard`.
 */
export function CopyIconButton({
  copied,
  onClick,
  ariaLabel,
  disabled = false,
}: CopyIconButtonProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <IconButton
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      sx={{
        alignSelf: "center",
        flexShrink: 0,
        color: copied ? theme.palette.success.main : theme.palette.text.primary,
        border: `1px solid ${
          copied
            ? alpha(theme.palette.success.main, 0.4)
            : publicHairline(theme)
        }`,
        "&:hover": {
          borderColor: copied
            ? alpha(theme.palette.success.main, 0.6)
            : theme.palette.text.disabled,
          bgcolor: alpha(theme.palette.text.primary, isDark ? 0.06 : 0.04),
        },
        "&.Mui-disabled": {
          opacity: 0.4,
        },
      }}
    >
      {copied ? (
        <Check {...ICON_SM} aria-hidden />
      ) : (
        <Copy {...ICON_SM} aria-hidden />
      )}
    </IconButton>
  );
}
