import { FaLinkedinIn } from "react-icons/fa6";
import {
  SiFacebook,
  SiInstagram,
  SiTelegram,
  SiTiktok,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from "react-icons/si";

import type { ComponentType } from "react";

/** Icon component signature shared by react-icons glyphs. */
type BrandGlyph = ComponentType<{
  size?: number | string;
  "aria-hidden"?: boolean;
}>;

/**
 * Maps a social-platform key (as emitted by the referer classifier) to its
 * brand glyph. LinkedIn comes from Font Awesome because Simple Icons dropped
 * it over trademark concerns; every other mark is a Simple Icons glyph.
 */
const BRAND_GLYPHS: Record<string, BrandGlyph> = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  facebook: SiFacebook,
  youtube: SiYoutube,
  twitter: SiX,
  whatsapp: SiWhatsapp,
  telegram: SiTelegram,
  linkedin: FaLinkedinIn,
};

/** Props for {@link SocialBrandIcon}. */
export interface SocialBrandIconProps {
  /** Platform key (e.g. `"instagram"`, `"whatsapp"`). Case-insensitive. */
  platform: string;
  /** Edge length in pixels. Defaults to 16. */
  size?: number;
}

/**
 * Renders the brand glyph for a social platform, or `null` when the platform
 * has no known mark (so callers can fall back to a neutral label).
 *
 * Brand glyphs are sourced from `react-icons` and centralized here so the rest
 * of the app references a single local component — the dependency stays
 * encapsulated and the icon set is swappable in one place. The glyph inherits
 * `currentColor`, so callers control the color (typically the platform's brand
 * color) via the surrounding element.
 */
export function SocialBrandIcon({ platform, size = 16 }: SocialBrandIconProps) {
  const Glyph = BRAND_GLYPHS[platform.toLowerCase()];
  if (!Glyph) {
    return null;
  }
  return <Glyph size={size} aria-hidden />;
}

export default SocialBrandIcon;
