"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_MD, ICON_SM } from "@/lib/theme/iconDefaults";
import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMessage } from "@/lib/providers/MessageProvider";
import { authService } from "@/services/auth.service";
import { SectionLabel } from "@/shared/ui/base";

import { ProfileMutedBox, ProfileSection } from "./ProfileSection";

/** Dados do formulário de alteração de senha. */
interface PasswordChangeFormData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

/**
 * Formulário de alteração de senha do perfil (contas locais — usuários
 * Auth0 recebem `OAuthSecurityCard` no lugar). Usa Zod para validação e
 * React Hook Form para gerenciamento.
 *
 * "Instrumento técnico" (2026-08-03): título antigo (`h6` + `Divider`) virou
 * `SectionLabel` acima do card; os 3 campos passaram do `label` interno do
 * MUI para `FormLabel` externo (mesmo padrão de `ProfileForm`/`DangerZone`
 * nesta página); o adorno decorativo `Lock` foi removido dos 3 campos — só
 * o botão mostrar/ocultar senha (`Eye`/`EyeOff`) permanece, por ser
 * funcional, não decorativo; a caixa de dicas de segurança trocou o fundo
 * azul hardcoded por `ProfileMutedBox` (o inset neutro padrão da página) e
 * perdeu o ícone `Info` ao lado do título.
 */
export function PasswordChangeForm() {
  const { showMessage } = useMessage();
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
        showMessage({
          message: t("password.successMessage"),
          variant: "success",
        });
      } catch (error: unknown) {
        showMessage({
          message:
            error instanceof Error ? error.message : t("form.saveFailed"),
          variant: "error",
        });
      }
    },
    [showMessage, reset, t],
  );

  /** Toggle de visibilidade compartilhado pelos 3 campos de senha. */
  const visibilityAdornment = (field: keyof typeof showPasswords) => (
    <InputAdornment position="end">
      <IconButton
        onClick={() => togglePasswordVisibility(field)}
        edge="end"
        size="small"
        aria-label={
          showPasswords[field]
            ? t("password.hidePassword")
            : t("password.showPassword")
        }
        aria-pressed={showPasswords[field]}
        sx={{ color: "text.secondary" }}
      >
        {showPasswords[field] ? <EyeOff {...ICON_SM} /> : <Eye {...ICON_SM} />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Stack spacing={1.25}>
      <SectionLabel headingLevel={2}>{t("password.title")}</SectionLabel>
      <ProfileSection>
        <Stack spacing={2.5}>
          <Typography variant="body2" color="text.secondary">
            {t("password.subtitle")}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <Box>
              <FormLabel
                htmlFor="current-password"
                error={!!errors.current_password}
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("password.current")}
              </FormLabel>
              <TextField
                {...register("current_password")}
                id="current-password"
                type={showPasswords.current ? "text" : "password"}
                error={!!errors.current_password}
                helperText={errors.current_password?.message ?? " "}
                fullWidth
                disabled={isSubmitting}
                slotProps={{
                  input: { endAdornment: visibilityAdornment("current") },
                }}
              />
            </Box>

            <Box>
              <FormLabel
                htmlFor="new-password"
                error={!!errors.new_password}
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("password.new")}
              </FormLabel>
              <TextField
                {...register("new_password")}
                id="new-password"
                type={showPasswords.new ? "text" : "password"}
                error={!!errors.new_password}
                helperText={errors.new_password?.message ?? " "}
                fullWidth
                disabled={isSubmitting}
                slotProps={{
                  input: { endAdornment: visibilityAdornment("new") },
                }}
              />
            </Box>

            <Box>
              <FormLabel
                htmlFor="new-password-confirmation"
                error={!!errors.new_password_confirmation}
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("password.confirm")}
              </FormLabel>
              <TextField
                {...register("new_password_confirmation")}
                id="new-password-confirmation"
                type={showPasswords.confirm ? "text" : "password"}
                error={!!errors.new_password_confirmation}
                helperText={errors.new_password_confirmation?.message ?? " "}
                fullWidth
                disabled={isSubmitting}
                slotProps={{
                  input: { endAdornment: visibilityAdornment("confirm") },
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <Save {...ICON_MD} />
                )
              }
              sx={{ alignSelf: "flex-start" }}
            >
              {t("password.saveButton")}
            </Button>
          </Box>

          <ProfileMutedBox>
            <Typography
              variant="caption"
              color="text.primary"
              sx={{ display: "block", mb: 0.75, fontWeight: 600 }}
            >
              {t("password.securityTip.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("password.securityTip.tip1")}
              <br />
              {t("password.securityTip.tip2")}
              <br />
              {t("password.securityTip.tip3")}
            </Typography>
          </ProfileMutedBox>
        </Stack>
      </ProfileSection>
    </Stack>
  );
}

export default PasswordChangeForm;
