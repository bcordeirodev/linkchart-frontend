import type { ID } from "@/types";

/**
 * Visual theme of the *published* bio page. Purely a per-page content
 * choice — unrelated to the authenticated app's own light/dark theme
 * (`theme.palette.mode`), which stays whatever the user picked for the
 * dashboard.
 */
export type BioTheme = "dark" | "light";

/**
 * One link surfaced as a button on the bio page.
 *
 * Mapped from the backend's snake_case payload (`link_id`, `is_active`) to
 * this camelCase shape in `bio.service.ts` — every consumer in this feature
 * reads the mapped shape only.
 */
export interface BioItem {
  /** The bio-item row's own id — what `PUT/DELETE /api/bio/items/{id}` addresses. */
  id: number;
  /** The underlying link's id (`Link.id`) this item was created from. */
  linkId: ID;
  /**
   * Display label shown on the public page. `null` when the user never set
   * a custom one — the public page then falls back to the link's own title
   * server-side.
   */
  label: string | null;
  /** 0-based order among the page's items; drives render order everywhere. */
  position: number;
  /** Whether this item shows up on the published page. */
  isActive: boolean;
  /** Absolute short URL the button opens (already resolved by the API). */
  url: string;
  /** Total clicks recorded against the underlying link. */
  clicks: number;
  /**
   * Favicon of the destination page, from the link's async-fetched preview
   * (`link_previews.favicon_url`). `null` until the preview job has run —
   * the row falls back to the label's initial.
   */
  faviconUrl: string | null;
}

/**
 * The authenticated user's bio page (`GET /api/bio` → `data`), or `null`
 * when they have not created one yet — the editor's two top-level states
 * hinge entirely on this nullability.
 */
export interface BioPage {
  id: number;
  /** Public handle — the page is reachable at `linkcharts.com.br/@{handle}`. */
  handle: string;
  title: string;
  /** Free-text bio/description, capped at `BIO_DESCRIPTION_MAX_LENGTH`. */
  bio: string | null;
  theme: BioTheme;
  /** Whether the published page is reachable at all ("page is live"). */
  isActive: boolean;
  /**
   * Id of the active `UserSubdomain` this page is published at, or `null`
   * when it lives at the default `/@{handle}` address. Set/cleared via the
   * same `PUT /api/bio` upsert — see `BioPageUpsertInput.subdomainId`.
   */
  subdomainId: number | null;
  /**
   * Server-computed shareable address: the associated subdomain's root
   * (absolute, e.g. `https://acme.linkcharts.com.br`) when `subdomainId` is
   * set, otherwise a path relative to this app's own origin (`/@{handle}`).
   * Compose the relative case with `resolvePublicPageUrl` rather than
   * branching on the shape at each call site.
   */
  url: string;
  /**
   * Publicly-servable URL of the uploaded avatar image, or `null` when the
   * page still falls back to the title/handle initial. Set via
   * `POST /api/bio/avatar`, cleared via `DELETE /api/bio/avatar`.
   */
  avatarUrl: string | null;
  /**
   * Publicly-servable URL of the square thumbnail generated client-side at
   * upload time (`createAvatarThumbnail`), or `null` for avatars uploaded
   * before thumbnails existed (or when generation failed and the upload
   * proceeded original-only). Consumers rendering the small circle should
   * prefer this and fall back to `avatarUrl`.
   */
  avatarThumbUrl: string | null;
  /** Items in display order (already sorted by `position` in the service). */
  items: BioItem[];
}

/**
 * Payload for `PUT /api/bio` — the endpoint is an upsert, so the same shape
 * both creates the page (first save) and edits it (every save after).
 */
export interface BioPageUpsertInput {
  /**
   * Optional and never sent by `BioEditor` (subdomain-first — the form
   * collects an address, not a handle). Omitted on create, the backend
   * derives one from the associated subdomain's label (adding a numeric
   * suffix on collision); omitted on update, the current handle is left
   * untouched. Still accepted when provided, for any other API caller.
   */
  handle?: string;
  title: string;
  bio?: string | null;
  theme?: BioTheme;
  /**
   * Omitted entirely on first create (the backend defaults a fresh page to
   * active) — only sent once an existing page's toggle is touched.
   */
  isActive?: boolean;
  /**
   * Id of the active subdomain to publish this page at. Required in
   * practice — `PUT /api/bio` rejects a missing/`null` value unconditionally
   * (subdomain-first) — but stays `number | null` here to also describe a
   * legacy page's still-unset value before its owner picks one.
   */
  subdomainId?: number | null;
}

/** Payload for `POST /api/bio/items` — adds one existing link as a button. */
export interface BioItemCreateInput {
  linkId: ID;
  label?: string;
}

/** Payload for `PUT /api/bio/items/{id}` — partial update of one item. */
export interface BioItemUpdateInput {
  label?: string;
  isActive?: boolean;
}

/** Result of a handle-availability check (`GET /api/bio/handle-available`). */
export interface HandleAvailabilityResult {
  /** True when the handle can be claimed (or already belongs to the caller). */
  available: boolean;
}
