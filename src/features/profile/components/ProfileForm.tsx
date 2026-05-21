"use client";

import { X, User, Save } from "lucide-react";
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

import { useAppDispatch } from "@/lib/store/hooks";
import { showMessage } from "@/lib/store/messageSlice";
import { profileService } from "@/services";

import {
  LoadingOverlay,
  StyledAvatar,
  StyledTextField,
} from "./Profile.styled";
import { ProfileSection, ProfileSectionHeader } from "./ProfileSection";

import type { UserProfile } from "@/services";

interface ProfileFormData {
  name: string;
}

interface ProfileFormProps {
  user: UserProfile;
  onUserUpdate: (user: UserProfile) => void;
  photoURL?: string;
}

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
    <ProfileSection>
      <Box sx={{ position: "relative" }}>
        {saving ? (
          <LoadingOverlay>
            <CircularProgress size={40} />
          </LoadingOverlay>
        ) : null}

        <ProfileSectionHeader
          icon={<User {...ICON_MD} />}
          title={t("sections.personalInfo")}
          description={user.email}
        />

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
              border: 2,
              borderColor: "divider",
              "&:hover": { transform: "none" },
            }}
          >
            {!photoURL && formData.name?.[0]?.toUpperCase()}
          </StyledAvatar>

          <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
            <FormLabel sx={{ display: "block", mb: 0.75 }}>
              {t("form.displayName")}
            </FormLabel>
            <StyledTextField
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              fullWidth
              isEditing
            />
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
            startIcon={
              saving ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Save {...ICON_MD} />
              )
            }
            onClick={handleSave}
            disabled={saving || !isFormValid || !hasChanges}
          >
            {t("form.saveButton")}
          </Button>
        </Stack>
      </Box>
    </ProfileSection>
  );
}

export default ProfileForm;
