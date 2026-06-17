"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Save, Eye, EyeOff, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAppDispatch } from "@/lib/store/hooks";
import { showMessage } from "@/lib/store/messageSlice";
import { authService } from "@/services/auth.service";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

/** Dados do formulário de alteração de senha. */
interface PasswordChangeFormData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

/**
 * Formulário de alteração de senha
 * Utiliza Zod para validação e React Hook Form para gerenciamento
 */
export function PasswordChangeForm() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("profile");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const passwordChangeSchema = useMemo(
    () =>
      z
        .object({
          current_password: z
            .string()
            .min(1, t("password.errors.wrongCurrent")),
          new_password: z.string().min(8, t("password.errors.tooShort")),
          new_password_confirmation: z
            .string()
            .min(1, t("password.errors.mismatch")),
        })
        .refine(
          (data) => data.new_password === data.new_password_confirmation,
          {
            message: t("password.errors.mismatch"),
            path: ["new_password_confirmation"],
          },
        ),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    mode: "onChange",
  });

  const togglePasswordVisibility = useCallback(
    (field: keyof typeof showPasswords) => {
      setShowPasswords((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    },
    [],
  );

  const onSubmit = useCallback(
    async (data: PasswordChangeFormData) => {
      try {
        await authService.changePassword(data);
        reset();
        dispatch(
          showMessage({
            message: t("password.successMessage"),
            variant: "success",
          }),
        );
      } catch (error: unknown) {
        dispatch(
          showMessage({
            message:
              error instanceof Error ? error.message : t("form.saveFailed"),
            variant: "error",
          }),
        );
      }
    },
    [dispatch, reset, t],
  );

  return (
    <EnhancedPaper>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Stack spacing={{ xs: 2, sm: 3 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {t("password.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("password.subtitle")}
            </Typography>
          </Box>

          <Divider />

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Senha Atual */}
            <TextField
              {...register("current_password")}
              id="current-password"
              label={t("password.current")}
              type={showPasswords.current ? "text" : "password"}
              error={!!errors.current_password}
              helperText={errors.current_password?.message}
              fullWidth
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock {...ICON_MD} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("current")}
                      edge="end"
                      size="small"
                      aria-label={
                        showPasswords.current
                          ? t("password.hidePassword")
                          : t("password.showPassword")
                      }
                      aria-pressed={showPasswords.current}
                      sx={{ color: "text.secondary" }}
                    >
                      {showPasswords.current ? (
                        <EyeOff {...ICON_MD} />
                      ) : (
                        <Eye {...ICON_MD} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Nova Senha */}
            <TextField
              {...register("new_password")}
              id="new-password"
              label={t("password.new")}
              type={showPasswords.new ? "text" : "password"}
              error={!!errors.new_password}
              helperText={errors.new_password?.message}
              fullWidth
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock {...ICON_MD} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("new")}
                      edge="end"
                      size="small"
                      aria-label={
                        showPasswords.new
                          ? t("password.hidePassword")
                          : t("password.showPassword")
                      }
                      aria-pressed={showPasswords.new}
                      sx={{ color: "text.secondary" }}
                    >
                      {showPasswords.new ? (
                        <EyeOff {...ICON_MD} />
                      ) : (
                        <Eye {...ICON_MD} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirmação da Nova Senha */}
            <TextField
              {...register("new_password_confirmation")}
              id="new-password-confirmation"
              label={t("password.confirm")}
              type={showPasswords.confirm ? "text" : "password"}
              error={!!errors.new_password_confirmation}
              helperText={errors.new_password_confirmation?.message}
              fullWidth
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock {...ICON_MD} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility("confirm")}
                      edge="end"
                      size="small"
                      aria-label={
                        showPasswords.confirm
                          ? t("password.hidePassword")
                          : t("password.showPassword")
                      }
                      aria-pressed={showPasswords.confirm}
                      sx={{ color: "text.secondary" }}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff {...ICON_MD} />
                      ) : (
                        <Eye {...ICON_MD} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Botão de Submissão */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isValid || isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Save {...ICON_MD} />
                )
              }
              sx={{
                alignSelf: "flex-start",
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              {t("password.saveButton")}
            </Button>
          </Box>

          {/* Dicas de Segurança */}
          <Box
            sx={{
              p: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(33, 150, 243, 0.08)"
                  : "rgba(33, 150, 243, 0.04)",
              borderRadius: 2,
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(33, 150, 243, 0.3)"
                  : "rgba(33, 150, 243, 0.2)",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Info {...ICON_MD} />
              {t("password.securityTip.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("password.securityTip.tip1")}
              <br />
              {t("password.securityTip.tip2")}
              <br />
              {t("password.securityTip.tip3")}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </EnhancedPaper>
  );
}

export default PasswordChangeForm;
