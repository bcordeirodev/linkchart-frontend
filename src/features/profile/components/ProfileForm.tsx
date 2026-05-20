"use client";
import { X, User, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  Box,
  CircularProgress,
  Divider,
  FormLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import { useAppDispatch } from "@/lib/store/hooks";
import { showMessage } from "@/lib/store/messageSlice";
import { profileService } from "@/services";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";

import {
  ActionButtonsContainer,
  CancelButton,
  LoadingOverlay,
  ProfileContainer,
  SaveButton,
  StyledAvatar,
  StyledTextField,
} from "./Profile.styled";

import type { UserProfile } from "@/services";

interface ProfileFormData {
  name: string;
}

interface ProfileFormProps {
  user: UserProfile;
  onUserUpdate: (user: UserProfile) => void;
  /** Profile picture URL from Auth0 (Google / Facebook). Falls back to initials. */
  photoURL?: string;
}

/**
 * Formulário de edição do perfil.
 *
 * Layout: section title + Divider, compact identity row (avatar + current
 * name/email), then full-width fields with external FormLabels.
 */
export function ProfileForm({
  user,
  onUserUpdate,
  photoURL,
}: ProfileFormProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("profile");
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user.name || "",
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = useCallback(
    (field: keyof ProfileFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const response = await profileService.updateProfile({
        name: formData.name,
        email: user.email,
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
  }, [formData.name, user.email, dispatch, onUserUpdate, t]);

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

  return (
    <EnhancedPaper>
      <ProfileContainer>
        {saving ? (
          <LoadingOverlay>
            <CircularProgress size={40} />
          </LoadingOverlay>
        ) : null}

        {/* ── Section header ───────────────────────────────────────── */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          {t("sections.personalInfo")}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* ── Identity row: avatar + current name/email ────────────── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <StyledAvatar
            src={photoURL}
            imgProps={{ referrerPolicy: "no-referrer" }}
            sx={{ width: 80, height: 80, fontSize: "1.75rem", flexShrink: 0 }}
          >
            {!photoURL && formData.name?.[0]?.toUpperCase()}
          </StyledAvatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, lineHeight: 1.3 }}
              noWrap
            >
              {formData.name || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          </Box>
        </Box>

        {/* ── Editable fields ──────────────────────────────────────── */}
        <Stack spacing={2.5}>
          <Box>
            <FormLabel sx={{ display: "block", mb: 0.75 }}>
              {t("form.displayName")}
            </FormLabel>
            <StyledTextField
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
          </Box>
        </Stack>

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
