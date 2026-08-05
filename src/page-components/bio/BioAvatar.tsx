import { Box } from "@mui/material";

import { BIO_FONT_DISPLAY } from "./bioPalette";

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
 * One circle, one hairline ring, nothing behind it. The blurred violet-blue
 * halo that used to sit under this element — and the violet→blue gradient
 * that filled the initial-letter fallback — were the page's loudest
 * AI-template tells (the redesign spec names "gradiente radial roxo sobre
 * dark" specifically) and are gone as of 2026-08-04.
 *
 * The fallback is now the same surface every other raised element on the
 * page uses (translucent veil + hairline) with the monogram in Space Grotesk
 * on the product's primary blue — the page's only accent, spent here and on
 * the focus ring. Keeping the ring identical in both states means the frame
 * reads the same whether or not a photo was uploaded, instead of a photo
 * being framed and a fallback being a colored blob.
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
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        mx: "auto",
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: avatarUrl ? undefined : palette.surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Elevação por borda, nunca por sombra ou cinza mais claro: a mesma
        // hairline dos itens e dos ícones, aqui fechando o círculo.
        border: `1px solid ${palette.hairline}`,
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
            fontFamily: BIO_FONT_DISPLAY,
            fontSize: { xs: "2.625rem", sm: "2.875rem" },
            fontWeight: 700,
            lineHeight: 1,
            color: palette.accent,
            letterSpacing: "-0.02em",
          }}
        >
          {initial}
        </Box>
      )}
    </Box>
  );
}
