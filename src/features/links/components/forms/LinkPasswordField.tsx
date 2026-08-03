"use client";
/**
 * @file LinkPasswordField — optional access-password control for link forms.
 *
 * Create (and edit of an unprotected link): a single password input with a
 * visibility toggle; leaving it empty simply creates/keeps the link without a
 * password. Edit of a protected link: the field never pre-populates (the
 * backend is write-only about passwords) — instead it renders a "protected"
 * state with two explicit actions, change (reveals a fresh input) or remove
 * (marks the removal, applied on save as `password: null`). The chosen action
 * lives in the form value `password_mode` so the submit handler can translate
 * it into the backend's set/remove/absent semantics.
 */

import { useState } from "react";
import {
  alpha,
  Box,
  Button,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";

import type { Control, FieldErrors } from "react-hook-form";
import type { LinkFormData } from "./LinkFormSchema";

interface LinkPasswordFieldProps {
  /** react-hook-form control of the link form. */
  control: Control<LinkFormData>;
  /** Field errors of the link form (only `password` is read here). */
  errors: FieldErrors<LinkFormData>;
  /** True when the form is editing an existing link. */
  isEdit?: boolean;
  /**
   * Edit only: whether the link is currently password-protected
   * (`has_password` from the API). Drives the protected state UI.
   */
  hasPassword?: boolean;
}

/** Quiet action button used inside the protected-state row. */
const protectedActionSx = {
  minWidth: 0,
  px: 0.75,
  py: 0.25,
  fontSize: "0.75rem",
  fontWeight: 500,
  textTransform: "none",
  color: "text.secondary",
} as const;

/**
 * Renders the access-password control of the link form: a fresh password
 * input, or — for an already protected link — the keep/change/remove state
 * machine described in the file header.
 */
export function LinkPasswordField({
  control,
  errors,
  isEdit = false,
  hasPassword = false,
}: LinkPasswordFieldProps) {
  const { t } = useTranslation("links");
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const { field: passwordField } = useController({ name: "password", control });
  const { field: modeField } = useController({
    name: "password_mode",
    control,
  });

  // The protected state machine only exists when editing a link that already
  // has a password; everywhere else the input is always visible and the mode
  // is ignored by the submit handlers.
  const isProtected = isEdit && hasPassword;
  const mode = isProtected ? modeField.value ?? "keep" : "set";

  /** Switches the protected link to "type a new password" mode. */
  const startChange = () => modeField.onChange("set");

  /** Marks the password for removal on save (submit sends `password: null`). */
  const startRemove = () => {
    passwordField.onChange("");
    modeField.onChange("remove");
  };

  /** Backs out of change/remove — the current password stays untouched. */
  const keepCurrent = () => {
    passwordField.onChange("");
    modeField.onChange("keep");
  };

  if (isProtected && mode === "keep") {
    return (
      <Box>
        <FormLabel sx={{ display: "block", mb: 0.75 }}>
          {t("form.password")}
        </FormLabel>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0.75,
            px: 1.25,
            py: 1,
            borderRadius: `${radiusTokens.sm}px`,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: "action.hover",
          }}
        >
          <Lock
            size={14}
            strokeWidth={2}
            aria-hidden
            style={{ flexShrink: 0, opacity: 0.6 }}
          />
          <Typography variant="body2" sx={{ flex: 1, minWidth: 120 }}>
            {t("form.passwordProtected.title")}
          </Typography>
          <Button
            size="small"
            onClick={startChange}
            sx={{
              ...protectedActionSx,
              "&:hover": { color: "primary.main", background: "none" },
            }}
          >
            {t("form.passwordProtected.change")}
          </Button>
          <Button
            size="small"
            onClick={startRemove}
            sx={{
              ...protectedActionSx,
              "&:hover": { color: "error.main", background: "none" },
            }}
          >
            {t("form.passwordProtected.remove")}
          </Button>
        </Box>
      </Box>
    );
  }

  if (isProtected && mode === "remove") {
    return (
      <Box>
        <FormLabel sx={{ display: "block", mb: 0.75 }}>
          {t("form.password")}
        </FormLabel>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0.75,
            px: 1.25,
            py: 1,
            borderRadius: `${radiusTokens.sm}px`,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.4)}`,
            bgcolor: alpha(theme.palette.warning.main, 0.08),
          }}
        >
          <Lock
            size={14}
            strokeWidth={2}
            aria-hidden
            style={{
              flexShrink: 0,
              color: theme.palette.warning.main,
            }}
          />
          <Typography
            variant="body2"
            sx={{ flex: 1, minWidth: 120, color: "warning.main" }}
          >
            {t("form.passwordProtected.removePending")}
          </Typography>
          <Button
            size="small"
            onClick={keepCurrent}
            sx={{
              ...protectedActionSx,
              "&:hover": { color: "primary.main", background: "none" },
            }}
          >
            {t("form.passwordProtected.undoRemove")}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.75,
        }}
      >
        <FormLabel htmlFor="link-form-password" error={!!errors.password}>
          {t("form.password")}
        </FormLabel>
        {isProtected ? (
          <Button size="small" onClick={keepCurrent} sx={protectedActionSx}>
            {t("form.passwordProtected.keepCurrent")}
          </Button>
        ) : null}
      </Box>
      <TextField
        {...passwordField}
        value={passwordField.value ?? ""}
        id="link-form-password"
        fullWidth
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder={t("form.passwordPlaceholder")}
        error={!!errors.password}
        helperText={
          errors.password?.message ||
          (isProtected
            ? t("form.passwordChangeHelper")
            : t("form.passwordHelper"))
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? t("form.passwordHide") : t("form.passwordShow")
                }
              >
                {showPassword ? (
                  <EyeOff size={16} strokeWidth={2} aria-hidden />
                ) : (
                  <Eye size={16} strokeWidth={2} aria-hidden />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default LinkPasswordField;
