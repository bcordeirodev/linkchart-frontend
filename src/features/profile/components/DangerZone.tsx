"use client";

import { useCallback, useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useMessage } from "@/lib/providers/MessageProvider";
import { profileService } from "@/services";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { SectionLabel } from "@/shared/ui/base";
import { ResponsiveDialog } from "@/shared/ui/feedback";

import { getProfileCardSx } from "../utils/cardSurface";

/** 422 error codes `DELETE /api/account` can return, mapped 1:1 to `dangerZone.errors.*`. */
type DeleteAccountErrorCode = "INVALID_PASSWORD" | "INVALID_CONFIRMATION";

/** Narrows an arbitrary `ApiError.code` string to a known, translatable error code. */
function isDeleteAccountErrorCode(
  code: string,
): code is DeleteAccountErrorCode {
  return code === "INVALID_PASSWORD" || code === "INVALID_CONFIRMATION";
}

interface DangerZoneProps {
  /** True for Google/Auth0 accounts (`password === null` on the backend) — gates which confirmation field renders. */
  usesOAuthLogin: boolean;
  /** Account email; Auth0 accounts must retype it exactly to confirm deletion. */
  userEmail: string;
}

/**
 * Destructive "delete account" section, rendered last on the profile page.
 *
 * Opens a confirmation dialog that asks for the account password (local
 * accounts) or a retyped email (Auth0 accounts, which have no local
 * password). On success it signs the user out via `useAuth().logout()`,
 * which also performs the redirect away from the app. A 422 response is
 * mapped to an inline, translated error inside the dialog instead of a toast,
 * so the user can immediately retry without losing their place.
 *
 * "Instrumento técnico" (2026-08-03): the heading moved from an icon+title
 * `ProfileSectionHeader` to a plain `SectionLabel` above the card — this is
 * the one section where the semantic red accent stays (per the redesign's
 * own carve-out for destructive actions): the card keeps its translucent
 * `getProfileCardSx` fill but overrides the border to `error.main`, same as
 * before. The confirmation dialog (a floating surface, not a page section)
 * is untouched, including its `AlertTriangle` title icon.
 */
export function DangerZone({ usesOAuthLogin, userEmail }: DangerZoneProps) {
  const { t } = useTranslation("profile");
  const theme = useTheme();
  const { logout } = useAuth();
  const { showMessage } = useMessage();

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /** Opens the dialog with a clean input and no stale error from a previous attempt. */
  const handleOpen = useCallback(() => {
    setInputValue("");
    setErrorMessage(null);
    setOpen(true);
  }, []);

  /** Closes the dialog; a no-op while a delete request is in flight. */
  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    setOpen(false);
  }, [isSubmitting]);

  const canConfirm = usesOAuthLogin
    ? inputValue.trim().length > 0 && inputValue.trim() === userEmail
    : inputValue.length > 0;

  /**
   * Submits the deletion request with the appropriate confirmation payload,
   * then signs the user out on success or surfaces a translated inline error
   * on a 422 response.
   */
  const handleConfirm = useCallback(async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await profileService.deleteAccount(
        usesOAuthLogin
          ? { confirmation: inputValue.trim() }
          : { password: inputValue },
      );
      showMessage({ message: t("dangerZone.success"), variant: "success" });
      await logout();
    } catch (error) {
      const code =
        error instanceof ApiError && isDeleteAccountErrorCode(error.code)
          ? error.code
          : null;
      setErrorMessage(
        code ? t(`dangerZone.errors.${code}`) : t("form.saveFailed"),
      );
      setIsSubmitting(false);
    }
  }, [usesOAuthLogin, inputValue, showMessage, t, logout]);

  return (
    <>
      <Stack spacing={1.25}>
        <SectionLabel headingLevel={2}>{t("dangerZone.title")}</SectionLabel>
        <EnhancedPaper
          variant="outlined"
          animated={false}
          sx={{
            ...getProfileCardSx(theme),
            p: { xs: 2.5, sm: 3 },
            borderColor: alpha(
              theme.palette.error.main,
              theme.palette.mode === "dark" ? 0.35 : 0.3,
            ),
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("dangerZone.description")}
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Trash2 {...ICON_MD} />}
            onClick={handleOpen}
          >
            {t("dangerZone.button")}
          </Button>
        </EnhancedPaper>
      </Stack>

      <ResponsiveDialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown={isSubmitting}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <AlertTriangle {...ICON_MD} />
          {t("dangerZone.dialogTitle")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2.5 }}>
            {t("dangerZone.description")}
          </DialogContentText>

          <Box>
            <FormLabel
              htmlFor="danger-zone-confirm-input"
              error={!!errorMessage}
              sx={{ display: "block", mb: 0.75 }}
            >
              {usesOAuthLogin
                ? t("dangerZone.emailLabel")
                : t("dangerZone.passwordLabel")}
            </FormLabel>
            <TextField
              id="danger-zone-confirm-input"
              fullWidth
              type={usesOAuthLogin ? "text" : "password"}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              error={!!errorMessage}
              helperText={errorMessage ?? " "}
              disabled={isSubmitting}
              autoComplete={usesOAuthLogin ? "off" : "current-password"}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t("dangerZone.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirm}
            disabled={!canConfirm || isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {t("dangerZone.confirm")}
          </Button>
        </DialogActions>
      </ResponsiveDialog>
    </>
  );
}

export default DangerZone;
