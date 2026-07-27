"use client";

import {
  Box,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TextField from "@mui/material/TextField";
import { Controller, useWatch } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";

import { BIO_DESCRIPTION_MAX_LENGTH } from "../constants";
import { sanitizeHandleInput } from "../utils/handleAvailabilityCheck";
import { getPublicBioUrlPrefix } from "../utils/publicBioUrl";
import { BioAddressSelect } from "./BioAddressSelect";

import type { HandleAvailabilityStatus } from "../hooks/useHandleAvailability";
import type { BioPageFormData } from "../utils/bioPageFormSchema";

export interface BioPageFormFieldsProps {
  control: Control<BioPageFormData>;
  errors: FieldErrors<BioPageFormData>;
  /** Whether the `isActive` ("page is live") toggle renders — edit mode only. */
  mode: "create" | "edit";
  handleAvailability: HandleAvailabilityStatus;
}

/** Below-field hint for the handle's live availability check. */
function HandleAvailabilityHint({
  status,
}: {
  status: HandleAvailabilityStatus;
}) {
  const { t } = useTranslation("bio");

  if (status === "idle") return null;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.75 }}>
      {status === "checking" ? (
        <CircularProgress size={14} />
      ) : status === "available" ? (
        <CheckCircleOutlineIcon
          fontSize="small"
          sx={{ color: "text.secondary" }}
        />
      ) : (
        <ErrorOutlineIcon fontSize="small" color="error" />
      )}
      <Typography
        variant="caption"
        color={status === "taken" ? "error" : "text.secondary"}
      >
        {status === "checking"
          ? t("form.handle.checking")
          : status === "available"
            ? t("form.handle.available")
            : t("form.handle.taken")}
      </Typography>
    </Box>
  );
}

/**
 * Editable fields for the bio page editor: handle, title, bio (with a
 * 280-char counter) and public-page theme — plus the "page is live" toggle
 * once a page already exists. Deliberately just the field UI: form
 * ownership (`useForm`, submit, mutation) lives in `BioEditor`, and this
 * component's `control`/`errors` are watched live by `BioPreviewPhone` too.
 */
export function BioPageFormFields({
  control,
  errors,
  mode,
  handleAvailability,
}: BioPageFormFieldsProps) {
  const theme = useTheme();
  const { t } = useTranslation("bio");
  const bioValue = useWatch({ control, name: "bio" }) ?? "";
  const handleValue = useWatch({ control, name: "handle" }) ?? "";
  const urlPrefix = getPublicBioUrlPrefix();

  return (
    <Stack spacing={2.5}>
      <Box>
        <FormLabel
          htmlFor="bio-handle-input"
          sx={{ display: "block", mb: 0.75 }}
        >
          {t("form.handle.label")}
        </FormLabel>
        <Controller
          name="handle"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="bio-handle-input"
              onChange={(e) =>
                field.onChange(sanitizeHandleInput(e.target.value))
              }
              fullWidth
              size="small"
              error={!!errors.handle}
              helperText={errors.handle?.message ?? t("form.handle.hint")}
              placeholder={t("form.handle.placeholder")}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          color: "text.secondary",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {urlPrefix}
                      </Typography>
                    </InputAdornment>
                  ),
                  sx: { fontFamily: "monospace", fontWeight: 500 },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: `${radiusTokens.md}px`,
                  bgcolor: theme.palette.background.default,
                },
              }}
            />
          )}
        />
        {!errors.handle ? (
          <HandleAvailabilityHint status={handleAvailability} />
        ) : null}
      </Box>

      <Controller
        name="subdomainId"
        control={control}
        render={({ field }) => (
          <BioAddressSelect
            value={field.value}
            onChange={field.onChange}
            handle={handleValue}
          />
        )}
      />

      <Box>
        <FormLabel
          htmlFor="bio-title-input"
          sx={{ display: "block", mb: 0.75 }}
        >
          {t("form.title.label")}
        </FormLabel>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="bio-title-input"
              fullWidth
              size="small"
              error={!!errors.title}
              helperText={errors.title?.message}
              placeholder={t("form.title.placeholder")}
            />
          )}
        />
      </Box>

      <Box>
        <FormLabel htmlFor="bio-bio-input" sx={{ display: "block", mb: 0.75 }}>
          {t("form.bio.label")}
        </FormLabel>
        <Controller
          name="bio"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="bio-bio-input"
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              size="small"
              error={!!errors.bio}
              helperText={errors.bio?.message}
              placeholder={t("form.bio.placeholder")}
            />
          )}
        />
        <Typography
          variant="caption"
          color={
            bioValue.length > BIO_DESCRIPTION_MAX_LENGTH
              ? "error"
              : "text.disabled"
          }
          sx={{ display: "block", mt: 0.5, textAlign: "right" }}
        >
          {t("form.bio.counter", {
            count: bioValue.length,
            max: BIO_DESCRIPTION_MAX_LENGTH,
          })}
        </Typography>
      </Box>

      <Box>
        <FormLabel sx={{ display: "block", mb: 0.75 }}>
          {t("form.theme.label")}
        </FormLabel>
        <Controller
          name="theme"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              exclusive
              size="small"
              value={field.value}
              onChange={(_e, value) => {
                if (value) field.onChange(value);
              }}
              aria-label={t("form.theme.label")}
            >
              <ToggleButton value="dark">{t("form.theme.dark")}</ToggleButton>
              <ToggleButton value="light">{t("form.theme.light")}</ToggleButton>
            </ToggleButtonGroup>
          )}
        />
      </Box>

      {mode === "edit" ? (
        <Box>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t("form.isActive.label")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {field.value
                        ? t("form.isActive.onHint")
                        : t("form.isActive.offHint")}
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, gap: 1 }}
              />
            )}
          />
        </Box>
      ) : null}
    </Stack>
  );
}

export default BioPageFormFields;
