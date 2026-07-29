"use client";

import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Link,
  Popover,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { useTranslation } from "react-i18next";

import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

export interface BioPublicUrlBarProps {
  /**
   * Absolute public URL of the persisted page — the backend's own `url`
   * field (`resolvePublicPageUrl(page.url)`). The caller only renders this
   * bar for pages with a bound address, so this is always the subdomain's
   * root URL — never the technical `/@{handle}` fallback, which the product
   * does not surface anywhere.
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
  const [qrAnchor, setQrAnchor] = useState<HTMLElement | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // QR gerado sob demanda na primeira abertura do popover (import dinâmico —
  // a lib fica fora do bundle da página até alguém pedir o QR), mesmo padrão
  // do ShorterQrPanel.
  useEffect(() => {
    if (!qrAnchor || qrDataUrl) {
      return;
    }
    let cancelled = false;
    void import("qrcode").then((QRCode) =>
      QRCode.default
        .toDataURL(url, {
          width: 176,
          margin: 1,
          color: { dark: "#0B0B0F", light: "#FFFFFF" },
          errorCorrectionLevel: "M",
        })
        .then((dataUrl) => {
          if (!cancelled) setQrDataUrl(dataUrl);
        })
        .catch(() => {
          /* popover mantém o skeleton */
        }),
    );
    return () => {
      cancelled = true;
    };
  }, [qrAnchor, qrDataUrl, url]);

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
          <Tooltip title={t("form.publicUrlQr")}>
            <IconButton
              size="small"
              aria-label={t("form.publicUrlQr")}
              onClick={(e) => setQrAnchor(e.currentTarget)}
              sx={{ width: { xs: 44, sm: 36 }, height: { xs: 44, sm: 36 } }}
            >
              <QrCode2Icon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Popover
            open={!!qrAnchor}
            anchorEl={qrAnchor}
            onClose={() => setQrAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ p: 1.5, textAlign: "center" }}>
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URI local, sem otimização a fazer
                <img
                  src={qrDataUrl}
                  alt={t("form.publicUrlQrAlt", {
                    url: url.replace(/^https?:\/\//, ""),
                  })}
                  width={176}
                  height={176}
                  style={{ display: "block", borderRadius: 8 }}
                />
              ) : (
                <Skeleton variant="rounded" width={176} height={176} />
              )}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.75 }}
              >
                {url.replace(/^https?:\/\//, "")}
              </Typography>
            </Box>
          </Popover>
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
