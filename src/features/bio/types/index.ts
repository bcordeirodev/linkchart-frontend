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
  /** Items in display order (already sorted by `position` in the service). */
  items: BioItem[];
}

/**
 * Payload for `PUT /api/bio` — the endpoint is an upsert, so the same shape
 * both creates the page (first save) and edits it (every save after).
 */
export interface BioPageUpsertInput {
  handle: string;
  title: string;
  bio?: string | null;
  theme?: BioTheme;
  /**
   * Omitted entirely on first create (the backend defaults a fresh page to
   * active) — only sent once an existing page's toggle is touched.
   */
  isActive?: boolean;
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
