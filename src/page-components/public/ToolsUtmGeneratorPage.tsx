"use client";

import {
  Box,
  Button,
  FormLabel,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Check, Copy, Link2 } from "lucide-react";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";

import { typographyScale } from "@/lib/theme/designSystem";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  getPublicElevatedSx,
  getPublicFocalSx,
  getPublicInsetSx,
  getPublicSectionHeadingSx,
  PUBLIC_SECTION_GAP,
} from "@/lib/theme/publicPageStyles";
import { SignUpCtaCard } from "@/shared/components/cta/SignUpCtaCard";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";
import { useClipboard } from "@/shared/hooks";
import { PublicLayout } from "@/shared/layout";

import { ToolsFaq } from "./tools/ToolsFaq";
import { ToolsHero } from "./tools/ToolsHero";
import {
  UTM_FIELD_KEYS,
  UTM_PRESETS,
  useUtmBuilder,
} from "./tools/useUtmBuilder";

import type { UtmSegment } from "./tools/useUtmBuilder";

/** A UTM parameter explainer card (i18n-driven): param name + title + description. */
interface ParamItem {
  name: string;
  title: string;
  desc: string;
}

/**
 * Control height for the destination URL + UTM text fields, matching the
 * app's public-form grammar (44-48px tap targets, not the dashboard's
 * compact 36px default).
 */
const CONTROL_HEIGHT = 44;

/**
 * `sx` applied to every text field on this page: fixes the `OutlinedInput`
 * root at {@link CONTROL_HEIGHT} and re-centers the input text inside it
 * (the theme's default input padding assumes the shorter dashboard height).
 */
const controlHeightSx = {
  "& .MuiOutlinedInput-root": { height: CONTROL_HEIGHT },
  "& input": { height: "100%", boxSizing: "border-box", py: 0 },
} as const;

/**
 * `/ferramentas/gerador-utm` — free UTM link generator.
 *
 * A pt-BR-first SEO tool page targeting "gerador de UTM". Everything runs in
 * the browser (see `useUtmBuilder`): the visitor fills the destination URL and
 * the five UTM fields and the final URL assembles live. The signature element
 * is the "living URL" preview — the assembled link rendered as colorized
 * fragments (added `utm_*` keys in primary) so the anatomy of a tracked link
 * becomes visible while it is built. A didactic section explains each
 * parameter (the on-page SEO surface) and the contextual CTA hands the long
 * URL to the shortener funnel.
 */
