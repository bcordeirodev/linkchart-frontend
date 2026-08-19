"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { darkNeutral } from "@/lib/theme/colors/dark";
import { lightNeutral } from "@/lib/theme/colors/light";
import { SocialPlatformIcon } from "@/shared/ui/icons";

import { getAvatarInitial } from "../utils/avatarInitial";

import type { BioItem, BioTheme } from "../types";

/**
 * Fixed color pair for one bio-page theme — independent of the authenticated
 * app's own `theme.palette.mode`. The published page always renders with
 * exactly these colors regardless of the visitor's OS/browser preference,
 * so the preview hardcodes them rather than reading from MUI's theme.
 */
interface BioThemePalette {
  background: string;
  /** Halo mono-azul do canvas — espelha o `glow` da página pública (2026-08-05). */
  glow: string;
  surface: string;
  surfaceBorder: string;
  text: string;
  textMuted: string;
  accent: string;
  accentContrast: string;
}

/** Link Chart's brand blue, used as the button accent in both bio themes. */
const BRAND_ACCENT = "#4E82E6";

const THEME_PALETTES: Record<BioTheme, BioThemePalette> = {
  dark: {
    // `darkNeutral.bg` — not a re-hardcoded hex — so this frame's background
    // never drifts from the app's own dark page background again (it did
    // once: this literally was `"#0B0D12"` until the "instrumento técnico"
    // redesign moved the app's dark bg to `#030405` and left this file's
    // copy stale).
    background: darkNeutral.bg,
    glow: "rgba(78, 130, 230, 0.08)",
    surface: "#181B23",
    surfaceBorder: "rgba(255, 255, 255, 0.12)",
    text: "rgba(255, 255, 255, 0.95)",
    textMuted: "rgba(255, 255, 255, 0.62)",
    accent: BRAND_ACCENT,
    accentContrast: "#FFFFFF",
  },
  light: {
    background: lightNeutral.bg,
    glow: "rgba(78, 130, 230, 0.05)",
    surface: "#FFFFFF",
    surfaceBorder: "rgba(0, 0, 0, 0.1)",
    text: "rgba(0, 0, 0, 0.92)",
    textMuted: "rgba(0, 0, 0, 0.56)",
    accent: BRAND_ACCENT,
    accentContrast: "#FFFFFF",
  },
};

export interface BioPreviewPhoneProps {
  /**
   * Host the page lives at (e.g. "acme.linkcharts.com.br"), shown under the
   * title exactly as the visitor will see it. Empty string hides the line —
   * a legacy page that hasn't picked an address yet has no URL to show.
   */
  address: string;
  title: string;
  bio: string;
  theme: BioTheme;
  /** Full item list; only `isActive` items render, in `position` order. */
  items: BioItem[];
  /**
   * Uploaded avatar URL, or `null`/`undefined` to fall back to the title's
   * initial. Not part of the watched form — comes straight from `page` in
   * `BioEditor`, since avatar upload is its own immediate mutation, not a
   * submitted form field.
   */
  avatarUrl?: string | null;
}

/**
 * Live, non-interactive mock of the published bio page — at its own
 * subdomain address, never an "@handle" — inside a phone frame. Reflects the form's current values on every keystroke —
 * deliberately NOT pixel-identical to the real public page (that page is
 * owned by a different part of the app); it exists to give instant visual
 * feedback on theme, copy and item order while editing.
 *
 * Mirrors the real public page's one structural decision that isn't just
 * theming: `display: "icon"` items render as a small centered row of round
 * glyphs above the item list, never inside it — same split, same position
 * (under the bio text), a local re-implementation rather than reusing
 * `BioSocialIconsRow` (that component depends on `page-components/bio`'s
 * richer `BioPalette`, which this file deliberately does not import — see
 * the module docstring above `THEME_PALETTES`).
 */
