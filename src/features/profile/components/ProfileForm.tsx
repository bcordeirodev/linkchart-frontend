"use client";

import { X, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  Stack,
  Typography,
} from "@mui/material";

import { useUpdateProfile } from "@/features/profile/hooks/useProfile";
import { useMessage } from "@/lib/providers/MessageProvider";
import { SectionLabel } from "@/shared/ui/base";

import {
  LoadingOverlay,
  StyledAvatar,
  StyledTextField,
} from "./Profile.styled";
import { ProfileSection } from "./ProfileSection";

import type { UserProfile } from "@/services";
import type { FormEvent } from "react";

interface ProfileFormData {
  name: string;
}

interface ProfileFormProps {
  user: UserProfile;
  photoURL?: string;
}

/**
 * Formulário de dados pessoais do perfil (nome + avatar).
 *
 * @remarks
 * Salva via `useUpdateProfile()` — nunca `profileService` direto — para que o
 * cache `["profile", "me"]` seja atualizado/invalidado e todos os consumidores
 * de `useProfile()` (página, sidebar) re-renderizem com o dado fresco. Por isso
 * não existe mais callback `onUserUpdate`: a prop `user` chega atualizada via
 * cache após o save.
 *
 * "Instrumento técnico" (2026-08-03): o cabeçalho antigo (ícone + título +
 * e-mail como descrição) virou `SectionLabel` acima do card — sem ícone — e
 * o e-mail (somente leitura, o back-end não permite alterá-lo aqui) passou a
 * aparecer como legenda logo abaixo do campo de nome.
 */
export function ProfileForm({ user, photoURL }: ProfileFormProps) {
  const { showMessage } = useMessage();
  const { t } = useTranslation("profile");
  const updateProfile = useUpdateProfile();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user.name || "",
  });
  const saving = updateProfile.isPending;
  const { mutateAsync: updateProfileAsync } = updateProfile;

  /** Atualiza um campo controlado do formulário. */
  const handleInputChange = useCallback(
    (field: keyof ProfileFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  /** Persiste o nome via mutação (o cache do perfil é atualizado no onSuccess). */
  const handleSave = useCallback(async () => {
    try {
      await updateProfileAsync({
        name: formData.name,
        email: user.email,
      });
      showMessage({
        message: t("form.saveSuccess"),
        variant: "success",
      });
    } catch (error: unknown) {
      showMessage({
        message: error instanceof Error ? error.message : t("form.saveFailed"),
        variant: "error",
      });
    }
  }, [formData.name, user.email, updateProfileAsync, showMessage, t]);

  const handleReset = useCallback(() => {
    setFormData({ name: user.name || "" });
  }, [user]);

  const isFormValid = useMemo(
    () => formData.name.trim().length > 0,
    [formData.name],
  );

  const hasChanges = useMemo(
    () => formData.name !== user.name,
    [user.name, formData.name],
  );

  /** Submete o formulário via Enter ou clique no botão Save, respeitando o estado disabled. */
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!saving && isFormValid && hasChanges) {
        handleSave();
      }
    },
    [saving, isFormValid, hasChanges, handleSave],
  );

  return (
    <Stack spacing={1.25}>
      <SectionLabel headingLevel={2}>{t("sections.personalInfo")}</SectionLabel>
      <ProfileSection>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ position: "relative" }}
        >
          {saving ? (
            <LoadingOverlay>
              <CircularProgress size={40} />
            </LoadingOverlay>
          ) : null}

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-start" },
              gap: 2.5,
              mb: 3,
            }}
          >
            <StyledAvatar
              src={photoURL}
              imgProps={{ referrerPolicy: "no-referrer" }}
              sx={{
                width: 72,
                height: 72,
                fontSize: "1.5rem",
                flexShrink: 0,
                boxShadow: "none",
                border: "none",
                "&:hover": { transform: "none" },
              }}
            >
              {!photoURL && formData.name?.[0]?.toUpperCase()}
            </StyledAvatar>

            <Box
              sx={{
                flex: 1,
                width: "100%",
                minWidth: 0,
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <FormLabel
                htmlFor="profile-name"
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("form.displayName")}
              </FormLabel>
              <StyledTextField
                id="profile-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                fullWidth
                isEditing
                slotProps={{ htmlInput: { maxLength: 255 } }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            spacing={1.5}
            justifyContent="flex-end"
            sx={{
              pt: 2,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<X {...ICON_MD} />}
              onClick={handleReset}
              disabled={saving || !hasChanges}
              sx={{ borderColor: "divider", color: "text.secondary" }}
            >
              {t("form.resetButton")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={
                saving ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <Save {...ICON_MD} />
                )
              }
              disabled={saving || !isFormValid || !hasChanges}
            >
              {t("form.saveButton")}
            </Button>
          </Stack>
        </Box>
      </ProfileSection>
    </Stack>
  );
}

export default ProfileForm;
