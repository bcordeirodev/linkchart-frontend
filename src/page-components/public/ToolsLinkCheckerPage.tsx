"use client";

import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ICON_MD, ICON_SM, ICON_XL } from "@/lib/theme/iconDefaults";
import {
  getPublicElevatedSx,
  getPublicFocalSx,
  getPublicInsetSx,
  getPublicSectionHeadingSx,
  PUBLIC_SECTION_GAP,
} from "@/lib/theme/publicPageStyles";
import { SignUpCtaCard } from "@/shared/components/cta/SignUpCtaCard";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";
import { PublicLayout } from "@/shared/layout";

import { ToolsFaq } from "./tools/ToolsFaq";
import { ToolsHero } from "./tools/ToolsHero";
import { useLinkCheck } from "./tools/useLinkCheck";

import type { LinkVerdict } from "./tools/useLinkCheck";
import type { ComponentType } from "react";

/** A common-scam explainer card (i18n-driven): short title + description. */
interface ScamItem {
  title: string;
  desc: string;
}

/** Per-verdict presentation: icon and i18n keys for title/body. */
interface VerdictPresentation {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  titleKey: "safeTitle" | "suspiciousTitle" | "dangerousTitle";
  bodyKey: "safeBody" | "suspiciousBody" | "dangerousBody";
}

/** Static per-verdict icon + copy mapping (colors come from the theme at render). */
const VERDICT_PRESENTATION: Record<LinkVerdict, VerdictPresentation> = {
  safe: { icon: ShieldCheck, titleKey: "safeTitle", bodyKey: "safeBody" },
  suspicious: {
    icon: ShieldAlert,
    titleKey: "suspiciousTitle",
    bodyKey: "suspiciousBody",
  },
  dangerous: {
    icon: ShieldX,
    titleKey: "dangerousTitle",
    bodyKey: "dangerousBody",
  },
};

/**
 * `/ferramentas/verificar-link` — free suspicious-link checker.
 *
 * A pt-BR-first SEO tool page targeting "verificar link suspeito". The visitor
 * pastes a URL and explicitly presses the button (no per-keystroke requests —
 * the internal `POST /api/check-url` route is rate limited to 20/min per IP);
 * `useLinkCheck` queries Google Safe Browsing through that route and maps the
 * response to a three-state verdict. The signature element is the verdict
 * panel — a "traffic light" shield that recolors the whole result surface
 * (success/warning/error from the existing palette). A didactic section covers
 * the most common Brazilian link scams, and the contextual CTA points out that
 * every link shortened on Link Charts goes through this same check.
 */
