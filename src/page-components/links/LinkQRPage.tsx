"use client";

import { useState, useEffect, useMemo } from "react";
import { Alert, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";

import { LinkActions } from "@/features/links";
import { LinkQRPanel } from "@/features/links/components/qr";
import { useLinkById } from "@/features/links/hooks/useLinks";
import { useShortUrl } from "@/features/links/hooks/useShortUrl";
import { useShareAPI } from "@/shared/hooks/useShareAPI";
import { QRCodeSkeleton } from "@/shared/ui/feedback/skeletons";
import { ResponsiveContainer } from "@/shared/ui/base";

import AuthGuardRedirect from "../../lib/auth/AuthGuardRedirect";

interface Props {
  id: string;
}

function LinkQRPage({ id }: Props) {
  const navigate = useNavigate();
  const { t: tPublic } = useTranslation("public");
  const {
    data: rawLink,
    isLoading: loading,
    error: fetchError,
  } = useLinkById(id);
  const { shareOrCopy } = useShareAPI();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [qrError, setQrError] = useState<string | null>(null);

  const slug = rawLink?.slug || rawLink?.custom_slug || "";
  const shortUrl = useShortUrl(slug);

  const linkInfo = useMemo(() => {
    if (!rawLink) {
      return null;
    }
    return { ...rawLink, short_url: shortUrl || rawLink.short_url };
  }, [rawLink, shortUrl]);

  const error = fetchError ? (fetchError as Error).message : qrError;

  useEffect(() => {
    if (!linkInfo?.short_url) {
      return;
    }

    try {
      new URL(linkInfo.short_url);
    } catch {
      setQrError(tPublic("qr.errors.invalidUrl"));
      return;
    }

    setQrError(null);
    import("qrcode").then((QRCode) =>
      QRCode.default
        .toDataURL(linkInfo.short_url, {
          width: 240,
          margin: 2,
          color: { dark: "#000000", light: "#FFFFFF" },
          errorCorrectionLevel: "M",
        })
        .then(setQrCodeDataUrl)
        .catch((err) =>
          setQrError(
            err instanceof Error
              ? err.message
              : tPublic("qr.errors.invalidUrl"),
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
      text: `QR Code: ${linkInfo.title || linkInfo.original_url}`,
      url: linkInfo.short_url,
    });
  };

  if (!id) {
    return (
      <AuthGuardRedirect auth={["user", "admin"]} fallback={<QRCodeSkeleton />}>
        <ResponsiveContainer variant="form" maxWidth="md">
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
        <ResponsiveContainer variant="form" maxWidth="md">
          <Alert severity="error">
            {error || tPublic("qr.errors.notFound")}
          </Alert>
        </ResponsiveContainer>
      </AuthGuardRedirect>
    );
  }

  return (
    <AuthGuardRedirect auth={["user", "admin"]} fallback={<QRCodeSkeleton />}>
      <ResponsiveContainer variant="form" maxWidth="md">
        <Stack spacing={{ xs: 2, sm: 2.5 }} component="section">
          <LinkActions
            linkId={id}
            currentView="qr"
            slug={slug}
            title={linkInfo.title || linkInfo.original_url}
            onDeleteSuccess={handleDeleteSuccess}
          />

          <LinkQRPanel
            link={linkInfo}
            qrCodeDataUrl={qrCodeDataUrl}
            qrLoading={!qrCodeDataUrl && !qrError}
            onDownload={handleDownloadQR}
            onShare={handleShareQR}
          />
        </Stack>
      </ResponsiveContainer>
    </AuthGuardRedirect>
  );
}

export default LinkQRPage;
