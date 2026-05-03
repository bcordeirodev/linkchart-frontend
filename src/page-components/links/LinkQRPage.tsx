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
  }, [linkInfo?.short_url]);

  // Handler para quando o link for excluído com sucesso
  const handleDeleteSuccess = () => {
    navigate("/links");
  };

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl || !linkInfo) {
      return;
    }

    // Criar link de download
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
      <AuthGuardRedirect auth={["user", "admin"]}>
        <ResponsiveContainer variant="page">
          <Alert severity="error">{tPublic("qr.errors.noId")}</Alert>
        </ResponsiveContainer>
      </AuthGuardRedirect>
    );
  }

  if (loading) {
    return (
      <AuthGuardRedirect auth={["user", "admin"]}>
        <QRCodeSkeleton />
      </AuthGuardRedirect>
    );
  }

  if (error || !linkInfo) {
    return (
      <AuthGuardRedirect auth={["user", "admin"]}>
        <ResponsiveContainer variant="page">
          <Alert severity="error">
            {error || tPublic("qr.errors.notFound")}
          </Alert>
        </ResponsiveContainer>
      </AuthGuardRedirect>
    );
  }

  return (
    <AuthGuardRedirect auth={["user", "admin"]}>
      <ResponsiveContainer variant="page" maxWidth="md">
        {/* Ações do Link */}
        <LinkActions
          linkId={id}
          shortUrl={linkInfo.slug || linkInfo.custom_slug}
          onDeleteSuccess={handleDeleteSuccess}
          currentPage="qr"
          actions={{
            showQR: false, // Ocultar QR na página de QR Code
          }}
        />

        {/* Header */}
        <Box sx={{ mb: 4, mt: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, mb: 2 }}
          >
            {t("qr.title")}
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              wordBreak: "break-word",
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            {linkInfo.title || linkInfo.original_url}
          </Typography>
        </Box>

        {/* QR Code */}
        <Card sx={{ mb: 4, maxWidth: { xs: "100%", sm: 400 }, mx: "auto" }}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t("qr.title")}
            </Typography>

            {/* QR Code Real */}
            {qrCodeDataUrl ? (
              <Box
                sx={{
                  mx: "auto",
                  mb: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
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
              color="text.secondary"
              sx={{
                mb: 3,
                wordBreak: "break-all",
                fontSize: { xs: "0.8rem", md: "0.875rem" },
              }}
            >
              {linkInfo.short_url}
            </Typography>

            {/* Ações */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2 },
                justifyContent: "center",
                flexWrap: "wrap",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                variant="contained"
                startIcon={<Download {...ICON_MD} />}
                onClick={handleDownloadQR}
                disabled={!qrCodeDataUrl}
                sx={{
                  minWidth: { xs: "100%", sm: 140 },
                  fontSize: { xs: "0.875rem", md: "0.875rem" },
                }}
              >
                {t("qr.download")}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share2 {...ICON_MD} />}
                onClick={handleShareQR}
                disabled={!linkInfo}
                sx={{
                  minWidth: { xs: "100%", sm: 140 },
                  fontSize: { xs: "0.875rem", md: "0.875rem" },
                }}
              >
                {t("qr.copy")}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Informações do Link */}
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}
            >
              Informações do Link
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1.5, md: 1 },
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.875rem", md: "0.875rem" } }}
              >
                <strong>URL Original:</strong>{" "}
                <Box
                  component="span"
                  sx={{
                    wordBreak: "break-all",
                    color: "text.secondary",
                  }}
                >
                  {linkInfo.original_url}
                </Box>
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.875rem", md: "0.875rem" } }}
              >
                <strong>URL Encurtada:</strong>{" "}
                <Box
                  component="span"
                  sx={{
                    wordBreak: "break-all",
                    color: "primary.main",
                    fontFamily: "monospace",
                  }}
                >
                  {linkInfo.short_url}
                </Box>
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.875rem", md: "0.875rem" } }}
              >
                <strong>Status:</strong>{" "}
                <Box
                  component="span"
                  sx={{
                    color: linkInfo.is_active ? "success.main" : "error.main",
                    fontWeight: 600,
                  }}
                >
                  {linkInfo.is_active ? "Ativo" : "Inativo"}
                </Box>
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.875rem", md: "0.875rem" } }}
              >
                <strong>Criado em:</strong>{" "}
                <Box component="span" sx={{ color: "text.secondary" }}>
                  {new Date(linkInfo.created_at).toLocaleDateString("pt-BR")}
                </Box>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default LinkQRPage;
