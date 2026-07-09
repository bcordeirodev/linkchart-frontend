"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useMessage } from "@/lib/providers/MessageProvider";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";
import { linkService } from "@/services";
import { i18n } from "@/lib/i18n";

import type {
  LinkCreateRequest,
  LinkResponse,
  LinkUpdateRequest,
} from "@/types";

interface LinkCreateRequestExtended
  extends LinkCreateRequest,
    Record<string, unknown> {}

interface LinkUpdateRequestExtended
  extends LinkUpdateRequest,
    Record<string, unknown> {}

/**
 * Lists all links owned by the authenticated user.
 *
 * @returns `{ links: LinkResponse[], loading, error }`
 *
 * @remarks
 * Cache key: `queryKeys.links.list()` → `["links", "list"]`.
 * Endpoint: `GET /api/links` (via `linkService.all()`).
 * Stale time: `API_CONFIG.CACHE.LINKS_TTL`.
 */
export function useLinks() {
  const {
    data: links = [],
    isLoading: loading,
    error,
  } = useQuery<LinkResponse[]>({
    queryKey: queryKeys.links.list(),
    queryFn: () => linkService.all(),
    staleTime: API_CONFIG.CACHE.LINKS_TTL,
  });

  return {
    links,
    loading,
    error: error ? (error as Error).message : null,
  };
}

/**
 * Mutation: create a link for the authenticated user.
 *
 * @endpoint `POST /api/links` (via `linkService.save()`)
 * @invalidates `queryKeys.links.all()`
 *
 * @remarks
 * On error, dispatches a generic toast via `MessageProvider`.
 */
export function useCreateLink() {
  const { showMessage } = useMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LinkCreateRequestExtended) => linkService.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all() });
    },
    onError: () => {
      const msg = (i18n.t as (key: string, opts: object) => string)(
        "errors.createLink",
        { ns: "links" },
      );
      showMessage({ message: msg, variant: "error" });
    },
  });
}

/**
 * Mutation: update an existing link owned by the authenticated user.
 *
 * @param id - canonical link id to update.
 * @endpoint `PUT /api/links/{id}` (via `linkService.update()`)
 * @invalidates `queryKeys.links.all()` and `queryKeys.links.detail(id)`
 *
 * @remarks
 * Edits MUST go through this hook (never `linkService.update()` directly) so the
 * links list (`staleTime` 2 min) and the link detail cache are invalidated and
 * the UI doesn't serve pre-edit data on the next navigation. On error, dispatches
 * a generic toast; callers may still `catch` to map 422 field errors via
 * `applyBackendFieldErrors`.
 */
export function useUpdateLink(id: string) {
  const { showMessage } = useMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LinkUpdateRequestExtended) =>
      linkService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.links.detail(id) });
    },
    onError: () => {
      const msg = (i18n.t as (key: string, opts: object) => string)(
        "errors.updateLink",
        { ns: "links" },
      );
      showMessage({ message: msg, variant: "error" });
    },
  });
}

/**
 * Mutation: soft-delete a link by id.
 *
 * @endpoint `DELETE /api/links/{id}` (via `linkService.remove()`)
 * @invalidates `queryKeys.links.all()`
 *
 * @remarks
 * On error, dispatches a generic toast via `MessageProvider`.
 */
export function useDeleteLink() {
  const { showMessage } = useMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => linkService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all() });
    },
    onError: () => {
      const msg = (i18n.t as (key: string, opts: object) => string)(
        "errors.deleteLink",
        { ns: "links" },
      );
      showMessage({ message: msg, variant: "error" });
    },
  });
}

/**
 * Fetches a single link by id.
 *
 * @param id - canonical link id; the query stays disabled when falsy
 * @returns TanStack Query result with `data: LinkResponse | undefined`
 *
 * @remarks
 * Cache key: `queryKeys.links.detail(id)` → `["links", "detail", id]`.
 * Endpoint: `GET /api/links/{id}` (via `linkService.findOne()`).
 * `throwOnError: false` — error surfaces through `meta.onError` as a toast.
 */
export function useLinkById(id: string) {
  const { showMessage } = useMessage();

  return useQuery<LinkResponse>({
    queryKey: queryKeys.links.detail(id),
    queryFn: () => linkService.findOne(id),
    staleTime: API_CONFIG.CACHE.LINKS_TTL,
    enabled: !!id,
    throwOnError: false,
    meta: {
      onError: () => {
        const msg = (i18n.t as (key: string, opts: object) => string)(
          "errors.fetchLink",
          { ns: "links" },
        );
        showMessage({ message: msg, variant: "error" });
      },
    },
  });
}
