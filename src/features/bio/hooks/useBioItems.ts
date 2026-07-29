"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { i18n } from "@/lib/i18n";
import { useMessage } from "@/lib/providers/MessageProvider";
import { queryKeys } from "@/lib/query/keys";

import { revalidatePublicBio } from "../utils/revalidatePublicBio";
import { bioService } from "@/services/bio.service";

import type {
  BioItem,
  BioItemCreateInput,
  BioItemUpdateInput,
  BioPage,
} from "../types";

/** Translates a `bio` namespace key — shared by every mutation's onError below. */
function t(key: string): string {
  return (i18n.t as (key: string, opts: object) => string)(key, { ns: "bio" });
}

/**
 * Mutation: add an existing link as a button on the bio page.
 *
 * @endpoint `POST /api/bio/items` (via `bioService.addItem()`)
 * @invalidates `queryKeys.bio.page()`
 *
 * @remarks
 * On error, dispatches a generic toast. `AddBioItemDialog` still `catch`es
 * the rejected `mutateAsync` itself to special-case the 20-item cap (422)
 * with an inline message, matching the codebase's existing
 * toast-plus-inline-detail pattern (see `useCreateLink`/`CreateLinkForm`).
 */
export function useAddBioItem() {
  const { showMessage } = useMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BioItemCreateInput) => bioService.addItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bio.page() });
      revalidatePublicBio(
        queryClient.getQueryData<BioPage>(queryKeys.bio.page()),
      );
    },
    onError: () => {
      showMessage({ message: t("items.errors.addGeneric"), variant: "error" });
    },
  });
}

/**
 * Mutation: rename an item or toggle whether it shows on the published page.
 *
 * @endpoint `PUT /api/bio/items/{id}` (via `bioService.updateItem()`)
 * @invalidates `queryKeys.bio.page()`
 */
export function useUpdateBioItem() {
  const { showMessage } = useMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: BioItemUpdateInput }) =>
      bioService.updateItem(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bio.page() });
      revalidatePublicBio(
        queryClient.getQueryData<BioPage>(queryKeys.bio.page()),
      );
    },
    onError: () => {
      showMessage({
        message: t("items.errors.updateGeneric"),
        variant: "error",
      });
    },
  });
}

/**
 * Mutation: permanently remove an item from the page.
 *
 * @endpoint `DELETE /api/bio/items/{id}` (via `bioService.removeItem()`)
 * @invalidates `queryKeys.bio.page()`
 */
export function useRemoveBioItem() {
  const { showMessage } = useMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bioService.removeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bio.page() });
      revalidatePublicBio(
        queryClient.getQueryData<BioPage>(queryKeys.bio.page()),
      );
    },
    onError: () => {
      showMessage({
        message: t("items.errors.removeGeneric"),
        variant: "error",
      });
    },
  });
}

/**
 * Mutation: persist a new item order after an up/down move.
 *
 * @endpoint `PUT /api/bio/items-order` (via `bioService.reorderItems()`)
 *
 * @remarks
 * Optimistic: `onMutate` reorders `queryKeys.bio.page()` in the cache
 * immediately (so the up/down buttons feel instant instead of waiting on a
 * round trip), snapshotting the previous value for rollback. `onError`
 * restores that snapshot and shows a toast; `onSettled` always refetches so
 * the cache reconciles with the server's canonical order either way.
 */
export function useReorderBioItems() {
  const { showMessage } = useMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => bioService.reorderItems(ids),
    onMutate: async (ids: number[]) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.bio.page() });
      const previous = queryClient.getQueryData<BioPage | null>(
        queryKeys.bio.page(),
      );

      if (previous) {
        const byId = new Map(previous.items.map((item) => [item.id, item]));
        const reordered = ids.reduce<BioItem[]>((acc, id, index) => {
          const item = byId.get(id);
          if (item) acc.push({ ...item, position: index });
          return acc;
        }, []);
        queryClient.setQueryData(queryKeys.bio.page(), {
          ...previous,
          items: reordered,
        });
      }

      return { previous };
    },
    onError: (_error, _ids, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKeys.bio.page(), context.previous);
      }
      showMessage({
        message: t("items.errors.reorderGeneric"),
        variant: "error",
      });
    },
    onSuccess: () => {
      revalidatePublicBio(
        queryClient.getQueryData<BioPage>(queryKeys.bio.page()),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bio.page() });
    },
  });
}
