import { BaseService } from "./base.service";

import type {
  BioItem,
  BioItemCreateInput,
  BioItemUpdateInput,
  BioPage,
  BioPageUpsertInput,
  BioTheme,
  HandleAvailabilityResult,
} from "@/features/bio/types";
import type { ID } from "@/types";

/**
 * Raw shape of one item as returned nested inside `GET /api/bio`
 * (snake_case, straight off the Laravel resource).
 */
interface RawBioItem {
  id: number;
  link_id: ID;
  label: string | null;
  position: number;
  is_active: boolean;
  url: string;
  clicks: number;
  /** Destination favicon from the link's async preview; null until fetched. */
  favicon_url?: string | null;
}

/**
 * Raw shape of the bio page as returned by `GET /api/bio` / `PUT /api/bio`
 * (snake_case, straight off the Laravel resource).
 *
 * `avatar_url` is marked optional rather than `string | null` — defensive
 * against the management endpoints not (yet) echoing it back on every
 * response; `mapBioPage` defaults a missing key to `null`.
 */
interface RawBioPage {
  id: number;
  handle: string;
  title: string;
  bio: string | null;
  theme: BioTheme;
  is_active: boolean;
  subdomain_id: number | null;
  url: string;
  avatar_url?: string | null;
  avatar_thumb_url?: string | null;
  items: RawBioItem[];
}

/** Maps one raw item record to the camelCase `BioItem` shape. */
function mapBioItem(raw: RawBioItem): BioItem {
  return {
    id: raw.id,
    linkId: raw.link_id,
    label: raw.label,
    position: raw.position,
    isActive: raw.is_active,
    url: raw.url,
    clicks: raw.clicks,
    faviconUrl: raw.favicon_url ?? null,
  };
}

/**
 * Maps a raw bio page record to the camelCase `BioPage` shape consumed by
 * the `/bio` editor. Items are sorted by `position` here so every consumer
 * (form, list, preview) can trust render order without re-sorting.
 */
function mapBioPage(raw: RawBioPage): BioPage {
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    bio: raw.bio,
    theme: raw.theme,
    isActive: raw.is_active,
    subdomainId: raw.subdomain_id,
    url: raw.url,
    avatarUrl: raw.avatar_url ?? null,
    avatarThumbUrl: raw.avatar_thumb_url ?? null,
    items: [...raw.items]
      .sort((a, b) => a.position - b.position)
      .map(mapBioItem),
  };
}

/**
 * HTTP client for the authenticated user's link-in-bio page
 * (`/api/bio` + `/api/bio/items*`).
 *
 * All methods require an authenticated session (Bearer token in
 * `ApiClient`). `GET /api/bio` legitimately returns `null` data (the user
 * has not created a page yet) — that is a successful response, not an
 * error, so `getPage()` returns `BioPage | null` rather than throwing.
 */
export class BioService extends BaseService {
  constructor() {
    super("BioService");
  }

  /**
   * Fetches the authenticated user's bio page, or `null` if none exists yet.
   * Falls back to `null` on request failure too (graceful degradation —
   * worst case the editor shows the create pitch instead of a hard error).
   */
  async getPage(): Promise<BioPage | null> {
    const raw = await this.get<RawBioPage | null>("/api/bio", {
      fallback: null,
    });
    return raw ? mapBioPage(raw) : null;
  }

  /**
   * Creates or updates the authenticated user's bio page (upsert — the same
   * request both creates it on the first save and edits it afterwards).
   *
   * `handle` is omitted from the request body whenever `input.handle` is
   * `undefined` — which is every call from `BioEditor` (subdomain-first: the
   * form collects an address, not a handle). The backend then derives a
   * handle from the subdomain's label on create, or leaves the current one
   * untouched on update.
   *
   * @throws `ApiError` on 422 (missing/invalid subdomain, or an explicitly
   * passed handle that's taken/reserved/malformed).
   */
  async upsertPage(input: BioPageUpsertInput): Promise<BioPage> {
    const body: Record<string, unknown> = {
      title: input.title,
      bio: input.bio?.trim() ? input.bio.trim() : null,
      theme: input.theme ?? "dark",
    };
    if (input.handle !== undefined) {
      body.handle = input.handle;
    }
    if (input.isActive !== undefined) {
      body.is_active = input.isActive;
    }
    if (input.subdomainId !== undefined) {
      body.subdomain_id = input.subdomainId;
    }

    const raw = await this.put<RawBioPage>("/api/bio", body);
    return mapBioPage(raw);
  }

  /**
   * Uploads (or replaces) the bio page's avatar image.
   *
   * @param file - the image, already checked client-side by
   * `validateAvatarFile` (type + size) — the backend re-validates type,
   * size, and minimum 100x100 dimensions regardless, returning 422 with a
   * field-level message under `error.details.errors.avatar` on failure.
   * @param thumb - optional square thumbnail generated client-side by
   * `createAvatarThumbnail` — the original stays the Open Graph image while
   * the thumbnail feeds the page's small avatar circle. `null` uploads the
   * original only (the backend clears any previous thumbnail).
   * @throws `ApiError` on 422 (invalid file) or when the user has no bio
   * page yet to attach the avatar to.
   */
  async uploadAvatar(file: File, thumb?: File | null): Promise<BioPage> {
    const formData = new FormData();
    formData.append("avatar", file);
    if (thumb) {
      formData.append("avatar_thumb", thumb);
    }
    const raw = await this.upload<RawBioPage>("/api/bio/avatar", formData);
    return mapBioPage(raw);
  }

  /** Removes the bio page's avatar image, reverting the public page to its title/handle initial. */
  async removeAvatar(): Promise<BioPage> {
    const raw = await this.delete<RawBioPage>("/api/bio/avatar");
    return mapBioPage(raw);
  }

  /**
   * Checks whether a candidate handle is free to claim.
   *
   * Unused by `BioEditor` since the subdomain-first change (the form no
   * longer collects a handle — see `BioPageUpsertInput.handle`); kept for
   * any other caller that still lets a user pick one explicitly.
   *
   * @param handle - lowercase candidate handle.
   */
  async checkHandleAvailability(
    handle: string,
  ): Promise<HandleAvailabilityResult> {
    return this.get<HandleAvailabilityResult>(
      `/api/bio/handle-available?handle=${encodeURIComponent(handle)}`,
    );
  }

  /**
   * Adds an existing link as a button on the bio page.
   *
   * @throws `ApiError` on 422 when the page already holds `MAX_BIO_ITEMS`.
   */
  async addItem(input: BioItemCreateInput): Promise<BioItem> {
    const raw = await this.post<RawBioItem>("/api/bio/items", {
      link_id: input.linkId,
      label: input.label,
    });
    return mapBioItem(raw);
  }

  /** Partially updates one item (label and/or active state). */
  async updateItem(id: number, input: BioItemUpdateInput): Promise<BioItem> {
    const raw = await this.put<RawBioItem>(`/api/bio/items/${id}`, {
      label: input.label,
      is_active: input.isActive,
    });
    return mapBioItem(raw);
  }

  /** Removes one item from the page. */
  async removeItem(id: number): Promise<void> {
    await this.delete<void>(`/api/bio/items/${id}`);
  }

  /**
   * Persists a new item order.
   *
   * @param ids - every item id for the page, in the desired display order.
   */
  async reorderItems(ids: number[]): Promise<void> {
    await this.put<void>("/api/bio/items-order", { ids });
  }
}

/** Singleton instance for use in hooks. */
export const bioService = new BioService();
