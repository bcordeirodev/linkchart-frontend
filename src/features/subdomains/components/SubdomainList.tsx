"use client";

import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useTranslation } from "react-i18next";

import { typographyScale } from "@/lib/theme";
import { ResponsiveDialog } from "@/shared/ui/feedback";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import { useSubdomains } from "../hooks/useSubdomains";

import type { Theme } from "@mui/material/styles";
import type { SubdomainItem } from "../types";

/**
 * Translucent fill for this feature's in-page hairline cards (the address
 * row, the empty-list placeholder) — same formula as the global `MuiCard`
 * override (`alpha(white, 0.03)` dark / `alpha(black, 0.02)` light), applied
 * here via `EnhancedPaper`'s `sx` prop since `EnhancedPaper` itself defaults
 * to the solid `background.paper` fill. "Instrumento técnico" surface rule:
 * in-page cards read as a light veil over the page background, not an
 * opaque panel; the release confirmation dialog stays opaque (floating
 * surface, not covered by this helper).
 */
function getSubdomainCardSx(theme: Theme): { backgroundColor: string } {
  const isDark = theme.palette.mode === "dark";

  return {
    backgroundColor: isDark
      ? alpha(theme.palette.common.white, 0.03)
      : alpha(theme.palette.common.black, 0.02),
  };
}

/** Formats an ISO timestamp as a short localized date (e.g. "12 jul 2026"). */
function formatClaimedAt(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

interface SubdomainCardProps {
  item: SubdomainItem;
  onRelease: (item: SubdomainItem) => void;
  isReleasing: boolean;
}

/** One card per claimed subdomain: address, claimed-at date, copy/open/release. */
function SubdomainCard({ item, onRelease, isReleasing }: SubdomainCardProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation("subdomains");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.fullUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — clipboard permission denied or unavailable
    }
  };

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={{ ...getSubdomainCardSx(theme), mb: 0 }}
    >
      <Box
        sx={{
          p: { xs: 1.75, sm: 2 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Link
            href={item.fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              fontFamily: typographyScale.code.fontFamily,
              fontWeight: 600,
              fontSize: "0.95rem",
              color:
                theme.palette.mode === "dark" ? "common.white" : "text.primary",
              wordBreak: "break-all",
              display: "block",
            }}
          >
            {item.fullUrl.replace(/^https?:\/\//, "")}
          </Link>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.25 }}
          >
            {t("list.claimedAt", {
              date: formatClaimedAt(item.createdAt, i18n.language),
            })}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          <Tooltip title={copied ? t("list.copied") : t("list.copy")}>
            <IconButton
              size="small"
              aria-label={t("list.copy")}
              onClick={handleCopy}
              sx={{ width: { xs: 44, sm: 36 }, height: { xs: 44, sm: 36 } }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("list.openInNew")}>
            <IconButton
              size="small"
              component="a"
              href={item.fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("list.openInNew")}
              sx={{ width: { xs: 44, sm: 36 }, height: { xs: 44, sm: 36 } }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={() => onRelease(item)}
            disabled={isReleasing}
            sx={{
              minHeight: { xs: 44, sm: 36 },
              borderColor: "divider",
              color: "text.secondary",
              whiteSpace: "nowrap",
            }}
          >
            {isReleasing ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null}
            {t("list.release")}
          </Button>
        </Box>
      </Box>
    </EnhancedPaper>
  );
}

/**
 * Lists the authenticated user's active subdomains as a stack of cards, each
 * with copy/open actions and a release flow gated behind a confirmation
 * dialog (releasing stops the address from resolving — created links keep
 * the domain they were assigned, but it becomes unreachable).
 */
export function SubdomainList() {
  const theme = useTheme();
  const { t } = useTranslation("subdomains");
  const { subdomains, isLoading, release, isReleasing, releasingId } =
    useSubdomains();

  const [pendingRelease, setPendingRelease] = useState<SubdomainItem | null>(
    null,
  );

  const handleConfirmRelease = async () => {
    if (!pendingRelease) return;
    try {
      await release(pendingRelease.id);
      setPendingRelease(null);
    } catch {
      // Dialog stays open; the mutation's error state could be surfaced here
      // if release ever needs inline error messaging beyond the toast.
    }
  };

  if (isLoading) {
    return (
      <Stack spacing={1.5}>
        <Skeleton variant="rounded" height={72} />
        <Skeleton variant="rounded" height={72} />
      </Stack>
    );
  }

  if (subdomains.length === 0) {
    return (
      <EnhancedPaper
        variant="outlined"
        animated={false}
        sx={{
          ...getSubdomainCardSx(theme),
          p: { xs: 2.5, sm: 3 },
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t("list.empty")}
        </Typography>
      </EnhancedPaper>
    );
  }

  return (
    <>
      <Stack spacing={1.5}>
        {subdomains.map((item) => (
          <SubdomainCard
            key={item.id}
            item={item}
            onRelease={setPendingRelease}
            isReleasing={isReleasing && releasingId === item.id}
          />
        ))}
      </Stack>

      <ResponsiveDialog
        open={!!pendingRelease}
        onClose={() => setPendingRelease(null)}
      >
        <DialogTitle>{t("list.releaseDialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontFamily: typographyScale.code.fontFamily,
              fontWeight: 600,
              mb: 1,
            }}
          >
            {pendingRelease?.fullUrl.replace(/^https?:\/\//, "")}
          </DialogContentText>
          <DialogContentText>{t("list.releaseDialog.body")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingRelease(null)}>
            {t("list.releaseDialog.cancel")}
          </Button>
          <Button
            color="error"
            onClick={handleConfirmRelease}
            disabled={isReleasing}
          >
            {isReleasing ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            {t("list.releaseDialog.confirm")}
          </Button>
        </DialogActions>
      </ResponsiveDialog>
    </>
  );
}

export default SubdomainList;
