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
import { darkNeutral, lightNeutral } from "@/lib/theme/colors";
import { radiusTokens } from "@/lib/theme/designSystem";
import { ResponsiveDialog } from "@/shared/ui/feedback";
import { getCardSurfaceSx } from "@/shared/ui/base";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { AppIcon } from "@/shared/ui/icons";

import { useSubdomains } from "../hooks/useSubdomains";

import type { SubdomainItem } from "../types";

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

  const isDark = theme.palette.mode === "dark";

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={{
        ...getCardSurfaceSx(theme),
        mb: 0,
        transition: `background-color ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut}, border-color ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut}`,
        // Ganho de presença do gate: um leve banho de primary no hover em vez
        // de só escurecer/clarear a borda — sinaliza "esta linha tem ações"
        // sem depender de sombra.
        "&:hover": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            isDark ? 0.05 : 0.04,
          ),
          borderColor: alpha(theme.palette.primary.main, isDark ? 0.3 : 0.25),
        },
      }}
    >
      <Box
        sx={{
          minHeight: 72,
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
              fontSize: "1rem",
              color: isDark ? "common.white" : "text.primary",
              wordBreak: "break-all",
              display: "block",
            }}
          >
            {item.fullUrl.replace(/^https?:\/\//, "")}
          </Link>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.375 }}
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
 * dialog. Releasing stops the address from resolving; since 2026-08-17 the
 * backend migrates the links that pointed at it back to the default domain
 * (short URLs change, click history is preserved) — the dialog warns with
 * the affected-links count (`linksCount`) before the user confirms.
 */
export function SubdomainList() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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
      <Stack spacing={2.5}>
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
          ...getCardSurfaceSx(theme),
          p: { xs: 3, sm: 4 },
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            mx: "auto",
            mb: 1.5,
            borderRadius: `${radiusTokens.full}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // Poço recuado dentro do card, nos DOIS temas. O claro usava
            // `lightNeutral.surface` — exatamente a cor que `getCardSurfaceSx`
            // devolve para o card no light (`background.paper`), ou seja, o
            // círculo ficava sem preenchimento visível, só a hairline. O
            // canvas (`lightNeutral.bg`) é o degrau abaixo do card e espelha
            // o que `darkNeutral.elevated` já faz no dark.
            backgroundColor: isDark ? darkNeutral.elevated : lightNeutral.bg,
            border: `1px solid ${theme.palette.divider}`,
            color: "text.secondary",
          }}
        >
          <AppIcon intent="subdomain" size={22} aria-hidden />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t("list.empty")}
        </Typography>
      </EnhancedPaper>
    );
  }

  return (
    <>
      <Stack spacing={2.5}>
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
          {pendingRelease && pendingRelease.linksCount > 0 ? (
            <DialogContentText sx={{ mt: 1, color: "warning.main" }}>
              {t("list.releaseDialog.linksWarning", {
                count: pendingRelease.linksCount,
              })}
            </DialogContentText>
          ) : null}
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
