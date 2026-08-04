"use client";

/**
 * @file The short link, assembling itself — public (logged-out) edition.
 *
 * The guest shortener used to show two labelled boxes side by side ("LINK QUE
 * VOCÊ QUER ENCURTAR *" and "NOME PERSONALIZADO opcional"), where the custom
 * name existed only as placeholder text in a second, unrelated field. This
 * strip replaces that second box with the thing being made: the domain, a
 * slash, and the name as a real, editable value.
 *
 * Same input-group grammar as the logged-in quick-create's
 * {@link ../list/QuickCreateLinkStrip.QuickCreateLinkStrip} — one bordered
 * control split into a tinted read-only domain addon and an editable mono name,
 * joined by a hairline, with the `/` in `primary.main` opening the editable
 * segment. It is a separate component rather than a shared one because the two
 * surfaces differ in every moving part: the public page has no subdomain
 * picker and no "another name" control, its copy lives in the `public` i18n
 * namespace, and its name state comes from `usePublicSlugSuggestion` /
 * `useSlugAvailability` rather than `useSlugSuggestionField`. Only the visual
 * grammar is shared, and that lives in `list/linksPanelStyles`.
 */

import { alpha, Box, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { typographyScale } from "@/lib/theme";

import {
  getLinksControlFillBg,
  getLinksInsetBg,
  linksRadius,
} from "../list/linksPanelStyles";

import type { ChangeEvent, FocusEvent, KeyboardEvent, Ref } from "react";

/**
 * One step shorter than the 52px destination row above it
 * (`PUBLIC_CONTROL_HEIGHT`): the destination field is the invitation, this
 * group is the result adjusting itself to it. `xs` stays `"auto"` because on
 * phones the domain addon becomes a band of its own above the name, which a
 * fixed height would clip.
 */
const GROUP_HEIGHT = { xs: "auto", sm: 44 } as const;

export interface PublicShortLinkStripProps {
  /** Current custom-name value (controlled, from `watch("customSlug")`). */
  value: string;
  /** Native handlers from `register("customSlug")`, already composed. */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  name: string;
  inputRef: Ref<HTMLInputElement>;
  /** Host shown in the read-only addon, e.g. `linkcharts.com.br`. */
  defaultHost: string;
  /**
   * Ghost text for the name segment. Pass the resolved slug suggestion when
   * one is ready, otherwise the generic placeholder — the caller decides,
   * because only it knows whether the suggestion won the race.
   */
  placeholder: string;
  /** Tints the ghost text primary, marking it as an accept-able suggestion. */
  suggestionActive?: boolean;
  /** Accessible name for the field itself (the visible label sits outside). */
  inputAriaLabel: string;
  /** Accessible name for the group as a whole. */
  ariaLabel?: string;
  /** Shows the spinner while a name is being resolved. */
  busy?: boolean;
  /** Accessible label announced while `busy`. */
  busyLabel?: string;
  /** Red border when the typed name is taken or malformed. */
  error?: boolean;
  disabled?: boolean;
  /** Tab-to-accept handler for the ready suggestion. */
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Editable preview of the short link a guest is about to create, as an input
 * group: `[ domain addon | / name ]`.
 *
 * @param props - See {@link PublicShortLinkStripProps}.
 */
export function PublicShortLinkStrip({
  value,
  onChange,
  onBlur,
  name,
  inputRef,
  defaultHost,
  placeholder,
  suggestionActive = false,
  inputAriaLabel,
  ariaLabel,
  busy = false,
  busyLabel,
  error = false,
  disabled = false,
  onKeyDown,
}: PublicShortLinkStripProps) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const borderColor = error ? theme.palette.error.main : theme.palette.divider;
  // The inner divider stays neutral even in error: the outer border already
  // carries the red, and repeating it inside makes the whole control shout.
  const segmentBorder = `1px solid ${theme.palette.divider}`;

  const domainSx = {
    fontFamily: typographyScale.code.fontFamily,
    fontSize: "0.8125rem",
    color: "text.secondary",
    whiteSpace: "nowrap",
  } as const;

  return (
    <Box
      role="group"
      aria-label={ariaLabel}
      sx={{
        display: "flex",
        // Phones stack: side by side, a production host eats most of a 390px
        // viewport and leaves the name a sliver.
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "stretch",
        height: GROUP_HEIGHT,
        minWidth: 0,
        borderRadius: `${linksRadius.control}px`,
        border: `1px solid ${borderColor}`,
        bgcolor: getLinksControlFillBg(theme),
        // Segments sit flush inside the group's rounded corners.
        overflow: "hidden",
        transition: theme.transitions.create(["border-color", "box-shadow"], {
          duration: 150,
        }),
        // The group is the focus target, not the bare input inside it — same
        // ring formula as the destination field one row up.
        "&:focus-within": {
          borderColor: error ? theme.palette.error.main : primary,
          boxShadow: `0 0 0 3px ${alpha(
            error ? theme.palette.error.main : primary,
            0.35,
          )}`,
        },
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {/* Domain addon — the fixed prefix. Tinted a step above the control fill
          and closed by a hairline: it is the half you do not type. Never
          truncated; a half-shown host is worse than a narrow name field,
          because the host is what makes the link trustworthy. */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          minWidth: 0,
          px: 1.25,
          py: { xs: 0.75, sm: 0 },
          bgcolor: getLinksInsetBg(theme),
          borderRight: { sm: segmentBorder },
          borderBottom: { xs: segmentBorder, sm: "none" },
        }}
      >
        <Typography component="span" noWrap sx={domainSx}>
          {defaultHost}
        </Typography>
      </Box>

      {/* Editable segment: "/" + name + the spinner slot. */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          flex: 1,
          minWidth: 0,
          px: 1.25,
          py: { xs: 0.75, sm: 0 },
        }}
      >
        {/* The "/" echoes `SectionLabel`'s primary prefix — the product's own
            glyph is what splits the group, not neutral punctuation. */}
        <Typography
          component="span"
          sx={{
            ...domainSx,
            color: "primary.main",
            fontSize: "0.9375rem",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          /
        </Typography>

        {/* The name: bigger and heavier than the domain — the part the visitor
            owns and the part they scan for. */}
        <Box
          component="input"
          data-inline-field-input
          name={name}
          ref={inputRef}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          disabled={disabled}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          placeholder={placeholder}
          aria-label={inputAriaLabel}
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
            // 1rem on phones is the iOS zoom-on-focus floor; the desktop step
            // down keeps the name a notch under the destination field.
            fontSize: { xs: "1rem", sm: "0.9375rem" },
            fontWeight: 600,
            letterSpacing: "0.01em",
            color: theme.palette.text.primary,
            "&::placeholder": {
              // A ready suggestion is tinted primary — it is offering itself,
              // not merely hinting at a format.
              color: suggestionActive
                ? alpha(primary, 0.75)
                : theme.palette.text.disabled,
              fontWeight: 500,
              opacity: 1,
            },
            "&:disabled": {
              color: theme.palette.text.disabled,
              WebkitTextFillColor: theme.palette.text.disabled,
            },
          }}
        />

        {busy ? (
          <CircularProgress
            size={14}
            thickness={5}
            aria-label={busyLabel}
            sx={{ color: alpha(primary, 0.6), flexShrink: 0 }}
          />
        ) : null}
      </Box>
    </Box>
  );
}

export default PublicShortLinkStrip;
