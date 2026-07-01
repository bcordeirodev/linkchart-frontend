"use client";

import { Box, Button, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Download, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";

export interface ShorterQrPanelProps {
  shortUrl: string;
  slug: string;
}

/** Scannable QR tile size in the success-card inset. */
export const SHORTER_QR_TILE_SIZE = 96;

/** Total grid column width for the QR side (tile + left gutter before divider). */
export const SHORTER_QR_COLUMN_WIDTH = SHORTER_QR_TILE_SIZE + 10;

const TILE_SIZE = SHORTER_QR_TILE_SIZE;

/** Compact QR tile for the guest success card inset. */
export function ShorterQrPanel({ shortUrl, slug }: ShorterQrPanelProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!shortUrl) {
      return;
    }
    void import("qrcode").then((QRCode) =>
      QRCode.default
        .toDataURL(shortUrl, {
          width: 200,
          margin: 1,
          color: { dark: "#0B0B0F", light: "#FFFFFF" },
          errorCorrectionLevel: "M",
        })
        .then((url) => {
          if (!cancelled) setDataUrl(url);
        })
        .catch(() => {
          /* keep skeleton tile */
        }),
    );
    return () => {
      cancelled = true;
    };
  }, [shortUrl]);

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

  return (
    <Box
      sx={{
        width: TILE_SIZE,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 0.5,
      }}
    >
      <Box
        sx={{
          width: TILE_SIZE,
          height: TILE_SIZE,
          p: 0.625,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#FFFFFF",
          borderRadius: `${radiusTokens.sm}px`,
          border: `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
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
            size={38}
            strokeWidth={1.25}
            aria-hidden
            color={alpha(theme.palette.common.black, 0.28)}
          />
        )}
      </Box>

      <Button
        onClick={handleDownload}
        disabled={!dataUrl}
        fullWidth
        startIcon={<Download {...ICON_SM} aria-hidden />}
        sx={{
          px: 0,
          py: 0.125,
          minHeight: 24,
          fontSize: "0.6875rem",
          fontWeight: 600,
          textTransform: "none",
          justifyContent: "center",
          color: theme.palette.text.secondary,
          "& .MuiButton-startIcon": { mr: 0.375, ml: 0 },
          "&:hover": {
            color: theme.palette.text.primary,
            bgcolor: "transparent",
          },
          "&.Mui-disabled": { opacity: 0.4 },
        }}
      >
        {t("shorter.downloadQr")}
      </Button>
    </Box>
  );
}
