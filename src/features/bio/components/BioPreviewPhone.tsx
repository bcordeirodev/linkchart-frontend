"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

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
    background: "#0B0D12",
    surface: "#181B23",
    surfaceBorder: "rgba(255, 255, 255, 0.12)",
    text: "rgba(255, 255, 255, 0.95)",
    textMuted: "rgba(255, 255, 255, 0.62)",
    accent: BRAND_ACCENT,
    accentContrast: "#FFFFFF",
  },
  light: {
    background: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceBorder: "rgba(0, 0, 0, 0.1)",
    text: "rgba(0, 0, 0, 0.92)",
    textMuted: "rgba(0, 0, 0, 0.56)",
    accent: BRAND_ACCENT,
    accentContrast: "#FFFFFF",
  },
};

export interface BioPreviewPhoneProps {
  handle: string;
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
 * Live, non-interactive mock of the published `/@{handle}` page inside a
 * phone frame. Reflects the form's current values on every keystroke —
 * deliberately NOT pixel-identical to the real public page (that page is
 * owned by a different part of the app); it exists to give instant visual
 * feedback on theme, copy and item order while editing.
 */
export function BioPreviewPhone({
  handle,
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

  const displayTitle = title.trim() || t("preview.placeholderTitle");
  const displayHandle = handle.trim() || t("preview.placeholderHandle");
  const displayBio = bio.trim();

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
          boxShadow:
            "0 20px 45px -20px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)",
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
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  color: palette.textMuted,
                  mt: 0.25,
                }}
              >
                @{displayHandle}
              </Typography>
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
                activeItems.map((item) => (
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
