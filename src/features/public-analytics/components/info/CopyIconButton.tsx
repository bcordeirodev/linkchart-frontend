"use client";

import { IconButton, useTheme } from "@mui/material";
import { Copy, Check } from "lucide-react";
import { alpha } from "@mui/material/styles";

import { ICON_SM } from "@/lib/theme/iconDefaults";

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
 * Bordered `IconButton` that toggles between Copy and Check icons.
 *
 * Used consistently by `ShortUrlRow` and `BookmarkRow` to provide a single
 * copy-to-clipboard affordance pattern across the hero card.
 *
 * @remarks
 * Relies on the caller to manage clipboard state via `useClipboard`.
 * Renders a subtle `border` + `bgcolor` shell that sits on any inset surface.
 */
export function CopyIconButton({
  copied,
  onClick,
  ariaLabel,
  disabled = false,
}: CopyIconButtonProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const iconColor = alpha(theme.palette.common.white, isDark ? 0.95 : 0.92);

  return (
    <IconButton
      size="small"
      onClick={onClick}
      aria-label={ariaLabel}
      color={copied ? "success" : "default"}
      disabled={disabled}
      sx={{
        alignSelf: { xs: "flex-end", sm: "center" },
        flexShrink: 0,
        color: copied ? theme.palette.success.main : iconColor,
        border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.35 : 0.4)}`,
        bgcolor: alpha(
          theme.palette.background.paper,
          isDark ? 0.5 : 0.86,
        ),
        "&:hover": {
          bgcolor: alpha(
            theme.palette.background.paper,
            isDark ? 0.65 : 0.94,
          ),
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
