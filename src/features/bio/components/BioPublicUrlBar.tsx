"use client";

import { useState } from "react";
import { Box, IconButton, Link, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useTranslation } from "react-i18next";

import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import { getPublicBioUrl } from "../utils/publicBioUrl";

export interface BioPublicUrlBarProps {
  /**
   * Absolute public URL of the persisted page — the backend's own `url`
   * field (`resolvePublicPageUrl(page.url)`), which is the subdomain's root
   * for every page created (or re-saved) after the subdomain-first change,
   * and still `/@{handle}` for a legacy page that hasn't picked an address
   * yet.
   */
  url: string;
  /**
   * The page's handle — server-derived on create, or kept as-is on update
   * (see `BioPageUpsertInput.handle`), never edited from this form. Used to
   * compute the secondary `/@{handle}` address, still reachable even once a
   * subdomain is the primary one; shown only when it differs from `url`
   * (i.e. whenever a subdomain IS associated — a legacy page's `url` already
   * IS the `/@{handle}` address, so no second line is needed there).
   */
  handle: string;
}

/**
 * Read-only row showing the published bio page's public URL with copy/open
 * actions, plus — once a subdomain is the primary address — a discreet
 * secondary caption for the still-working `/@{handle}` fallback. Always
 * reflects the last SAVED handle/address — never the form's in-progress
 * draft — since the public URL only changes once the form is submitted.
 */
export function BioPublicUrlBar({ url, handle }: BioPublicUrlBarProps) {
  const theme = useTheme();
  const { t } = useTranslation("bio");
  const [copied, setCopied] = useState(false);

  const secondaryUrl = getPublicBioUrl(handle);
  const showSecondary = !!secondaryUrl && secondaryUrl !== url;

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
          {showSecondary ? (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ display: "block", mt: 0.375 }}
            >
              {t("form.publicUrlSecondary", {
                url: secondaryUrl.replace(/^https?:\/\//, ""),
              })}
            </Typography>
          ) : null}
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
