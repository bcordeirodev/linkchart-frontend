"use client";

import {
  Box,
  FormControlLabel,
  FormLabel,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { Controller, useWatch } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { BIO_DESCRIPTION_MAX_LENGTH } from "../constants";
import { BioAddressSelect } from "./BioAddressSelect";

import type { BioPageFormData } from "../utils/bioPageFormSchema";

export interface BioPageFormFieldsProps {
  control: Control<BioPageFormData>;
  errors: FieldErrors<BioPageFormData>;
  /** Whether the `isActive` ("page is live") toggle renders — edit mode only. */
  mode: "create" | "edit";
}

/**
 * Editable fields for the bio page editor: required address (subdomain),
 * title, bio (with a 280-char counter) and public-page theme — plus the
 * "page is live" toggle once a page already exists. Deliberately just the
 * field UI: form ownership (`useForm`, submit, mutation) lives in
 * `BioEditor`, and this component's `control`/`errors` are watched live by
 * `BioPreviewPhone` too.
 *
 * No handle field: subdomain-first, the address IS the page's identity, so
 * the handle is never collected here — the backend derives (create) or
 * keeps (update) it, and the resulting value is shown read-only as
 * `BioPublicUrlBar`'s secondary `/@{handle}` caption instead.
 */
export function BioPageFormFields({
  control,
  errors,
  mode,
}: BioPageFormFieldsProps) {
  const { t } = useTranslation("bio");
  const bioValue = useWatch({ control, name: "bio" }) ?? "";

  return (
    <Stack spacing={2.5}>
      {/* Subdomain-first: the address is where the page's identity actually
          lives, so it leads the form — everything else describes the page
          that lives at that address. */}
      <Controller
        name="subdomainId"
        control={control}
        render={({ field }) => (
          <BioAddressSelect
            value={field.value}
            onChange={field.onChange}
            error={errors.subdomainId?.message}
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