export function ToolsUtmGeneratorPage() {
  const theme = useTheme();
  const { t } = useTranslation("tools");
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  const { url, fields, setUrl, setField, applyPreset, builtUrl, segments } =
    useUtmBuilder();
  const { copied, copy } = useClipboard();

  const paramItems = t("utm.params.items", {
    returnObjects: true,
  }) as ParamItem[];

  const labelSx = {
    display: "block",
    mb: 0.75,
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: theme.palette.text.primary,
  } as const;

  const helpSx = {
    mt: 0.5,
    fontSize: "0.75rem",
    lineHeight: 1.5,
    color: theme.palette.text.secondary,
  } as const;

  /**
   * Maps a preview fragment kind to its display color, highlighting the
   * `utm_*` keys the tool added (primary) against the neutral base URL.
   *
   * @param kind - the fragment role from {@link UtmSegment}
   * @returns a CSS color string from the active theme palette
   */
  const segmentColor = (kind: UtmSegment["kind"]): string => {
    switch (kind) {
      case "utmKey":
        return primary;
      case "value":
        return alpha(theme.palette.text.primary, isDark ? 0.85 : 0.88);
      case "sep":
        return theme.palette.text.secondary;
      default:
        return alpha(theme.palette.text.primary, isDark ? 0.7 : 0.75);
    }
  };

  return (
    <PublicLayout variant="simple" chrome="minimal">
      <Box
        component="main"
        sx={{
          maxWidth: SHORTER_CONTENT_MAX_WIDTH,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: { xs: 7, md: 8 },
          pb: { xs: 6, md: 8 },
          display: "flex",
          flexDirection: "column",
          gap: PUBLIC_SECTION_GAP,
        }}
      >
        {/* ---- Hero ---- */}
        <ToolsHero i18nKey="utm" />

        {/* ---- Builder ---- */}
        <Box component="section" aria-labelledby="utm-builder-heading">
          <Typography
            id="utm-builder-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("utm.form.sectionTitle")}
          </Typography>

          <Box sx={{ ...getPublicFocalSx(theme), p: { xs: 2.5, md: 3.5 } }}>
            {/* Destination URL */}
            <Box>
              <FormLabel htmlFor="utm-url" sx={labelSx}>
                {t("utm.form.urlLabel")}
              </FormLabel>
              <TextField
                id="utm-url"
                fullWidth
                type="url"
                inputMode="url"
                placeholder={t("utm.form.urlPlaceholder")}
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                sx={controlHeightSx}
              />
              <Typography component="p" sx={helpSx}>
                {t("utm.form.urlHelp")}
              </Typography>
            </Box>

            {/* Presets */}
            <Box sx={{ mt: 2.5 }}>
              <Typography
                component="p"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  mb: 1,
                }}
              >
                {t("utm.form.presetsLabel")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                {UTM_PRESETS.map((preset) => {
                  const isActive =
                    fields.source === preset.source &&
                    fields.medium === preset.medium;
                  return (
                    <Box
                      key={preset.labelKey}
                      component="button"
                      type="button"
                      onClick={() => applyPreset(preset)}
                      aria-pressed={isActive}
                      sx={{
                        ...getPublicInsetSx(
                          theme,
                          isActive ? { primaryTint: true } : undefined,
                        ),
                        px: 1.25,
                        py: 0.625,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        color: isActive
                          ? primary
                          : alpha(
                              theme.palette.text.primary,
                              isDark ? 0.8 : 0.82,
                            ),
                        ...(isActive && {
                          borderColor: alpha(primary, 0.4),
                        }),
                        "&:hover": {
                          borderColor: alpha(primary, 0.4),
                        },
                      }}
                    >
                      {t(`utm.presets.${preset.labelKey}`)}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* UTM fields */}
            <Box
              sx={{
                mt: 2.5,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                columnGap: 2,
                rowGap: 2,
              }}
            >
              {UTM_FIELD_KEYS.map((key) => {
                const isOptional = key === "term" || key === "content";
                return (
                  <Box key={key}>
                    <FormLabel
                      htmlFor={`utm-field-${key}`}
                      sx={{
                        ...labelSx,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                      }}
                    >
                      {t(`utm.form.fields.${key}.label`)}
                      {isOptional ? (
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "0.625rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {t("utm.form.optionalBadge")}
                        </Typography>
                      ) : null}
                    </FormLabel>
                    <TextField
                      id={`utm-field-${key}`}
                      fullWidth
                      placeholder={t(`utm.form.fields.${key}.placeholder`)}
                      value={fields[key]}
                      onChange={(event) => setField(key, event.target.value)}
                      sx={controlHeightSx}
                    />
                    <Typography component="p" sx={helpSx}>
                      {t(`utm.form.fields.${key}.help`)}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Naming tip */}
            <Box
              sx={{
                ...getPublicInsetSx(theme, { primaryTint: true }),
                mt: 2.5,
                p: { xs: 1.5, md: 1.75 },
              }}
            >
              <Typography
                component="p"
                sx={{
                  fontSize: "0.8125rem",
                  lineHeight: 1.6,
                  color: alpha(theme.palette.text.primary, isDark ? 0.8 : 0.82),
                  m: 0,
                }}
              >
                {t("utm.form.tip")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ---- Signature: living URL preview ---- */}
        <Box component="section" aria-labelledby="utm-result-heading">
          <Typography
            id="utm-result-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("utm.result.sectionTitle")}
          </Typography>

          <Box sx={{ ...getPublicElevatedSx(theme), p: { xs: 2.5, md: 3 } }}>
            <Box
              aria-live="polite"
              sx={{
                ...getPublicInsetSx(theme),
                p: { xs: 1.75, md: 2 },
                fontFamily: typographyScale.code.fontFamily,
                fontSize: { xs: "0.8125rem", md: "0.875rem" },
                lineHeight: 1.7,
                wordBreak: "break-all",
              }}
            >
              {segments ? (
                segments.map((segment, i) => (
                  <Box
                    key={`${segment.kind}-${i}`}
                    component="span"
                    sx={{
                      color: segmentColor(segment.kind),
                      ...(segment.kind === "utmKey" && { fontWeight: 700 }),
                    }}
                  >
                    {segment.text}
                  </Box>
                ))
              ) : (
                <Typography
                  component="span"
                  sx={{
                    fontFamily: theme.typography.fontFamily,
                    fontSize: "0.8125rem",
                    color: theme.palette.text.secondary,
                  }}
                >
                  {url.trim().length === 0
                    ? t("utm.result.empty")
                    : t("utm.result.invalidUrl")}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1.25,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                disabled={!builtUrl}
                onClick={() => {
                  if (builtUrl) {
                    void copy(builtUrl);
                  }
                }}
                startIcon={
                  copied ? <Check {...ICON_MD} /> : <Copy {...ICON_MD} />
                }
                sx={{ fontWeight: 600, minHeight: CONTROL_HEIGHT }}
              >
                {copied ? t("utm.result.copied") : t("utm.result.copy")}
              </Button>
            </Box>

            {/* Contextual funnel: shorten the freshly built URL */}
            <Box
              sx={{
                mt: 2.5,
                pt: 2,
                borderTop: `1px solid ${alpha(theme.palette.divider, isDark ? 0.28 : 0.3)}`,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                gap: { xs: 1.5, sm: 2.5 },
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                  }}
                >
                  {t("utm.result.shortenTitle")}
                </Typography>
                <Typography
                  component="p"
                  sx={{
                    fontSize: "0.8125rem",
                    lineHeight: 1.55,
                    color: theme.palette.text.secondary,
                    m: 0,
                  }}
                >
                  {t("utm.result.shortenBody")}
                </Typography>
              </Box>
              {/* With a valid built URL the CTA closes the funnel: it carries
                  the assembled link to the landing shortener via `?url=`
                  (validated + pre-filled by `useShortenerPrefill`, never
                  auto-submitted). Without one it stays a plain link to `/`. */}
              <Button
                component={NextLink}
                href={builtUrl ? `/?url=${encodeURIComponent(builtUrl)}` : "/"}
                variant="outlined"
                startIcon={<Link2 {...ICON_MD} />}
                sx={{
                  fontWeight: 600,
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  minHeight: CONTROL_HEIGHT,
                }}
              >
                {t("utm.result.shortenButton")}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* ---- Didactic: what each parameter means ---- */}
        <Box component="section" aria-labelledby="utm-params-heading">
          <Typography
            id="utm-params-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("utm.params.sectionTitle")}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: theme.palette.text.secondary,
              mb: 2.5,
              maxWidth: 680,
            }}
          >
            {t("utm.params.intro")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: { xs: 1.25, md: 1.75 },
            }}
          >
            {Array.isArray(paramItems) &&
              paramItems.map((item) => (
                <Box
                  key={item.name}
                  sx={{ ...getPublicElevatedSx(theme), p: { xs: 2, md: 2.25 } }}
                >
                  <Typography
                    component="span"
                    sx={{
                      display: "inline-block",
                      fontFamily: typographyScale.code.fontFamily,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: primary,
                      px: 1,
                      py: 0.375,
                      borderRadius: 1,
                      border: `1px solid ${alpha(primary, 0.28)}`,
                      bgcolor: alpha(primary, isDark ? 0.1 : 0.06),
                      mb: 1,
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 0.5,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    component="p"
                    sx={{
                      fontSize: "0.8125rem",
                      lineHeight: 1.6,
                      color: alpha(
                        theme.palette.text.primary,
                        isDark ? 0.72 : 0.75,
                      ),
                      m: 0,
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>

        {/* ---- FAQ ---- */}
        <ToolsFaq i18nKey="utm" />

        {/* ---- CTA ---- */}
        {/* No `headerIcon`: the icon-chip beside the title is the pattern the
            "instrumento técnico" language banned on `/` and `/shorter`
            (2026-08-04) — the title now opens this card alone here too. */}
        <SignUpCtaCard
          title={t("utm.cta.title")}
          description={t("utm.cta.description")}
          features={t("utm.cta.features", { returnObjects: true }) as string[]}
          ctaLabel={t("utm.cta.button")}
          sx={getPublicFocalSx(theme)}
        />
      </Box>
    </PublicLayout>
  );
}

export default ToolsUtmGeneratorPage;
