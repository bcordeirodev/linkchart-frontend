"use client";

/**
 * @file The short link, assembling itself.
 *
 * The quick-create box used to show two form fields stacked — paste a URL here,
 * optionally name it there — and the name only ever existed as placeholder
 * text. This strip replaces the second field with the thing being made: the
 * domain, a slash, and the name as a real, editable value. Reading it tells you
 * exactly what you are about to get; typing in it changes that link.
 *
 * The strip is deliberately not styled as an input. It carries a quiet inset
 * surface and only lights up its border on focus, so at rest it reads as a URL
 * and not as one more thing to fill in.
 */

import {
  alpha,
  Box,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Check, CornerDownRight, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { SlugFieldState } from "@/features/links/hooks/useSlugSuggestionField";
import { SubdomainSelect } from "@/features/subdomains/components/SubdomainSelect";
import { typographyScale } from "@/lib/theme";

import { linksRadius, getLinksControlFillBg } from "./linksPanelStyles";

import type { ChangeEvent, FocusEvent, Ref } from "react";

/**
 * Deliberately a step shorter than the URL input/Encurtar button row above
 * it (`CONTROL_HEIGHT = 48` in `LinksQuickCreate`) — the strip is the
 * *result*, not another field to fill in, so the hierarchy should read
 * input-first: a taller, more assertive row 1, a slightly lighter row 2
 * underneath. `xs` stays `"auto"`: on phones the strip wraps host and name
 * onto their own lines, which a fixed height would clip.
 */
const STRIP_HEIGHT = { xs: "auto", sm: 40 } as const;

interface QuickCreateLinkStripProps {
  /** Slug field value. */
  value: string;
  /** Native input handlers from `register("custom_slug")`, already composed. */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  name: string;
  inputRef: Ref<HTMLInputElement>;
  /** Current state of the name — drives the indicator on the right. */
  state: SlugFieldState;
  /** Requests a different auto-generated name. */
  onRequestAnother: () => void;
  canRequestAnother: boolean;
  /** True once the account has subdomains and the feature is on. */
  hasSubdomains: boolean;
  subdomainId: number | null;
  onSubdomainChange: (id: number | null) => void;
  /** Full default host when the account has no subdomains. */
  defaultHost: string;
  disabled?: boolean;
  /** Red border when the name is taken or malformed. */
  error?: boolean;
  /**
   * Accessible group name for the whole strip. The caller used to put a
   * visible "LINK CURTO" caps label above the strip; that label is gone
   * (the `↳ domain / slug` composite is self-evident visually), but screen
   * readers still need a name for the group — pass the same string here.
   */
  ariaLabel?: string;
}

/**
 * Editable preview of the short link being created: `domain / name`.
 */
export function QuickCreateLinkStrip({
  value,
  onChange,
  onBlur,
  name,
  inputRef,
  state,
  onRequestAnother,
  canRequestAnother,
  hasSubdomains,
  subdomainId,
  onSubdomainChange,
  defaultHost,
  disabled = false,
  error = false,
  ariaLabel,
}: QuickCreateLinkStripProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation("links");

  const primary = theme.palette.primary.main;
  // Subtler than `getLinksBorderColor` (the URL input's own border, one row
  // up) on purpose — the global hairline token, one step lower-contrast, so
  // the strip recedes slightly behind the input at rest. Error/focus states
  // stay at full strength (semantic colors, not part of the "quiet at rest"
  // rule).
  const borderColor = error ? theme.palette.error.main : theme.palette.divider;

  const busy = state === "resolving" || state === "checking";

  const domainSx = {
    fontFamily: typographyScale.code.fontFamily,
    fontSize: "0.8125rem",
    color: "text.secondary",
    whiteSpace: "nowrap",
  } as const;

  // O "/" separador ecoa o prefixo do SectionLabel (mesma cor primary.main)
  // — a mesma marca visual amarrando o composto "link curto" ao resto da
  // linguagem "instrumento técnico" da página.
  const slashSx = { ...domainSx, color: "primary.main" } as const;

  return (
    <Box
      role="group"
      aria-label={ariaLabel}
      sx={{
        display: "flex",
        // Phones stack: host on its own line, name full width underneath. Side
        // by side, a production host (`redirect.linkcharts.com.br/`) eats 211
        // of 390 CSS pixels and leaves the name field about 19px wide — which
        // local dev never shows, because `localhost:8000/` is half the length.
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        rowGap: 0.25,
        columnGap: 0.75,
        px: { xs: 1.25, sm: 1.25 },
        py: { xs: 0.875, sm: 0 },
        height: STRIP_HEIGHT,
        minWidth: 0,
        borderRadius: `${linksRadius.control}px`,
        border: `1px solid ${borderColor}`,
        bgcolor: getLinksControlFillBg(theme),
        transition: theme.transitions.create(["border-color", "box-shadow"], {
          duration: 150,
        }),
        // The strip is the focus target, not the bare input inside it — same
        // contract `src/styles/index.css` sets for MUI fields, where the root
        // draws the ring and the inner input draws nothing.
        "&:focus-within": {
          borderColor: error ? theme.palette.error.main : primary,
          boxShadow: `0 0 0 3px ${alpha(error ? theme.palette.error.main : primary, 0.35)}`,
        },
        // The inner input's own focus ring is suppressed from
        // `src/styles/index.css` via `[data-inline-field-input]` — it cannot be
        // done here, because Emotion emits into `@layer mui` and the unlayered
        // global `:focus-visible` rule outranks every layered rule.
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {/* Domain — never truncated: a half-shown host is worse than a narrow
          name field, because the host is what makes the link trustworthy. */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.25,
          flexShrink: 0,
          minWidth: 0,
        }}
      >
        <CornerDownRight
          size={14}
          strokeWidth={2}
          aria-hidden
          style={{ flexShrink: 0, opacity: 0.4, marginRight: 6 }}
        />
        {hasSubdomains ? (
          <>
            <SubdomainSelect
              value={subdomainId}
              onChange={onSubdomainChange}
              size="small"
              variant="embedded"
              fullWidth={false}
              aria-label={t("list.quickCreate.subdomainLabel")}
            />
            {/* The select carries the whole host, so only the separator is
                left to draw. Appending a domain suffix here would double it
                (`linkcharts.com.br.linkcharts.com.br`) on the default option. */}
            <Typography component="span" sx={slashSx}>
              /
            </Typography>
          </>
        ) : (
          <Typography component="span" noWrap sx={domainSx}>
            {defaultHost}
            <Box component="span" sx={slashSx}>
              /
            </Box>
          </Typography>
        )}
      </Box>

      {/* Name + indicators travel together, so stacking on phones moves them as
          one line instead of leaving the spinner orphaned beside the host. */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* The name. Bigger and heavier than the domain — it is the part the
            user owns and the part they scan for. */}
        <Box
          component="input"
          data-inline-field-input
          name={name}
          ref={inputRef}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          placeholder={
            state === "autoCode"
              ? t("list.quickCreate.previewAutoName")
              : t("list.quickCreate.slugPlaceholder")
          }
          aria-label={t("list.quickCreate.slugLabel")}
          aria-invalid={error || undefined}
          aria-busy={busy || undefined}
          sx={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            padding: 0,
            height: { xs: 28, sm: "100%" },
            fontFamily: typographyScale.code.fontFamily,
            fontSize: "0.9375rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            color: theme.palette.text.primary,
            "&::placeholder": {
              color: theme.palette.text.disabled,
              fontWeight: 500,
              opacity: 1,
            },
            "&:disabled": {
              color: theme.palette.text.disabled,
              WebkitTextFillColor: theme.palette.text.disabled,
            },
          }}
        />

        {/* One slot on the right, three possible tenants — spinner while a name
          is being resolved or verified, a check once a typed name is free, and
          the "another name" control the rest of the time. They never stack, so
          the strip's width never jumps. */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          {busy ? (
            <CircularProgress
              size={14}
              thickness={5}
              aria-label={
                state === "checking"
                  ? t("form.slugAvailability.checking")
                  : t("list.quickCreate.slugSuggestionChecking")
              }
              sx={{ color: alpha(primary, 0.6), mr: 0.25 }}
            />
          ) : state === "available" ? (
            <Check
              size={15}
              strokeWidth={2.5}
              aria-label={t("form.slugAvailability.available")}
              color={theme.palette.success.main}
              style={{ marginRight: 2 }}
            />
          ) : null}

          {canRequestAnother && !busy ? (
            <Tooltip title={t("list.quickCreate.slugAnotherTooltip")} arrow>
              <Box
                component="button"
                type="button"
                onClick={onRequestAnother}
                disabled={disabled}
                aria-label={t("list.quickCreate.slugAnother")}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.375,
                  border: "none",
                  cursor: "pointer",
                  font: "inherit",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  lineHeight: 1,
                  // ≥36px tap target on phones, compact on desktop.
                  minHeight: { xs: 36, sm: 24 },
                  px: { xs: 1, sm: 0.75 },
                  borderRadius: `${linksRadius.control}px`,
                  color: primary,
                  bgcolor: alpha(primary, isDark ? 0.12 : 0.08),
                  transition: "background-color 120ms ease",
                  "&:hover": {
                    bgcolor: alpha(primary, isDark ? 0.2 : 0.14),
                  },
                  "&:disabled": { cursor: "default", opacity: 0.5 },
                }}
              >
                <RefreshCw size={12} strokeWidth={2.25} aria-hidden />
                {/* Label shown on phones too: with the host on its own line there
                  is room for it, and a bare icon has no tooltip to fall back on
                  when there is no hover. */}
                <Box component="span">{t("list.quickCreate.slugAnother")}</Box>
              </Box>
            </Tooltip>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

export default QuickCreateLinkStrip;
