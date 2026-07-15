"use client";

import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useMessage } from "@/lib/providers/MessageProvider";
import { queryKeys } from "@/lib/query/keys";
import { linkService } from "@/services";
import { i18n } from "@/lib/i18n";

import type {
  LinkBulkAction,
  LinkBulkActionResult,
} from "@/features/links/types/link";

/** Max ids per bulk-action request — mirrors the backend's own cap (422 above this). */
export const BULK_ACTION_MAX_IDS = 50;

type BulkAction = LinkBulkAction["action"];

/** i18n key (under the `links` namespace) for each action's success toast. */
const SUCCESS_KEY: Record<BulkAction, string> = {
  activate: "bulk.successActivate",
  deactivate: "bulk.successDeactivate",
  delete: "bulk.successDelete",
};

/**
 * Translates a `links`-namespaced key outside of a component render — same
 * pattern `useLinks.ts` already uses for its mutation error toasts, needed
 * here because `onSuccess`/`onError` run outside React's render cycle.
 */
function translate(key: string, options: Record<string, unknown> = {}): string {
  return (i18n.t as (key: string, opts: object) => string)(key, {
    ns: "links",
    ...options,
  });
}

/**
 * Multi-select state + bulk activate/deactivate/delete mutation for the links
 * browse list.
 *
 * @returns `{selectedIds, toggle, clear, selectAllVisible, run, isRunning, isMaxReached}`.
 *
 * @remarks
 * `run(action)` invalidates `queryKeys.links.all()` on success — the same
 * `["links"]` prefix `useCreateLink`/`useUpdateLink`/`useDeleteLink` already
 * invalidate — so both the server-paginated browse list (`useLinksSearch`)
 * and the legacy full-list `useLinks()` (overview metrics, demo seeding)
 * refetch. The selection is cleared after a *successful* run; a failed run
 * leaves it intact so the user can retry without reselecting.
 *
 * Ids beyond `BULK_ACTION_MAX_IDS` are silently dropped by `toggle`/
 * `selectAllVisible` (mirrors the backend's own 50-id cap) — callers should
 * surface `isMaxReached` to disable further selection in the UI.
 */
export function useBulkActions() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { showMessage } = useMessage();

  const clear = useCallback(() => setSelectedIds([]), []);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((existing) => existing !== id);
      }
      if (prev.length >= BULK_ACTION_MAX_IDS) {
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const selectAllVisible = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const merged = new Set(prev);
      for (const id of ids) {
        if (merged.size >= BULK_ACTION_MAX_IDS) {
          break;
        }
        merged.add(id);
      }
      return Array.from(merged);
    });
  }, []);

  const mutation = useMutation<LinkBulkActionResult, unknown, BulkAction>({
    mutationFn: (action) =>
      linkService.bulkAction(action, selectedIds.map(Number)),
    onSuccess: (result, action) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all() });
      clear();

      if (result.affected < result.requested) {
        showMessage({
          message: translate("bulk.partial"),
          variant: "warning",
        });
        return;
      }

      showMessage({
        message: translate(SUCCESS_KEY[action], { count: result.affected }),
        variant: "success",
      });
    },
    onError: () => {
      showMessage({ message: translate("bulk.error"), variant: "error" });
    },
  });

  const run = useCallback(
    (action: BulkAction) => mutation.mutateAsync(action),
    [mutation],
  );

  return {
    selectedIds,
    toggle,
    clear,
    selectAllVisible,
    run,
    isRunning: mutation.isPending,
    isMaxReached: selectedIds.length >= BULK_ACTION_MAX_IDS,
  };
}

export default useBulkActions;
