import { API_CONFIG } from "../lib/api/endpoints";

import { BaseService } from "./base.service";

import type { Tag, TagCreateRequest, TagUpdateRequest } from "@/types";

// Extend types to match Record<string, unknown>
interface TagCreateRequestExtended
  extends TagCreateRequest,
    Record<string, unknown> {}
interface TagUpdateRequestExtended
  extends TagUpdateRequest,
    Record<string, unknown> {}

/**
 * REST client for `/api/tags` (authenticated CRUD).
 *
 * Wraps `BaseService` and inherits envelope unwrap + JWT injection from `ApiClient`.
 * Mirrors `LinkService`'s shape so `useTags`/`useCreateTag`/etc. in
 * `src/features/links/hooks/useTags.ts` follow the same pattern as `useLinks`.
 */
export default class TagService extends BaseService {
  constructor() {
    super("TagService");
  }

  /**
   * Lists every tag owned by the authenticated user.
   *
   * @returns array of `Tag` (already unwrapped from the `{data}` envelope).
   * @endpoint `GET /api/tags`
   */
  async all(): Promise<Tag[]> {
    return this.get<Tag[]>(API_CONFIG.ENDPOINTS.TAGS, {
      context: "get_all_tags",
    });
  }

  /**
   * Creates a new tag for the authenticated user.
   *
   * @param body - `{name, color}`; `name` max 50 chars, `color` a `"#RRGGBB"` hex string.
   * @returns the created `Tag`.
   * @endpoint `POST /api/tags`
   *
   * @remarks
   * The backend rejects duplicate names and enforces a 20-tags-per-user cap,
   * both as `422` responses surfaced as `ApiError`.
   */
  async create(body: TagCreateRequestExtended): Promise<Tag> {
    this.validateRequired(body, ["name", "color"]);

    return this.post<Tag>(API_CONFIG.ENDPOINTS.TAGS, body, {
      context: "create_tag",
    });
  }

  /**
   * Updates an existing tag owned by the authenticated user.
   *
   * @param id - tag id.
   * @param body - partial `{name?, color?}` payload.
   * @returns the updated `Tag`.
   * @endpoint `PUT /api/tags/{id}`
   */
  async update(id: string, body: TagUpdateRequestExtended): Promise<Tag> {
    this.validateId(id, "Tag ID");

    return this.put<Tag>(API_CONFIG.ENDPOINTS.TAG(id), body, {
      context: "update_tag",
    });
  }

  /**
   * Deletes a tag owned by the authenticated user (detaches it from every link).
   *
   * @param id - tag id.
   * @returns `{message}` confirmation envelope.
   * @endpoint `DELETE /api/tags/{id}`
   */
  async remove(id: string): Promise<{ message: string }> {
    this.validateId(id, "Tag ID");

    return this.delete<{ message: string }>(API_CONFIG.ENDPOINTS.TAG(id), {
      context: "delete_tag",
    });
  }
}

// Instância singleton do serviço
const tagService = new TagService();

export { tagService };
