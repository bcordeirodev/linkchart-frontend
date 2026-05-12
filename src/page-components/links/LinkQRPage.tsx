"use client";

import { Download, Share2 } from "lucide-react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";

import { LinkActions } from "@/features/links";
import { useLinkById } from "@/features/links/hooks/useLinks";
import { useShareAPI } from "@/features/links/hooks/useShareAPI";
import { QRCodeSkeleton } from "@/shared/ui/feedback/skeletons";
import { ResponsiveContainer } from "@/shared/ui/base";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";
import { getShortUrl } from "@/lib/utils/shortUrl";

interface Props {
  id: string;
}

/**
 * Renders the QR code for an existing link in a single consolidated card.
 * The `LinkActions` toolbar sits above and owns back navigation, title and
 * sibling actions. The separate "Informações do Link" card was folded into
 * this view because the same data is reachable from /links and /links/edit.
 */
function LinkQRPage({ id }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation("links");
  const { t: tPublic } = useTranslation("public");
  const {
    data: rawLink,
    isLoading: loading,
    error: fetchError,
  } = useLinkById(id);
  const { shareOrCopy } = useShareAPI();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [qrError, setQrError] = useState<string | null>(null);

  const linkInfo = useMemo(() => {
    if (!rawLink) return null;
    const slug = rawLink.slug || rawLink.custom_slug;
    if (slug) {
      return { ...rawLink, short_url: getShortUrl(slug) };
    }
    return rawLink;
  }, [rawLink]);

  const error = fetchError ? (fetchError as Error).message : qrError;

  useEffect(() => {
    if (!linkInfo?.short_url) return;

    try {
      new URL(linkInfo.short_url);
    } catch {
      setQrError(tPublic("qr.errors.invalidUrl"));
      return;
    }

    import("qrcode").then((QRCode) =>
      QRCode.default
        .toDataURL(linkInfo.short_url, {
          width: 200,
          margin: 2,
          color: { dark: "#000000", light: "#FFFFFF" },
          errorCorrectionLevel: "M",
        })
        .then(setQrCodeDataUrl)
        .catch((err) =>
          setQrError(
            `Erro ao gerar QR Code: ${err instanceof Error ? err.message : "Erro desconhecido"}`,
          ),
        ),
    );
  }, [linkInfo?.short_url, tPublic]);

  const handleDeleteSuccess = () => {
    navigate("/links");
  };

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl || !linkInfo) {
      return;
    }

    const link = document.createElement("a");
    link.download = `qr-code-${linkInfo.slug || linkInfo.id}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareQR = async () => {
    if (!linkInfo) {
      return;
    }

    await shareOrCopy({
      title: `QR Code - ${linkInfo.title || linkInfo.original_url}`,
      text: `Confira este QR Code para: ${linkInfo.title || linkInfo.original_url}`,
      url: linkInfo.short_url,
    });
  };

  if (!id) {
    return (
      <AuthGuardRedirect auth={["user", "admin"]} fallback={<QRCodeSkeleton />}>
        <ResponsiveContainer variant="page">
          <Alert severity="error">{tPublic("qr.errors.noId")}</Alert>
        </ResponsiveContainer>
      </AuthGuardRedirect>
    );
  }

  if (loading) {
    return (
      <AuthGuardRedirect auth={["user", "admin"]} fallback={<QRCodeSkeleton />}>
        <QRCodeSkeleton />
      </AuthGuardRedirect>
    );
  }

  if (error || !linkInfo) {
    return (
      <AuthGuardRedirect auth={["user", "admin"]} fallback={<QRCodeSkeleton />}>
        <ResponsiveContainer variant="page">
          <Alert severity="error">
            {error || tPublic("qr.errors.notFound")}
          </Alert>
        </ResponsiveContainer>
      </AuthGuardRedirect>
    );
  }

  return (
    <AuthGuardRedirect auth={["user", "admin"]} fallback={<QRCodeSkeleton />}>
      <ResponsiveContainer variant="page" maxWidth="md">
        <LinkActions
          linkId={id}
          currentView="qr"
          shortUrl={getShortUrl(linkInfo.slug || linkInfo.custom_slug || "")}
          title={linkInfo.title || linkInfo.original_url}
          onDeleteSuccess={handleDeleteSuccess}
        />

        <Card
          sx={{
            mt: 1,
            width: "100%",
            maxWidth: { xs: "100%", sm: 480 },
            mx: "auto",
          }}
        >
          <CardContent sx={{ py: 4, px: { xs: 3, sm: 4 } }}>
            <Typography
              variant="overline"
              sx={{
                display: "block",
                textAlign: "center",
                color: "text.secondary",
                letterSpacing: 0.6,
                mb: 2,
              }}
            >
              {t("qr.title")}
            </Typography>

            {qrCodeDataUrl ? (
              <Box
                sx={{
                  mx: "auto",
                  mb: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  style={{
                    width: "100%",
                    maxWidth: 200,
                    height: "auto",
                    aspectRatio: "1/1",
                    borderRadius: 8,
                    border: "1px solid #e0e0e0",
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  bgcolor: "grey.100",
                  mx: "auto",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                }}
              >
                <CircularProgress size={30} />
              </Box>
            )}

            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                wordBreak: "break-all",
                fontFamily: "monospace",
                color: "primary.main",
                mb: 2.5,
              }}
            >
              {linkInfo.short_url}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              justifyContent="center"
              sx={{ mb: 3 }}
            >
              <Button
                variant="contained"
                startIcon={<Download {...ICON_MD} />}
                onClick={handleDownloadQR}
                disabled={!qrCodeDataUrl}
                sx={{ minWidth: { xs: "100%", sm: 140 } }}
              >
                {t("qr.download")}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share2 {...ICON_MD} />}
                onClick={handleShareQR}
                disabled={!linkInfo}
                sx={{ minWidth: { xs: "100%", sm: 140 } }}
              >
                {t("qr.copy")}
              </Button>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={0.75}>
              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                <Box component="span" sx={{ color: "text.secondary", mr: 1 }}>
                  URL original
                </Box>
                {linkInfo.original_url}
              </Typography>
              <Typography variant="body2">
                <Box component="span" sx={{ color: "text.secondary", mr: 1 }}>
                  Status
                </Box>
                <Box
                  component="span"
                  sx={{
                    color: linkInfo.is_active ? "success.main" : "error.main",
                    fontWeight: 600,
                  }}
                >
                  {linkInfo.is_active ? "● Ativo" : "● Inativo"}
                </Box>
                <Box component="span" sx={{ color: "text.secondary", mx: 1 }}>
                  ·
                </Box>
                <Box component="span" sx={{ color: "text.secondary", mr: 1 }}>
                  Criado
                </Box>
                {new Date(linkInfo.created_at).toLocaleDateString("pt-BR")}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default LinkQRPage;
