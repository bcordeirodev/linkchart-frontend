"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { Globe } from "lucide-react";

import type { BioPalette } from "./bioPalette";

export interface BioItemFaviconProps {
  /**
   * Destination favicon URL from the link's async preview, or null/undefined
   * when the preview job hasn't run yet.
   */
  faviconUrl?: string | null;
  /** Label's initial — fallback shown while no favicon has been fetched yet. */
  initial: string;
  /** Resolved color set for the page's theme (tile border/background). */
  palette: BioPalette;
}

/**
 * Favicon tile for one bio link button, split out of `BioLinkButton` into
 * its own small Client Component so that component can stay a zero-JS
 * Server Component (see its docstring) — `onError` is a browser event
 * handler and cannot cross the Server/Client boundary any other way.
 *
 * Three states: no `faviconUrl` yet (preview job hasn't run) shows the
 * label's `initial`, exactly as `BioLinkButton` always rendered it; a
 * `faviconUrl` that loads shows the image; a `faviconUrl` that fails to load
 * (e.g. a since-dead destination like `example.com` 404ing on the preview
 * pipeline's favicon lookup) falls back to a neutral `Globe` glyph instead of
 * the browser's broken-image icon — same `onError`-triggered swap as
 * `LinkPreviewThumb` and `ShorterSuccessCard`'s `DestinationFavicon`.
 */
export function BioItemFavicon({
  faviconUrl,
  initial,
  palette,
}: BioItemFaviconProps) {
  const [failed, setFailed] = useState(false);

  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        width: 38,
        height: 38,
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "11px",
        border: `1px solid ${palette.buttonBorder}`,
        backgroundColor: palette.background,
        overflow: "hidden",
        fontSize: "0.9rem",
        fontWeight: 700,
        color: palette.textSecondary,
      }}
    >
      {faviconUrl && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element -- favicon externo minúsculo; next/image exigiria liberar todo domínio possível
        <img
          src={faviconUrl}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          style={{ objectFit: "contain" }}
        />
      ) : failed ? (
        <Globe size={18} strokeWidth={1.5} style={{ opacity: 0.6 }} />
      ) : (
        initial
      )}
    </Box>
  );
}

export default BioItemFavicon;
