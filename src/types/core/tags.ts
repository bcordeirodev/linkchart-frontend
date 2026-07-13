/**
 * @fileoverview Tipos relacionados a tags de categorização de links
 * @author Link Charts Team
 * @version 1.0.0
 */

/**
 * User-defined label that can be attached to any number of the user's links.
 *
 * Mirrors the backend `TagResource` payload — deliberately minimal (no
 * `user_id`/timestamps) since tags are always read within the context of the
 * authenticated user, either standalone via `GET /api/tags` or embedded in a
 * `LinkResponse.tags` array.
 */
export interface Tag {
  /** Numeric tag id. */
  id: number;
  /** Tag label, max 50 chars, unique per user. */
  name: string;
  /** 7-char hex colour code, e.g. `"#4E82E6"`. */
  color: string;
}

/** Payload for creating a tag. */
export interface TagCreateRequest {
  /** Tag label (max 50 chars). */
  name: string;
  /** Hex colour code, e.g. `"#4E82E6"`. */
  color: string;
}

/** Payload for updating an existing tag. */
export interface TagUpdateRequest {
  /** New tag label. */
  name?: string;
  /** New hex colour code. */
  color?: string;
}
