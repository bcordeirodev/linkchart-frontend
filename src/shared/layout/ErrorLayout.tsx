"use client";
import { alpha } from "@mui/material/styles";
import {
  Box,
  useTheme,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import { useNavigate } from "@/shared/hooks";
import { AppIcon } from "@/shared/ui/icons";
import type { IconIntent } from "@/shared/ui/icons";
import { useResponsive } from "@/lib/theme";
import { radiusTokens } from "@/lib/theme/designSystem";
import { darkNeutral } from "@/lib/theme/colors/dark";
import { lightNeutral } from "@/lib/theme/colors/light";
import { Link } from "@/shared/components";

type ErrorType = "404" | "500" | "403" | "network" | "generic";

/**
 * Glyph shown inside the anchor well for each error type.
 *
 * Only the *glyph* varies — never the colour. The well is always tinted
 * `primary.main` because the identity reserves orange for warnings and red
 * for failures **inside** the app; a full-screen error page is the state
 * itself, not an alert raised on top of working UI, so painting it in a
 * semantic colour would double-signal. Module-level (not `useMemo`) since
 * the map has no dependency on the theme.
 */
const ERROR_INTENTS: Record<ErrorType, IconIntent> = {
  "404": "info",
  "500": "error",
  "403": "error",
  network: "warning",
  generic: "warning",
};

interface ErrorLayoutProps {
  /** Headline and body copy for the error, rendered under the anchor well. */
  children: ReactNode;
  /** Picks the default glyph for the anchor well. Ignored when `iconNode` is set. */
  errorType?: ErrorType;
  /** Shows the primary "back" action (history back, falling back to `/`). */
  showBackButton?: boolean;
  /** Shows the secondary "home" action. */
  showHomeLink?: boolean;
  /** Optional recovery links, rendered as outlined chips under the actions. */
  suggestions?: { label: string; href: string }[];
  className?: string;
  /**
   * Overrides the default glyph inside the anchor well. Pass a bare lucide
   * icon (no `color`): the well sets `color: primary.main` and the icon
   * inherits it through `currentColor`.
   */
  iconNode?: ReactNode;
  /** Giant ghost figure behind the content — typically the status code. */
  backgroundText?: string;
}

/**
 * Full-viewport chrome for system error screens (currently the 404).
 *
 * Three layers, in the "instrumento técnico" language:
 *
 * 1. **Ghost figure** — the status code at display size in Space Grotesk
 *    (sourced from `theme.typography.h1`, the single source of truth for the
 *    display face) at a very low `text.primary` alpha. Weight 700, not 900:
 *    `app/layout.tsx` loads Space Grotesk at 400/500/700 only, so anything
 *    heavier is a synthesised faux-bold.
 * 2. **Anchor well** — the recessed circle used by every empty state in the
 *    app (`SubdomainList`, `ApiKeyList`, `OverviewMetricRow` when nested):
 *    1px divider hairline over the elevation step, which *lightens* in dark
 *    (`darkNeutral.elevated`) and *darkens* toward the canvas in light
 *    (`lightNeutral.bg`). Replaces the old gradient-filled floating circle.
 * 3. **Content** — copy, actions, recovery chips.
 *
 * Motion is a single orchestrated page-load using the shared `reveal`/
 * `reveal-N` classes from `styles/animations.css` (imported by the root
 * layout, so they are available on `app/not-found.tsx`). Those classes carry
 * their own `prefers-reduced-motion` opt-out; there is no perpetual
 * animation anywhere in this component, so reduced motion is honoured by
 * construction rather than by media query.
 *
 * Every colour comes from the theme. The `(public)` routes render dark-only
 * today, but nothing here is hardcoded to dark — the component composes
 * correctly in both themes.
 */
function ErrorLayout({
  children,
  errorType = "generic",
  showBackButton = true,
  showHomeLink = true,
  suggestions = [],
  className,
  iconNode,
  backgroundText,
}: ErrorLayoutProps) {
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <Box
      className={className}
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
        position: "relative",
        // O número fantasma é mais largo que o viewport no mobile.
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <Link
            href="/"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "text.primary",
              fontWeight: 600,
              fontSize: "1.25rem",
            }}
          >
            <AppIcon intent="link" size={24} />
            {t("appName")}
          </Link>
        </Container>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3, md: 4 },
          position: "relative",
        }}
      >
        {backgroundText && (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: theme.typography.h1.fontFamily,
              fontSize: { xs: "8rem", sm: "12rem", md: "18rem" },
              fontWeight: 700,
              letterSpacing: "-0.04em",
              fontVariantNumeric: "tabular-nums",
              color: alpha(theme.palette.text.primary, isDark ? 0.05 : 0.06),
              userSelect: "none",
              pointerEvents: "none",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {backgroundText}
          </Box>
        )}

        <Container maxWidth="md" sx={{ position: "relative" }}>
          <Box sx={{ textAlign: "center" }}>
            {/* Anchor well */}
            <Box
              className="reveal reveal-1"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 72, sm: 88 },
                height: { xs: 72, sm: 88 },
                borderRadius: `${radiusTokens.full}px`,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: isDark
                  ? darkNeutral.elevated
                  : lightNeutral.bg,
                color: "primary.main",
                mb: 4,
              }}
            >
              {iconNode ?? (
                <AppIcon
                  intent={ERROR_INTENTS[errorType]}
                  size={isMobile ? 28 : 32}
                />
              )}
            </Box>

            {/* Children */}
            <Box className="reveal reveal-2" sx={{ mb: 4 }}>
              {children}
            </Box>

            {/* Action buttons */}
            <Stack
              className="reveal reveal-3"
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: suggestions.length > 0 ? 4 : 0 }}
            >
              {showBackButton && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGoBack}
                  startIcon={<AppIcon intent="back" size={20} />}
                  sx={{
                    minWidth: { xs: "100%", sm: 160 },
                    minHeight: { xs: 44, sm: "auto" },
                  }}
                >
                  {t("actions.back")}
                </Button>
              )}
              {showHomeLink && (
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/"
                  startIcon={<AppIcon intent="link" size={20} />}
                  sx={{
                    minWidth: { xs: "100%", sm: 160 },
                    minHeight: { xs: 44, sm: "auto" },
                  }}
                >
                  {t("errors.homeButton")}
                </Button>
              )}
            </Stack>

            {/* Navigation suggestions as chips */}
            {suggestions.length > 0 && (
              <Box className="reveal reveal-4">
                <Typography
                  variant="body2"
                  sx={{ mb: 1.5, color: "text.secondary" }}
                >
                  {t("errors.suggestionsLabel")}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="center"
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  {suggestions.map((suggestion) => (
                    <Chip
                      key={suggestion.href}
                      label={suggestion.label}
                      variant="outlined"
                      size="small"
                      clickable
                      onClick={() => {
                        window.location.href = suggestion.href;
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default ErrorLayout;
