/**
 * Local, page-scoped types for the public link-in-bio page (`/@{handle}` →
 * `/b/{handle}`).
 *
 * These intentionally live next to the components that consume them instead
 * of `src/types/` or `src/features/bio/` — the latter is owned by a parallel
 * workstream. If the bio feature grows beyond this single public page (e.g. an
 * authenticated editor), promote these to `src/features/bio/types/` at that
 * point instead of importing across ownership boundaries.
 */

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
  /** Ordered list of link buttons. */
  items: BioLinkItem[];
}

/** Shape of the envelope returned by the public bio API endpoint. */
export interface BioApiResponse {
  data: BioPageData;
}
