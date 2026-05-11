"use client";
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { BarChart3, Check, ClipboardCopy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ICON_SM, ICON_MD } from "@/lib/theme/iconDefaults";

import useClipboard from "@/hooks/useClipboard";

interface LinkActionsInlineProps {
  shortUrl: string;
  onAnalytics: () => void;
}

/**
 * Inline quick-action row attached to mobile link cards (Analytics + Copy).
 *
 * Analytics is rendered as a contained labeled button to maximize discoverability of
 * the per-link analytics page. Copy stays an icon-only IconButton because the
 * prominent short-URL chip above already provides the primary copy affordance.
 *
 * @param shortUrl - The fully qualified short URL to copy.
 * @param onAnalytics - Callback fired when the user taps the Analytics button.
 */
export function LinkActionsInline({
  shortUrl,
  onAnalytics,
}: LinkActionsInlineProps) {
  const { copied, copy } = useClipboard({ timeout: 1500 });
  const { t } = useTranslation("links");

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Tooltip title={t("actions.viewAnalytics", { ns: "common" })}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<BarChart3 {...ICON_SM} />}
          onClick={(e) => {
            e.stopPropagation();
            onAnalytics();
          }}
          sx={{
            flexShrink: 0,
            borderRadius: "20px",
            px: 1.25,
            py: 0.25,
            fontSize: "0.75rem",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          {t("actions.analytics")}
        </Button>
      </Tooltip>

      <Tooltip
        title={copied ? t("actions.copySuccess") : t("actions.copyLink")}
      >
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            copy(shortUrl);
          }}
          sx={{
            color: copied ? "success.main" : "text.secondary",
            "&:hover": {
              color: "primary.main",
              bgcolor: "rgba(25, 118, 210, 0.08)",
            },
          }}
        >
          {copied ? <Check {...ICON_MD} /> : <ClipboardCopy {...ICON_MD} />}
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
