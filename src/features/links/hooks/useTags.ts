"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { QueryClient } from "@tanstack/react-query";

import { useMessage } from "@/lib/providers/MessageProvider";
import { queryKeys } from "@/lib/query/keys";
import { tagService } from "@/services";
import { i18n } from "@/lib/i18n";

import type { Tag, TagCreateRequest, TagUpdateRequest } from "@/types";

interface TagCreateRequestExtended
  extends TagCreateRequest,
    Record<string, unknown> {}

interface TagUpdateRequestExtended
  extends TagUpdateRequest,
    Record<string, unknown> {}

/**
 * Invalidates both `["tags"]` and `["links"]` caches.
 *
 * Every tag mutation (create/update/delete) needs both: the tag list itself
 * (used by the picker and the filter row) and the links list (whose cards
 * embed `LinkResponse.tags`, so a renamed/recolored/deleted tag must also
 * refresh what's shown on cards).
 *
 * @param queryClient - the active TanStack Query client.
 */
function invalidateTagsAndLinks(queryClient: QueryClient): void {
  queryClient.invalidateQueries({ queryKey: queryKeys.tags.all() });
  queryClient.invalidateQueries({ queryKey: queryKeys.links.all() });
}

/**
 * Lists all tags owned by the authenticated user.
 *
 * @returns TanStack Query result with `data: Tag[] | undefined`.
 *
 * @remarks
 * Cache key: `queryKeys.tags.list()` → `["tags", "list"]`.
 * Endpoint: `GET /api/tags` (via `tagService.all()`).
 */
export function useTags() {
  return useQuery<Tag[]>({
    queryKey: queryKeys.tags.list(),
    queryFn: () => tagService.all(),
  });
}

/**
 * Mutation: create a tag for the authenticated user.
 *
 * @endpoint `POST /api/tags` (via `tagService.create()`)
 * @invalidates `queryKeys.tags.all()` and `queryKeys.links.all()`
 *
 * @remarks
 * On error (duplicate name or the 20-tags-per-user cap, both `422`), dispatches
 * a generic toast via `MessageProvider`. Callers embedding this in an inline
 * "create tag" flow (e.g. the freeSolo tag picker) should still `catch` the
 * rejected `mutateAsync` to reset their own local pending state.
 */
export function useCreateTag() {
  const { showMessage } = useMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TagCreateRequestExtended) => tagService.create(data),
    onSuccess: () => invalidateTagsAndLinks(queryClient),
    onError: () => {
      const msg = (i18n.t as (key: string, opts: object) => string)(
        "errors.createTag",
        { ns: "links" },
      );
      showMessage({ message: msg, variant: "error" });
    },
  });
}

/**
 * Mutation: update an existing tag owned by the authenticated user.
 *
 * @param id - tag id to update.
 * @endpoint `PUT /api/tags/{id}` (via `tagService.update()`)
 * @invalidates `queryKeys.tags.all()` and `queryKeys.links.all()`
 *
 * @remarks
 * On error, dispatches a generic toast via `MessageProvider`.
 */
export function useUpdateTag(id: string) {
  const { showMessage } = useMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TagUpdateRequestExtended) => tagService.update(id, data),
    onSuccess: () => invalidateTagsAndLinks(queryClient),
    onError: () => {
      const msg = (i18n.t as (key: string, opts: object) => string)(
        "errors.updateTag",
        { ns: "links" },
      );
      showMessage({ message: msg, variant: "error" });
    },
  });
}

/**
 * Mutation: delete a tag by id (detaches it from every link that used it).
 *
 * @endpoint `DELETE /api/tags/{id}` (via `tagService.remove()`)
 * @invalidates `queryKeys.tags.all()` and `queryKeys.links.all()`
 *
 * @remarks
 * On error, dispatches a generic toast via `MessageProvider`.
 */
export function useDeleteTag() {
  const { showMessage } = useMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagService.remove(id),
    onSuccess: () => invalidateTagsAndLinks(queryClient),
    onError: () => {
      const msg = (i18n.t as (key: string, opts: object) => string)(
        "errors.deleteTag",
        { ns: "links" },
      );
      showMessage({ message: msg, variant: "error" });
    },
  });
}
