/**
 * Local, page-scoped types for the public link-in-bio page (`/@{handle}` →
 * `/b/{handle}`).
 *
 * These intentionally live next to the components that consume them instead
 * of `src/types/` or `src/features/bio/` — the latter is owned by a parallel
 * workstream. If the bio feature grows beyond this single public page (e.g. an
 * authenticated editor), promote these to `src/features/bio/types/` at that
 * point instead of importing across ownership boundaries.
 *
 * `SocialPlatformKey` is the one exception imported across that boundary
 * (from `@/shared/ui/icons`, not from `features/bio`): it types the glyph
 * lookup in `SocialPlatformIcon`, a presentational primitive both this page
 * and the editor already treat as neutral shared ground, the same way both
 * sides independently import MUI/`shared/ui/base` components.
 */
import type { SocialPlatformKey } from "@/shared/ui/icons";

/** Visual theme selected by the page owner. `dark` is the product default. */
export type BioTheme = "dark" | "light";

/** A single tappable link rendered as a full-width button. */
export interface BioLinkItem {
  /** Stable identifier for the item, used as the React list key. */
  id: string | number;
  /** Button label shown to visitors (already user-authored copy). */
  label: string;
  /**
   * Destination URL. In practice this is always a Link Charts short URL —
   * click tracking happens server-side on the `/r/{slug}` redirect, so this
   * page never needs client-side tracking JavaScript.
   */
  url: string;
  /**
   * Favicon of the final destination, fetched asynchronously by the preview
   * pipeline. Rendered as a small tile inside the button — the visitor sees
   * where the click leads before tapping. Optional AND nullable: older
   * cached payloads may lack the key; both read as "no favicon yet".
   */
  favicon_url?: string | null;
  /**
   * Host of the FINAL destination (original URL, `www.` stripped) — the
   * button's second line: "this click goes to github.com". Path and query
   * stay private by design; only the host is public (the click reveals it
   * anyway). Optional for older cached payloads.
   */
  destination_host?: string | null;
  /**
   * Whether this item renders as a full-width button (`"item"`, default) or
   * a small round icon in the social icons row above the items list
   * (`"icon"`). Optional so an older cached payload (predating this field)
   * still type-checks and falls back to `"item"` — see
   * `BioPublicPage`'s split of `data.items` into icon vs. link groups.
   */
  display?: "item" | "icon";
  /**
   * Which of the 8 whitelisted platforms this icon represents, non-null only
   * when `display === "icon"`. Optional/nullable for the same
   * older-cached-payload reason as `display`.
   */
  social_platform?: SocialPlatformKey | null;
}

/** Payload returned by `GET /api/public/bio/{handle}`. */
export interface BioPageData {
  /** The creator's handle, without the `@` prefix. */
  handle: string;
  /** Display name rendered as the page's `<h1>`. */
  title: string;
  /** Short bio/description rendered under the title. */
  bio: string;
  /** Visual theme for the page chrome. */
  theme: BioTheme;
  /**
   * Publicly-servable URL of the creator's uploaded avatar, or `null` when
   * they haven't uploaded one — the page falls back to the title's initial
   * in that case. Named `avatar_url` (not camelCased) like every other
   * field here: this module reads the backend's JSON response directly with
   * no mapping layer (see `fetchBioData` in `app/(public)/b/[handle]/page.tsx`),
   * unlike `features/bio/services/bio.service.ts`, which does map to
   * camelCase for the authenticated editor. Optional (not just nullable) so
   * a backend response that predates this field still type-checks; treat a
   * missing key the same as `null`.
   */
  avatar_url?: string | null;
  /**
   * Square thumbnail generated client-side at upload time — the page's
   * avatar circle renders this (crisper at ~116px, lighter to load) and
   * falls back to `avatar_url` for avatars uploaded before thumbnails
   * existed. `bioMetadata` deliberately keeps the ORIGINAL as the Open
   * Graph image — WhatsApp/Instagram previews want the full photo.
   */
  avatar_thumb_url?: string | null;
  /**
   * Canonical public URL computed by the backend: the subdomain's root
   * (absolute, e.g. `https://bruno.linkcharts.com.br`) when the page has an
   * associated subdomain, or the relative `/@{handle}` path for a legacy
   * page without one. Optional so older cached responses still type-check.
   */
  url?: string;
  /** Ordered list of link buttons. */
  items: BioLinkItem[];
}

/** Shape of the envelope returned by the public bio API endpoint. */
export interface BioApiResponse {
  data: BioPageData;
}