export function ToolsLinkCheckerPage() {
  const theme = useTheme();
  const { t } = useTranslation("tools");
  const isDark = theme.palette.mode === "dark";

  const [inputUrl, setInputUrl] = useState("");
  const { state, check } = useLinkCheck();
  const isChecking = state.status === "checking";
  const isInvalid = state.status === "invalid";

  const scamItems = t("checker.scams.items", {
    returnObjects: true,
  }) as ScamItem[];
  const protectItems = t("checker.scams.protectItems", {
    returnObjects: true,
  }) as string[];

  const verdictColor: Record<LinkVerdict, string> = {
    safe: theme.palette.success.main,
    suspicious: theme.palette.warning.main,
    dangerous: theme.palette.error.main,
  };

  /**
   * Renders the post-submit feedback area: the verdict panel on success, or
   * an inline notice for network/rate-limit failures. Returns `null` while
   * idle, invalid (handled under the field) or checking.
   *
   * @returns the feedback node for the current state, or `null`
   */
  const renderFeedback = () => {
    if (state.status === "network-error" || state.status === "rate-limited") {
      const message =
        state.status === "rate-limited"
          ? t("checker.errors.rateLimited")
          : t("checker.errors.network");
      const color = theme.palette.warning.main;
      return (
        <Box
          role="alert"
          sx={{
            ...getPublicInsetSx(theme),
            mt: 2.5,
            p: { xs: 1.75, md: 2 },
            display: "flex",
            alignItems: "flex-start",
            gap: 1.25,
            borderColor: alpha(color, 0.4),
            bgcolor: alpha(color, isDark ? 0.08 : 0.06),
          }}
        >
          <Box sx={{ color, display: "flex", flexShrink: 0, mt: 0.25 }}>
            <AlertTriangle {...ICON_MD} aria-hidden />
          </Box>
          <Typography
            component="p"
            sx={{
              fontSize: "0.8438rem",
              lineHeight: 1.55,
              color: theme.palette.text.primary,
              m: 0,
            }}
          >
            {message}
          </Typography>
        </Box>
      );
    }

    if (state.status !== "result" || !state.verdict) {
      return null;
    }

    const color = verdictColor[state.verdict];
    const presentation = VERDICT_PRESENTATION[state.verdict];
    const VerdictIcon = presentation.icon;

    return (
      <Box
        role="status"
        sx={{
          ...getPublicInsetSx(theme),
          mt: 2.5,
          p: { xs: 2, md: 2.5 },
          borderColor: alpha(color, isDark ? 0.5 : 0.45),
          bgcolor: alpha(color, isDark ? 0.08 : 0.05),
          boxShadow: `inset 3px 0 0 ${alpha(color, isDark ? 0.7 : 0.6)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box sx={{ color, display: "flex", flexShrink: 0, mt: 0.25 }}>
            <VerdictIcon {...ICON_XL} aria-hidden />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component="h3"
              sx={{
                fontSize: "1rem",
                fontWeight: 800,
                color,
                mb: 0.5,
              }}
            >
              {t(`checker.verdict.${presentation.titleKey}`)}
            </Typography>
            <Typography
              component="p"
              sx={{
                fontSize: "0.875rem",
                lineHeight: 1.6,
                color: alpha(theme.palette.text.primary, isDark ? 0.85 : 0.88),
                m: 0,
              }}
            >
              {t(`checker.verdict.${presentation.bodyKey}`)}
            </Typography>

            {state.threats.length > 0 ? (
              <Box sx={{ mt: 1.5 }}>
                <Typography
                  component="p"
                  sx={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: theme.palette.text.secondary,
                    mb: 0.75,
                  }}
                >
                  {t("checker.verdict.threatsLabel")}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {state.threats.map((threat) => (
                    <Typography
                      key={threat}
                      component="span"
                      sx={{
                        px: 1.25,
                        py: 0.375,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color,
                        border: `1px solid ${alpha(color, 0.45)}`,
                        bgcolor: alpha(color, isDark ? 0.12 : 0.08),
                      }}
                    >
                      {threat}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ) : null}

            {state.checkedUrl ? (
              <Typography
                component="p"
                sx={{
                  fontSize: "0.75rem",
                  lineHeight: 1.5,
                  color: theme.palette.text.secondary,
                  wordBreak: "break-all",
                  m: 0,
                  pt: 1.5,
                }}
              >
                {t("checker.verdict.checkedUrlLabel")}{" "}
                <Box component="span" sx={{ fontFamily: "monospace" }}>
                  {state.checkedUrl}
                </Box>
              </Typography>
            ) : null}
          </Box>
        </Box>
      </Box>
    );
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
        <ToolsHero i18nKey="checker" />

        {/* ---- Signature: checker + verdict traffic light ---- */}
        <Box component="section" aria-labelledby="checker-form-heading">
          <Typography
            id="checker-form-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("checker.form.sectionTitle")}
          </Typography>

          <Box sx={{ ...getPublicFocalSx(theme), p: { xs: 2.5, md: 3.5 } }}>
            <Box
              component="form"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                void check(inputUrl);
              }}
            >
              <FormLabel
                htmlFor="checker-url"
                sx={{
                  display: "block",
                  mb: 0.75,
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {t("checker.form.urlLabel")}
              </FormLabel>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.25,
                }}
              >
                <TextField
                  id="checker-url"
                  fullWidth
                  type="url"
                  inputMode="url"
                  placeholder={t("checker.form.placeholder")}
                  value={inputUrl}
                  onChange={(event) => setInputUrl(event.target.value)}
                  error={isInvalid}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isChecking}
                  startIcon={
                    isChecking ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <Search {...ICON_MD} />
                    )
                  }
                  sx={{
                    fontWeight: 600,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    px: 3,
                  }}
                >
                  {isChecking
                    ? t("checker.form.checking")
                    : t("checker.form.button")}
                </Button>
              </Box>
              {isInvalid ? (
                <Typography
                  component="p"
                  role="alert"
                  sx={{
                    fontSize: "0.75rem",
                    lineHeight: 1.5,
                    color: theme.palette.error.main,
                    m: 0,
                    pt: 0.75,
                  }}
                >
                  {t("checker.form.invalidUrl")}
                </Typography>
              ) : null}
            </Box>

            {renderFeedback()}

            {/* Disclaimer — verification is a filter, not a guarantee */}
            <Box
              sx={{
                mt: 2.5,
                pt: 2,
                borderTop: `1px solid ${alpha(theme.palette.divider, isDark ? 0.28 : 0.3)}`,
              }}
            >
              <Typography
                component="p"
                sx={{
                  fontSize: "0.75rem",
                  lineHeight: 1.6,
                  color: theme.palette.text.secondary,
                  m: 0,
                }}
              >
                <Box component="strong" sx={{ fontWeight: 700 }}>
                  {t("checker.disclaimer.title")}:
                </Box>{" "}
                {t("checker.disclaimer.body")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ---- Didactic: common Brazilian link scams ---- */}
        <Box component="section" aria-labelledby="checker-scams-heading">
          <Typography
            id="checker-scams-heading"
            component="h2"
            sx={getPublicSectionHeadingSx(theme)}
          >
            {t("checker.scams.sectionTitle")}
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
            {t("checker.scams.intro")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: { xs: 1.25, md: 1.75 },
            }}
          >
            {Array.isArray(scamItems) &&
              scamItems.map((item) => (
                <Box
                  key={item.title}
                  sx={{ ...getPublicElevatedSx(theme), p: { xs: 2, md: 2.25 } }}
                >
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

          {/* How to protect yourself */}
          <Box
            sx={{
              ...getPublicElevatedSx(theme),
              mt: { xs: 1.25, md: 1.75 },
              p: { xs: 2, md: 2.5 },
            }}
          >
            <Typography
              component="h3"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1.25,
              }}
            >
              {t("checker.scams.protectTitle")}
            </Typography>
            <Box
              component="ul"
              sx={{
                m: 0,
                p: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 0.875,
              }}
            >
              {Array.isArray(protectItems) &&
                protectItems.map((item) => (
                  <Box
                    key={item}
                    component="li"
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        color: theme.palette.success.main,
                        display: "flex",
                        flexShrink: 0,
                        mt: 0.25,
                      }}
                    >
                      <ShieldCheck {...ICON_SM} aria-hidden />
                    </Box>
                    <Typography
                      component="p"
                      sx={{
                        fontSize: "0.8125rem",
                        lineHeight: 1.6,
                        color: alpha(
                          theme.palette.text.primary,
                          isDark ? 0.78 : 0.8,
                        ),
                        m: 0,
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Box>
        </Box>

        {/* ---- FAQ ---- */}
        <ToolsFaq i18nKey="checker" />

        {/* ---- CTA ---- */}
        <SignUpCtaCard
          title={t("checker.cta.title")}
          description={t("checker.cta.description")}
          features={
            t("checker.cta.features", { returnObjects: true }) as string[]
          }
          ctaLabel={t("checker.cta.button")}
          headerIcon={<ShieldCheck {...ICON_SM} />}
          sx={getPublicFocalSx(theme)}
        />
      </Box>
    </PublicLayout>
  );
}

export default ToolsLinkCheckerPage;
