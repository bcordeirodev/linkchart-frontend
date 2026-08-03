"use client";

import NextLink from "next/link";
import {
  Box,
  FormControlLabel,
  FormLabel,
  Link as MuiLink,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Controller, useWatch } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { BIO_DESCRIPTION_MAX_LENGTH } from "../constants";
import { BioAddressSelect } from "./BioAddressSelect";

import type { BioPageFormData } from "../utils/bioPageFormSchema";
import type { BioTheme } from "../types";

/**
 * Shared contract of every field-group component in this file: the form is
 * owned by `BioEditor` (`useForm`, submit, mutation); these components only
 * render controlled field UI and are watched live by `BioPreviewPhone`.
 */
interface FieldGroupProps {
  control: Control<BioPageFormData>;
  errors: FieldErrors<BioPageFormData>;
}

/**
 * "Identidade" fields — title and bio, in the order they appear at the top
 * of the published page. The bio counter turns to the error color past the
 * 280-char limit instead of blocking typing, so the person sees how far
 * over they are.
 */
export function BioIdentityFields({ control, errors }: FieldGroupProps) {
  const { t } = useTranslation("bio");
  const bioValue = useWatch({ control, name: "bio" }) ?? "";

  return (
    <Stack spacing={2.5}>
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
    </Stack>
  );
}

export interface BioPublishingFieldsProps extends FieldGroupProps {
  /** Whether the `isActive` ("page is live") toggle renders — edit mode only. */
  mode: "create" | "edit";
}

/**
 * Accent-border callout tying the bio page to the "custom addresses"
 * (subdomains) feature: the page's address IS one of the user's custom
 * addresses, managed at `/subdomains` and shared with their short links.
 * Rendered in both create and edit modes because the relationship is new to
 * everyone, not just first-time visitors. Same visual recipe as the verdict
 * callout in `GuideHero`/`CompareCompetitorPage` (thin tinted border, 3px
 * accent on the left, primary-tinted background).
 */
function BioAddressCallout() {
  const { t } = useTranslation("bio");

  return (
    <Box
      sx={(theme) => ({
        px: 2,
        py: 1.5,
        borderRadius: 2,
        border: `1px solid ${alpha(
          theme.palette.primary.main,
          theme.palette.mode === "dark" ? 0.3 : 0.24,
        )}`,
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        bgcolor: alpha(
          theme.palette.primary.main,
          theme.palette.mode === "dark" ? 0.09 : 0.05,
        ),
      })}
    >
      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
        {t("form.addressCallout.text")}
      </Typography>
      <MuiLink
        component={NextLink}
        href="/subdomains"
        variant="body2"
        sx={{ display: "inline-block", mt: 0.75, fontWeight: 600 }}
      >
        {t("form.addressCallout.manageCta")}
      </MuiLink>
    </Box>
  );
}

/**
 * "Endereço e publicação" fields — the custom-address callout, the required
 * address (subdomain-first: the address IS the page's identity) and, once
 * the page exists, the "page is live" toggle. The read-only public URL bar
 * is rendered by `BioEditor` in the same card, right below this group.
 */
export function BioPublishingFields({
  control,
  errors,
  mode,
}: BioPublishingFieldsProps) {
  const { t } = useTranslation("bio");

  return (
    <Stack spacing={2.5}>
      <BioAddressCallout />

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

      {mode === "edit" ? (
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
      ) : null}
    </Stack>
  );
}

/**
 * One theme option inside {@link BioThemePicker}: a miniature of the public
 * page (background, avatar dot, two link-button bars) so choosing a theme
 * means seeing it, not decoding the words "dark"/"light".
 */
function ThemeThumbnail({ theme }: { theme: BioTheme }) {
  const isDark = theme === "dark";

  return (
    <Box
      aria-hidden
      sx={{
        width: 72,
        height: 52,
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        bgcolor: isDark ? "#10131A" : "#FFFFFF",
        border: "1px solid",
        borderColor: isDark ? "grey.800" : "grey.300",
      }}
    >
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: isDark ? "grey.600" : "grey.400",
        }}
      />
      {[0, 1].map((i) => (
        <Box
          key={i}
          sx={{
            width: 44,
            height: 7,
            borderRadius: 3.5,
            bgcolor: isDark ? "grey.800" : "grey.200",
            border: "1px solid",
            borderColor: isDark ? "grey.700" : "grey.300",
          }}
        />
      ))}
    </Box>
  );
}

/**
 * "Aparência" field — theme choice as two clickable page miniatures.
 * `ToggleButtonGroup` keeps the radio-like keyboard/AT semantics the old
 * text toggle had; the thumbnails only change what sighted users see.
 */
export function BioThemePicker({ control }: Pick<FieldGroupProps, "control">) {
  const { t } = useTranslation("bio");

  return (
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
            value={field.value}
            onChange={(_e, value) => {
              if (value) field.onChange(value);
            }}
            aria-label={t("form.theme.label")}
            sx={{
              gap: 1.25,
              "& .MuiToggleButtonGroup-grouped": {
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
              },
            }}
          >
            {(["dark", "light"] as const).map((themeOption) => (
              <ToggleButton
                key={themeOption}
                value={themeOption}
                sx={{
                  flexDirection: "column",
                  gap: 0.75,
                  p: 1.25,
                  textTransform: "none",
                  "&.Mui-selected": {
                    borderColor: "primary.main",
                    bgcolor: "action.selected",
                  },
                }}
              >
                <ThemeThumbnail theme={themeOption} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {t(`form.theme.${themeOption}`)}
                </Typography>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      />
    </Box>
  );
}
