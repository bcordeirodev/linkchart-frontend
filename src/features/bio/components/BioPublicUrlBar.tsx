"use client";

import { useState } from "react";
import { Box, IconButton, Link, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useTranslation } from "react-i18next";

import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

export interface BioPublicUrlBarProps {
  /**
   * Absolute public URL of the persisted page — the backend's own `url`
   * field (`resolvePublicPageUrl(page.url)`), which is the subdomain's root
   * for every page created (or re-saved) after the subdomain-first change,
   * and still `/@{handle}` for a legacy page that hasn't picked an address
   * yet.
   */
  url: string;
}

/**
 * Read-only row showing the published bio page's public URL with copy/open
 * actions. Shows a single address on purpose — the subdomain IS the page's
 * identity; the technical `/@{handle}` fallback keeps working but is not
 * surfaced to the user (product decision, 2026-07-27). Always reflects the
 * last SAVED address — never the form's in-progress draft.
 */
export function BioPublicUrlBar({ url }: BioPublicUrlBarProps) {
  const theme = useTheme();
  const { t } = useTranslation("bio");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — clipboard permission denied or unavailable
    }
  };

  return (
    <EnhancedPaper variant="outlined" sx={{ mb: 0 }}>
      <Box
        sx={{
          p: { xs: 1.5, sm: 1.75 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", fontWeight: 600, mb: 0.25 }}
          >
            {t("form.publicUrlLabel")}
          </Typography>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              fontFamily: "monospace",
              fontWeight: 600,
              fontSize: "0.9rem",
              color:
                theme.palette.mode === "dark" ? "common.white" : "text.primary",
              wordBreak: "break-all",
              display: "block",
            }}
          >
            {url.replace(/^https?:\/\//, "")}
          </Link>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          <Tooltip
            title={copied ? t("form.publicUrlCopied") : t("form.publicUrlCopy")}
          >
            <IconButton
              size="small"
              aria-label={t("form.publicUrlCopy")}
              onClick={handleCopy}
              sx={{ width: { xs: 44, sm: 36 }, height: { xs: 44, sm: 36 } }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("form.publicUrlOpen")}>
            <IconButton
              size="small"
              component="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("form.publicUrlOpen")}
              sx={{ width: { xs: 44, sm: 36 }, height: { xs: 44, sm: 36 } }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </EnhancedPaper>
  );
}

export default BioPublicUrlBar;
