import { Box } from "@mui/material";

import type { BioPalette } from "./bioPalette";

/**
 * Diameter of the avatar circle, in pixels, by breakpoint. Mobile gets the
 * larger value on purpose — 95%+ of traffic is a phone screen reached from
 * Instagram/WhatsApp, so the avatar is the page's hero there, not an
 * afterthought that only gets room to breathe on desktop.
 */
const AVATAR_SIZE = { xs: 108, sm: 116 };
/** Largest size in {@link AVATAR_SIZE}, used as the `<img>` intrinsic hint. */
const AVATAR_SIZE_MAX = 116;

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
 * page. This close-range glow is deliberately paired with a second, much
 * softer page-level wash (`BioPublicPage`'s `backgroundImage`) — near light
 * and far ambient light, rather than one flat halo.
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
      {/* Glow contido (raio menor, blur maior): luz de proximidade sutil em
          vez do balão difuso que o spread largo criava atrás da foto. */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: { xs: -10, sm: -12 },
          borderRadius: "50%",
          background: palette.avatarGlow,
          filter: { xs: "blur(30px)", sm: "blur(32px)" },
          opacity: 0.75,
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
          // Anel fino separa a foto do glow e dá o acabamento de perfil.
          border: `1px solid ${palette.buttonBorder}`,
          boxShadow: "0 8px 24px -8px rgba(0, 0, 0, 0.45)",
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={`Foto de perfil de ${displayName}`}
            width={AVATAR_SIZE_MAX}
            height={AVATAR_SIZE_MAX}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box
            component="span"
            sx={{
              fontSize: { xs: "2.625rem", sm: "2.875rem" },
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
