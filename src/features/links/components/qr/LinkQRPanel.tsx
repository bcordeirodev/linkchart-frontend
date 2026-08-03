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
import { SectionLabel } from "@/shared/ui/base";
import { WhatsAppIcon } from "@/shared/ui/icons";

import type { LinkResponse } from "@/types";

/** WhatsApp brand green, used as the WhatsApp share button background. */
const WHATSAPP_GREEN = "#25D366";
/** Slightly darker WhatsApp green for the hover state. */
const WHATSAPP_GREEN_HOVER = "#1EB257";

interface LinkQRPanelProps {
  link: LinkResponse & { short_url: string };
  qrCodeDataUrl: string;
  qrLoading: boolean;
  onDownload: () => void;
  onShare: () => void;
}

/** Label/value row for the QR panel's metadata block (original URL, status, created date). */
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

/**
 * `/links/qr/[id]` content panel: QR image, download/share/WhatsApp actions,
 * and a short metadata block (original URL, status, created date). Level-1
 * hairline shell (`getLinkFormPanelSx`, shared with `LinkFormShell`) and a
 * `SectionLabel` header — same panel/section grammar as the create/edit form.
 */
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
        <SectionLabel headingLevel={2}>{t("qr.title")}</SectionLabel>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.75, mb: 2.5, lineHeight: 1.55 }}
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
                variant="contained"
                color="primary"
                size="small"
                disableElevation
                startIcon={<Share2 {...ICON_MD} />}
                onClick={onShare}
                disabled={!link.short_url}
                sx={{ flex: { xs: 1, sm: "initial" } }}
              >
                {t("qr.copy")}
              </Button>
              <Button
                variant="contained"
                size="small"
                disableElevation
                startIcon={<WhatsAppIcon size={18} aria-hidden />}
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(link.short_url)}`,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
                disabled={!link.short_url}
                sx={{
                  flex: { xs: 1, sm: "initial" },
                  color: theme.palette.common.white,
                  bgcolor: WHATSAPP_GREEN,
                  "&:hover": { bgcolor: WHATSAPP_GREEN_HOVER },
                }}
              >
                {t("qr.shareWhatsapp")}
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
