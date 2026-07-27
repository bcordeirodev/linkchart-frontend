import { Box } from "@mui/material";

import type { BioPalette } from "./bioPalette";

/** Diameter of the avatar circle, in pixels. */
const AVATAR_SIZE = 88;

interface BioAvatarProps {
  /** First character of the page title, already uppercased. Ignored when `avatarUrl` is set. */
  initial: string;
  /** Resolved color set for the page's theme. */
  palette: BioPalette;
  /**
   * Uploaded avatar URL, or `null`/`undefined` to fall back to `initial`.
   * Same-infra as the rest of the app (backend storage disk), so this is a
   * plain `<img>` rather than `next/image` — no remote-domain config to
   * maintain for a URL that always points at this product's own backend.
   */
  avatarUrl?: string | null;
  /**
   * The creator's display name, used to build a meaningful `alt` text
   * (`"Foto de perfil de {name}"`) when `avatarUrl` is set — this is the
   * page's one real photo, not decorative chrome, so it gets a description
   * rather than `alt=""`. Hardcoded pt-BR like the rest of this public page
   * (see `BioFooterBadge`): no established language preference for a
   * stranger's page.
   */
  displayName: string;
}

/**
 * Circular avatar showing either the creator's uploaded photo or, absent
 * one, the initial letter of their display name.
 *
 * A soft glow (the same gradient used for the initial-letter fallback, low
 * opacity, blurred) always sits behind the circle — kept even with a real
 * photo so the frame stays consistent and the avatar keeps reading as the
 * one deliberately "designed" element on an otherwise plain, content-first
 * page.
 */
export default function BioAvatar({
  initial,
  palette,
  avatarUrl,
  displayName,
}: BioAvatarProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        mx: "auto",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: -18,
          borderRadius: "50%",
          background: palette.avatarGlow,
          filter: "blur(22px)",
        }}
      />
      <Box
        sx={{
          position: "relative",
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          borderRadius: "50%",
          overflow: "hidden",
          background: avatarUrl ? undefined : palette.avatarGradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px -8px rgba(0, 0, 0, 0.45)",
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={`Foto de perfil de ${displayName}`}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box
            component="span"
            sx={{
              fontSize: "2.25rem",
              fontWeight: 800,
              lineHeight: 1,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            {initial}
          </Box>
        )}
      </Box>
    </Box>
  );
}
