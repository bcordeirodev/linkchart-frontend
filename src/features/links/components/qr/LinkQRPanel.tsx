"use client";

import type { ReactNode } from "react";
import { Download, Share2 } from "lucide-react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { LinkActionsShortUrl } from "@/features/links/components/LinkActions/LinkActionsShortUrl";
import { getLinkFormPanelSx } from "@/features/links/components/forms/linkFormPanelStyles";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import type { LinkResponse } from "@/types";

interface LinkQRPanelProps {
  link: LinkResponse & { short_url: string };
  qrCodeDataUrl: string;
  qrLoading: boolean;
  onDownload: () => void;
  onShare: () => void;
}

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 0.25, sm: 1 },
        py: 0.75,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontWeight: 600,
          minWidth: { sm: 100 },
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ minWidth: 0, wordBreak: "break-word" }}>
        {children}
      </Typography>
    </Box>
  );
}

export function LinkQRPanel({
  link,
  qrCodeDataUrl,
  qrLoading,
  onDownload,
  onShare,
}: LinkQRPanelProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t, i18n } = useTranslation("links");

  const createdLabel = link.created_at
    ? new Date(link.created_at).toLocaleDateString(
        i18n.language === "pt-BR" ? "pt-BR" : "en-US",
        { day: "2-digit", month: "short", year: "numeric" },
      )
    : "—";

  const qrFrameBg = alpha(theme.palette.text.primary, isDark ? 0.04 : 0.03);

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={getLinkFormPanelSx(theme)}
    >
      <Box sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 2, sm: 2.5 } }}>
        <Typography
          variant="overline"
          sx={{
            display: "block",
            color: "text.secondary",
            fontWeight: 600,
            letterSpacing: 0.6,
            mb: 0.5,
          }}
        >
          {t("qr.title")}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2.5, lineHeight: 1.55 }}
        >
          {t("qr.description")}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2.5, sm: 3 }}
          alignItems={{ sm: "flex-start" }}
        >
          <Box
            sx={{
              flexShrink: 0,
              mx: { xs: "auto", sm: 0 },
              p: 1.5,
              borderRadius: `${radiusTokens.md}px`,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: qrFrameBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: 200 },
              maxWidth: 200,
              aspectRatio: "1",
            }}
          >
            {qrCodeDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeDataUrl}
                alt={t("qr.title")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: radiusTokens.sm,
                }}
              />
            ) : (
              <CircularProgress size={28} />
            )}
          </Box>

          <Stack spacing={2} sx={{ flex: 1, minWidth: 0, width: "100%" }}>
            <LinkActionsShortUrl url={link.short_url} />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                variant="contained"
                size="small"
                startIcon={<Download {...ICON_MD} />}
                onClick={onDownload}
                disabled={!qrCodeDataUrl || qrLoading}
                sx={{ flex: { xs: 1, sm: "initial" } }}
              >
                {t("qr.download")}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<Share2 {...ICON_MD} />}
                onClick={onShare}
                disabled={!link.short_url}
                sx={{ flex: { xs: 1, sm: "initial" } }}
              >
                {t("qr.copy")}
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={0.5}>
          <MetaRow label={t("qr.originalUrl")}>{link.original_url}</MetaRow>
          <MetaRow label={t("qr.status")}>
            <Box
              component="span"
              sx={{
                color: link.is_active ? "success.main" : "text.secondary",
                fontWeight: 600,
              }}
            >
              {link.is_active ? t("qr.active") : t("qr.inactive")}
            </Box>
          </MetaRow>
          <MetaRow label={t("qr.createdAt")}>{createdLabel}</MetaRow>
        </Stack>
      </Box>
    </EnhancedPaper>
  );
}

export default LinkQRPanel;