export function BioPreviewPhone({
  address,
  title,
  bio,
  theme,
  items,
  avatarUrl,
}: BioPreviewPhoneProps) {
  const { t } = useTranslation("bio");
  const palette = THEME_PALETTES[theme];
  const activeItems = [...items]
    .filter((item) => item.isActive)
    .sort((a, b) => a.position - b.position);
  // Same split as the real public page (`BioPublicPage`): icons render in
  // their own row above the button list, never inside it.
  const iconItems = activeItems.filter((item) => item.display === "icon");
  const linkItems = activeItems.filter((item) => item.display !== "icon");

  const displayTitle = title.trim() || t("preview.placeholderTitle");
  const displayBio = bio.trim();

  // `muiTheme` — the ADMIN APP's own light/dark mode (`useTheme()`), NOT the
  // `theme` prop above (the published page's own dark/light content theme,
  // a page-owner choice). Only the frame's outer silhouette reads this —
  // the phone's screen content stays keyed to the `theme` prop, untouched.
  const muiTheme = useTheme();
  const isAppDark = muiTheme.palette.mode === "dark";
  // Gate fix (2026-08-03): the frame's 8px black bezel had no edge of its
  // own against the page background — invisible once the app's dark bg
  // became near-black (`#030405`, same ballpark as the bezel's `common.
  // black`). A `boxShadow` ring (not `border` — the bezel already owns that
  // property) traces the frame's existing `36px` border-radius from just
  // outside it, so the device silhouette reads without touching the bezel
  // color or the screen content.
  // 2026-08-17: os alphas literais (0.16 dark / 0.12 light) viraram
  // `border.strong` do tema ativo — é o mesmo papel ("hairline mais forte
  // que um card") e assim a silhueta acompanha os degraus globais de borda
  // em vez de ficar para trás a cada recalibragem.
  const frameRingColor = isAppDark
    ? darkNeutral.border.strong
    : lightNeutral.border.strong;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 300,
        mx: "auto",
      }}
    >
      {/* Side button nubs — purely decorative (aria-hidden), sit just outside
          the casing like a real device's power/volume keys. A small,
          restrained detail that keeps the "phone" read convincing without
          touching the palette. */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: -2,
          top: "22%",
          width: 3,
          height: 32,
          borderRadius: "2px 0 0 2px",
          bgcolor: "common.black",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: -2,
          top: "32%",
          width: 3,
          height: 52,
          borderRadius: "2px 0 0 2px",
          bgcolor: "common.black",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          right: -2,
          top: "26%",
          width: 3,
          height: 68,
          borderRadius: "0 2px 2px 0",
          bgcolor: "common.black",
        }}
      />

      <Box
        sx={{
          position: "relative",
          borderRadius: "36px",
          border: "8px solid",
          borderColor: "common.black",
          bgcolor: "common.black",
          boxShadow: `0 0 0 1px ${frameRingColor}, 0 20px 45px -20px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)`,
          overflow: "hidden",
        }}
      >
        {/* Dynamic-island style notch — purely decorative, anchors the "phone" read. */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 0.75,
            pb: 0.25,
            bgcolor: palette.background,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 18,
              borderRadius: "999px",
              bgcolor: "common.black",
            }}
          />
        </Box>

        <Box
          sx={{
            position: "relative",
            bgcolor: palette.background,
            // Mesmo halo do topo da página publicada, na escala da telinha.
            backgroundImage: `radial-gradient(280px 200px at 50% -40px, ${palette.glow}, transparent 70%)`,
            backgroundRepeat: "no-repeat",
            minHeight: 420,
            maxHeight: 560,
            overflowY: "auto",
            px: 2.5,
            py: 3.5,
          }}
        >
          {/* Faint diagonal sheen — reads as a glass reflection over the
              screen, glued to the scroll container so it stays put while
              content scrolls beneath it. */}
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 35%)",
            }}
          />
          <Stack spacing={2.5} alignItems="center" sx={{ textAlign: "center" }}>
            <Box
              aria-hidden
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: palette.accentContrast,
                background: avatarUrl
                  ? undefined
                  : `linear-gradient(135deg, ${palette.accent} 0%, ${palette.accent}99 100%)`,
              }}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt=""
                  width={64}
                  height={64}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                getAvatarInitial(displayTitle)
              )}
            </Box>

            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1.0625rem",
                  lineHeight: 1.3,
                  color: palette.text,
                  wordBreak: "break-word",
                }}
              >
                {displayTitle}
              </Typography>
              {address ? (
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    color: palette.textMuted,
                    mt: 0.25,
                    wordBreak: "break-all",
                  }}
                >
                  {address}
                </Typography>
              ) : null}
              {displayBio ? (
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    lineHeight: 1.5,
                    color: palette.textMuted,
                    mt: 1,
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {displayBio}
                </Typography>
              ) : null}
            </Box>

            <Stack spacing={1.25} sx={{ width: "100%", mt: 1 }}>
              {/* Same split as the real public page: icons render in their
                  own centered row, above the item buttons — never mixed
                  into that list, and never mistaken for "no items" below. */}
              {iconItems.length > 0 ? (
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  flexWrap="wrap"
                >
                  {iconItems.map((item) => (
                    <Box
                      key={item.id}
                      aria-hidden
                      sx={{
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        border: `1px solid ${palette.surfaceBorder}`,
                        bgcolor: palette.surface,
                        color: palette.text,
                      }}
                    >
                      <SocialPlatformIcon
                        platform={item.socialPlatform ?? "website"}
                        size={16}
                      />
                    </Box>
                  ))}
                </Stack>
              ) : null}

              {activeItems.length === 0 ? (
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: palette.textMuted,
                    fontStyle: "italic",
                    py: 2,
                  }}
                >
                  {t("preview.noItems")}
                </Typography>
              ) : (
                linkItems.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      width: "100%",
                      borderRadius: "14px",
                      border: `1px solid ${palette.surfaceBorder}`,
                      bgcolor: palette.surface,
                      color: palette.text,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      py: 1.375,
                      px: 2,
                      wordBreak: "break-word",
                    }}
                  >
                    {item.label?.trim() || item.url}
                  </Box>
                ))
              )}
            </Stack>

            <Typography
              sx={{
                fontSize: "0.6875rem",
                color: palette.textMuted,
                opacity: 0.7,
                pt: 1,
              }}
            >
              {t("preview.watermark")}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default BioPreviewPhone;
