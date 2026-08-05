import { Globe } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";
import {
  SiGithub,
  SiInstagram,
  SiTiktok,
  SiX,
  SiYoutube,
} from "react-icons/si";

import { WhatsAppIcon } from "./WhatsAppIcon";

import type { ElementType } from "react";

/**
 * The 8-value platform whitelist the bio feature exposes for icon items —
 * mirrors `config('bio.social_platforms')` on the backend
 * (`backend/config/bio.php`), the single source of truth the API validates
 * `social_platform` against. Order here is also the display order in every
 * picker (`AddBioIconDialog`'s platform select, `BioItemRow`'s change-platform
 * menu).
 *
 * Extending the backend's whitelist requires adding the new key both here and
 * to `bio.social_platforms` — this is a config mirror, not derived at runtime,
 * the same relationship `MAX_BIO_ITEMS` has with the backend's item cap.
 */
export const SOCIAL_PLATFORM_KEYS = [
  "instagram",
  "tiktok",
  "youtube",
  "x",
  "whatsapp",
  "linkedin",
  "github",
  "website",
] as const;

/** One value from {@link SOCIAL_PLATFORM_KEYS} — the bio feature's `social_platform` field. */
export type SocialPlatformKey = (typeof SOCIAL_PLATFORM_KEYS)[number];

/**
 * Maps each platform to its glyph component. Deliberately mixes icon
 * families rather than introducing a new dependency:
 *
 * - `instagram`/`tiktok`/`youtube`/`x`/`github` — Simple Icons brand marks via
 *   `react-icons/si` (already a dependency — see `SocialBrandIcon.tsx`, which
 *   uses the same package for the analytics referer-classification chips).
 *   Solid-fill glyphs, chosen over lucide's outline equivalents so every
 *   platform in this map shares one consistent visual weight.
 * - `linkedin` — Font Awesome's `FaLinkedinIn` (`react-icons/fa6`), not
 *   Simple Icons: `SocialBrandIcon.tsx` already made this substitution
 *   because Simple Icons dropped the LinkedIn mark over trademark concerns.
 *   Same reasoning, same source, reused rather than re-litigated.
 * - `whatsapp` — the existing local `WhatsAppIcon` (solid fill, hand-drawn
 *   once for the share buttons in `ShorterSuccessCard`/`LinkQRPanel`/
 *   `LinkHeroCard`) instead of `react-icons`' `SiWhatsapp` — reuses the
 *   codebase's own established WhatsApp mark rather than a second one.
 * - `website` — lucide's outline `Globe`, already the fallback glyph for "no
 *   brand to show" in `BioItemFavicon.tsx`. Deliberately the one outline
 *   glyph in an otherwise solid-fill set: `website` is the non-brand bucket,
 *   so reading slightly different from the other 7 marks is intentional, not
 *   an inconsistency to fix.
 */
const PLATFORM_GLYPHS: Record<SocialPlatformKey, ElementType> = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  youtube: SiYoutube,
  x: SiX,
  whatsapp: WhatsAppIcon,
  linkedin: FaLinkedinIn,
  github: SiGithub,
  website: Globe,
};

/** Props for {@link SocialPlatformIcon}. */
export interface SocialPlatformIconProps {
  /** Which of the 8 whitelisted platforms to render. */
  platform: SocialPlatformKey;
  /** Edge length in pixels (square). Defaults to 18. */
  size?: number;
}

/**
 * Renders the brand glyph for one of the bio feature's 8 whitelisted social
 * platforms (`SOCIAL_PLATFORM_KEYS`). Used on both sides of the bio feature's
 * ownership split — the public page's icon row (`BioSocialIconsRow`) and the
 * editor's icon-item affordances (`BioItemRow`'s platform badge,
 * `AddBioIconDialog`'s platform select, `BioPerformancePanel`'s ranked list)
 * — so the two never drift onto different glyphs for the same platform key.
 *
 * Every glyph inherits `currentColor`, matching the rest of this icon
 * module — callers control color via the surrounding element, never a prop
 * here.
 */
export function SocialPlatformIcon({
  platform,
  size = 18,
}: SocialPlatformIconProps) {
  const Glyph = PLATFORM_GLYPHS[platform];
  return <Glyph size={size} aria-hidden />;
}

export default SocialPlatformIcon;
