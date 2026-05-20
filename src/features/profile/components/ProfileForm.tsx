"use client";
import { X, Mail, User, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { Box, Chip, CircularProgress, Divider } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import { useAppDispatch } from "@/lib/store/hooks";
import { showMessage } from "@/lib/store/messageSlice";
import { profileService } from "@/services";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

// Styled Components
import {
  ActionButtonsContainer,
  AvatarContainer,
  AvatarSection,
  CancelButton,
  FormFieldsContainer,
  LoadingOverlay,
  ProfileContainer,
  ProfileGrid,
  ProfileHeader,
  ProfileTitle,
  SaveButton,
  StyledAvatar,
  StyledTextField,
} from "./Profile.styled";

import type { UserProfile } from "@/services";

interface ProfileFormData {
  name: string;
  email: string;
}

interface ProfileFormProps {
  user: UserProfile;
  onUserUpdate: (user: UserProfile) => void;
}

/**
 * Formulário de edição do perfil
 * Permite editar nome e email do usuário
 */
export function ProfileForm({ user, onUserUpdate }: ProfileFormProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("profile");
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user.name || "",
    email: user.email || "",
  });
  const [saving, setSaving] = useState(false);

  // Handlers otimizados
  const handleInputChange = useCallback(
    (field: keyof ProfileFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const response = await profileService.updateProfile({
        name: formData.name,
        email: formData.email,
      });

      onUserUpdate(response.user);
    } catch (error: unknown) {
      dispatch(
        showMessage({
          message:
            error instanceof Error ? error.message : t("form.saveFailed"),
          variant: "error",
        }),
      );
    } finally {
      setSaving(false);
    }
  }, [formData.name, formData.email, dispatch, onUserUpdate, t]);

  const handleReset = useCallback(() => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
    });
  }, [user]);

  // Validações memoizadas
  const isFormValid = useMemo(
    () => formData.name.trim().length > 0 && formData.email.trim().length > 0,
    [formData.name, formData.email],
  );

  const hasChanges = useMemo(
    () => formData.name !== user.name || formData.email !== user.email,
    [user, formData.name, formData.email],
  );

  return (
    <EnhancedPaper>
      <ProfileContainer>
        {saving ? (
          <LoadingOverlay>
            <CircularProgress size={40} />
          </LoadingOverlay>
        ) : null}

        <ProfileHeader>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ProfileTitle>{t("sections.personalInfo")}</ProfileTitle>
            <Chip
              label={
                user.email_verified_at
                  ? t("form.verifiedBadge")
                  : t("form.pendingBadge")
              }
              color={user.email_verified_at ? "success" : "warning"}
              size="small"
              variant="outlined"
            />
          </Box>
        </ProfileHeader>
        <Divider sx={{ mb: 3 }} />

        <ProfileGrid>
          <AvatarSection>
            <AvatarContainer>
              <StyledAvatar>{formData.name?.[0]?.toUpperCase()}</StyledAvatar>
            </AvatarContainer>
          </AvatarSection>

          <FormFieldsContainer>
            <StyledTextField
              label={t("form.displayName")}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              fullWidth
              isEditing
              InputProps={{
                startAdornment: (
                  <User {...ICON_MD} style={{ marginRight: 12 }} />
                ),
              }}
            />
            <StyledTextField
              label={t("form.email")}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              fullWidth
              type="email"
              isEditing
              InputProps={{
                startAdornment: (
                  <Mail {...ICON_MD} style={{ marginRight: 12 }} />
                ),
              }}
            />
          </FormFieldsContainer>
        </ProfileGrid>

        <ActionButtonsContainer>
          <CancelButton
            variant="outlined"
            startIcon={<X {...ICON_MD} />}
            onClick={handleReset}
            disabled={saving}
          >
            {t("form.resetButton")}
          </CancelButton>
          <SaveButton
            variant="contained"
            startIcon={
              saving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Save {...ICON_MD} />
              )
            }
            onClick={handleSave}
            disabled={saving || !isFormValid || !hasChanges}
            hasChanges={hasChanges}
            isLoading={saving}
          >
            {t("form.saveButton")}
          </SaveButton>
        </ActionButtonsContainer>
      </ProfileContainer>
    </EnhancedPaper>
  );
}

export default ProfileForm;
