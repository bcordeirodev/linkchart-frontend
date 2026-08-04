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
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { typographyScale } from "@/lib/theme";
import { darkNeutral, lightNeutral } from "@/lib/theme/colors";
import { radiusTokens } from "@/lib/theme/designSystem";
import { getCardSurfaceSx } from "@/shared/ui/base";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { ResponsiveDialog } from "@/shared/ui/feedback";
import { AppIcon } from "@/shared/ui/icons";

import { useApiKeys } from "../hooks/useApiKeys";
import { formatRelativeTime, formatShortDate } from "../utils/dates";

import type { ApiKeyItem } from "../types";

interface ApiKeyCardProps {
  item: ApiKeyItem;
  onRevoke: (item: ApiKeyItem) => void;
  isRevoking: boolean;
}

/**
 * One card per API key: name, masked token preview, created/last-used
 * captions and the revoke action. There is deliberately no copy action —
 * the full token is unrecoverable after creation, and the preview alone
 * is useless as a credential.
 */
function ApiKeyCard({ item, onRevoke, isRevoking }: ApiKeyCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t, i18n } = useTranslation("apiKeys");

  const lastUsedLabel = item.lastUsedAt
    ? t("list.lastUsed", {
        relative: formatRelativeTime(item.lastUsedAt, i18n.language),
      })
    : t("list.neverUsed");

  return (
    <EnhancedPaper
      variant="outlined"
      animated={false}
      sx={{
        ...getCardSurfaceSx(theme),
        mb: 0,
        transition: `background-color ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut}, border-color ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut}`,
        // Leve banho de primary no hover em vez de só escurecer/clarear a
        // borda — sinaliza "esta linha tem ações" (revogar), mesmo padrão
        // adotado pelas linhas de endereço em /subdomains.
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="subtitle2"
              component="h3"
              sx={{ fontWeight: 600, wordBreak: "break-word" }}
            >
              {item.name}
            </Typography>
            <Typography
              component="code"
              sx={{
                fontFamily: typographyScale.code.fontFamily,
                fontSize: "0.75rem",
                color: "text.secondary",
                bgcolor: "action.hover",
                borderRadius: "4px",
                px: 0.75,
                py: 0.25,
                flexShrink: 0,
              }}
            >
              {item.tokenPreview}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.25 }}
          >
            {t("list.createdAt", {
              date: formatShortDate(item.createdAt, i18n.language),
            })}
            {" · "}
            {lastUsedLabel}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="inherit"
          size="small"
          onClick={() => onRevoke(item)}
          disabled={isRevoking}
          sx={{
            minHeight: { xs: 44, sm: 36 },
            borderColor: "divider",
            color: "text.secondary",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {isRevoking ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null}
          {t("list.revoke")}
        </Button>
      </Box>
    </EnhancedPaper>
  );
}

/**
 * Lists the authenticated user's API keys as a stack of cards, each with a
 * revoke flow gated behind a confirmation dialog (revoking breaks every
 * integration using that key, irreversibly). Shows a didactic empty state
 * pointing at the create form below when there are no keys yet.
 */
export function ApiKeyList() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation("apiKeys");
  const { apiKeys, isLoading, revoke, isRevoking, revokingId } = useApiKeys();

  const [pendingRevoke, setPendingRevoke] = useState<ApiKeyItem | null>(null);

  /**
   * Confirms the pending revocation. Keeps the dialog open on failure so the
   * user can retry; closes it once the mutation succeeds.
   */
  const handleConfirmRevoke = async () => {
    if (!pendingRevoke) return;
    try {
      await revoke(pendingRevoke.id);
      setPendingRevoke(null);
    } catch {
      // Dialog stays open; the mutation's error state could surface inline
      // here if revoke ever needs messaging beyond the retry affordance.
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

  if (apiKeys.length === 0) {
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
            backgroundColor: isDark
              ? darkNeutral.elevated
              : lightNeutral.surface,
            border: `1px solid ${theme.palette.divider}`,
            color: "text.secondary",
          }}
        >
          <AppIcon intent="apiKeys" size={22} aria-hidden />
        </Box>
        <Typography variant="subtitle2" component="h3" sx={{ mb: 0.5 }}>
          {t("list.empty.title")}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 440, mx: "auto" }}
        >
          {t("list.empty.body")}
        </Typography>
      </EnhancedPaper>
    );
  }

  return (
    <>
      <Stack spacing={2.5}>
        {apiKeys.map((item) => (
          <ApiKeyCard
            key={item.id}
            item={item}
            onRevoke={setPendingRevoke}
            isRevoking={isRevoking && revokingId === item.id}
          />
        ))}
      </Stack>

      <ResponsiveDialog
        open={!!pendingRevoke}
        onClose={() => setPendingRevoke(null)}
      >
        <DialogTitle>{t("list.revokeDialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontFamily: typographyScale.code.fontFamily,
              fontWeight: 600,
              mb: 1,
            }}
          >
            {pendingRevoke?.name} {pendingRevoke?.tokenPreview}
          </DialogContentText>
          <DialogContentText>{t("list.revokeDialog.body")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingRevoke(null)}>
            {t("list.revokeDialog.cancel")}
          </Button>
          <Button
            color="error"
            onClick={handleConfirmRevoke}
            disabled={isRevoking}
          >
            {isRevoking ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            {t("list.revokeDialog.confirm")}
          </Button>
        </DialogActions>
      </ResponsiveDialog>
    </>
  );
}

export default ApiKeyList;
