"use client";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Download, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";

/** Props for the inline QR-code panel shown inside the guest success card. */
export interface ShorterQrPanelProps {
  /** Fully-resolved short URL the QR code should encode. */
  shortUrl: string;
  /** Link slug — used to name the downloaded PNG file. */
  slug: string;
}

/**
 * Compact QR-code panel for the `/shorter` success card.
 *
 * Renders a white, always-scannable tile (the QR stays dark-on-white in both
 * themes) plus a "point your camera" hint and a download affordance. The PNG is
 * generated client-side via the `qrcode` library — the same dependency used by
 * the authenticated `/links/qr/{id}` page — so no extra request is made.
 *
 * The tile is the card's signature visual: it turns the otherwise text-only
 * confirmation into a tangible, ready-to-share artifact.
 */
export function ShorterQrPanel({ shortUrl, slug }: ShorterQrPanelProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  /*
   * Generate the QR as a data URL once the short URL is known. Colors are pinned
   * to pure black-on-white regardless of theme so the code always scans; the
   * surrounding tile supplies the framing. Errors are swallowed — the panel
   * simply stays in its skeleton state rather than breaking the success card.
   */
  useEffect(() => {
    let cancelled = false;
    if (!shortUrl) {
      return;
    }
    void import("qrcode").then((QRCode) =>
      QRCode.default
        .toDataURL(shortUrl, {
          width: 240,
          margin: 1,
          color: { dark: "#0B0B0F", light: "#FFFFFF" },
          errorCorrectionLevel: "M",
        })
        .then((url) => {
          if (!cancelled) setDataUrl(url);
        })
        .catch(() => {
          /* keep skeleton tile — QR is a progressive enhancement */
        }),
    );
    return () => {
      cancelled = true;
    };
  }, [shortUrl]);

  /** Triggers a browser download of the generated QR PNG. */
  const handleDownload = (): void => {
    if (!dataUrl) {
      return;
    }
    const anchor = document.createElement("a");
    anchor.download = `qr-${slug || "link"}.png`;
    anchor.href = dataUrl;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const tileSize = 132;

  return (
    <Stack
      alignItems="center"
      spacing={1}
      sx={{ flexShrink: 0, width: { xs: "100%", sm: "auto" } }}
    >
      <Box
        sx={{
          width: tileSize,
          height: tileSize,
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#FFFFFF",
          borderRadius: `${radiusTokens.md}px`,
          border: `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
          boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.16)}`,
        }}
      >
        {dataUrl ? (
          <Box
            component="img"
            src={dataUrl}
            alt={t("shorter.qrAlt")}
            sx={{ width: "100%", height: "100%", display: "block" }}
          />
        ) : (
          <QrCode
            size={48}
            strokeWidth={1.25}
            aria-hidden
            color={alpha(theme.palette.common.black, 0.28)}
          />
        )}
      </Box>

      <Typography
        component="span"
        sx={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          textAlign: "center",
          lineHeight: 1.3,
          color: alpha(
            theme.palette.text.primary,
            theme.palette.mode === "dark" ? 0.58 : 0.6,
          ),
        }}
      >
        {t("shorter.qrHint")}
      </Typography>

      <Button
        onClick={handleDownload}
        disabled={!dataUrl}
        startIcon={<Download {...ICON_SM} aria-hidden />}
        sx={{
          px: 1.25,
          py: 0.4,
          minHeight: 0,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "none",
          color: theme.palette.text.secondary,
          "&:hover": {
            color: theme.palette.text.primary,
            bgcolor: alpha(theme.palette.text.primary, 0.05),
          },
          "&.Mui-disabled": { opacity: 0.4 },
        }}
      >
        {t("shorter.downloadQr")}
      </Button>
    </Stack>
  );
}
