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
}

/**
 * Raw shape of the bio page as returned by `GET /api/bio` / `PUT /api/bio`
 * (snake_case, straight off the Laravel resource).
 */
interface RawBioPage {
  id: number;
  handle: string;
  title: string;
  bio: string | null;
  theme: BioTheme;
  is_active: boolean;
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
   * @throws `ApiError` on 422 (handle taken/reserved/invalid format).
   */
  async upsertPage(input: BioPageUpsertInput): Promise<BioPage> {
    const body: Record<string, unknown> = {
      handle: input.handle,
      title: input.title,
      bio: input.bio?.trim() ? input.bio.trim() : null,
      theme: input.theme ?? "dark",
    };
    if (input.isActive !== undefined) {
      body.is_active = input.isActive;
    }

    const raw = await this.put<RawBioPage>("/api/bio", body);
    return mapBioPage(raw);
  }

  /**
   * Checks whether a candidate handle is free to claim.
   *
   * @param handle - lowercase candidate matching `HANDLE_PATTERN`.
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
