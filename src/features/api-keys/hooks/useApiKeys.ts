"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";
import { apiKeyService } from "@/services/api-key.service";

import { MAX_API_KEYS_PER_USER } from "../constants";

import type { ApiKeyItem, CreatedApiKey } from "../types";

/**
 * Manages the authenticated user's API keys (up to `MAX_API_KEYS_PER_USER`).
 *
 * Provides:
 * - `apiKeys` — the user's keys with masked previews, as returned by the API
 * - `isLoading` — true while fetching the initial list
 * - `create(name)` — mutation that mints a new key; resolves with the FULL
 *   token ({@link CreatedApiKey}) exactly once — the caller must show it
 *   immediately (token dialog) and let it fall out of state afterwards
 * - `revoke(id)` — mutation that revokes one key by id (irreversible)
 * - `revokingId` — id of the key currently being revoked, for per-card spinners
 * - `limitReached` — true once the account holds `MAX_API_KEYS_PER_USER` keys
 *   (hides the create form pre-emptively; the backend still enforces the real
 *   limit with a 422 on `POST /api/api-keys`)
 *
 * Cache key: `queryKeys.apiKeys.all()` — invalidated on create/revoke success
 * so the list refreshes without an extra manual round trip. The created
 * token itself is never written to the query cache: it only exists in the
 * mutation result handed to the caller.
 */
export function useApiKeys() {
  const queryClient = useQueryClient();

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: queryKeys.apiKeys.all(),
    queryFn: () => apiKeyService.list(),
    staleTime: 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (name: string): Promise<CreatedApiKey> =>
      apiKeyService.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all() });
    },
  });

  const [revokingId, setRevokingId] = useState<number | null>(null);

  const revokeMutation = useMutation({
    mutationFn: (id: number) => apiKeyService.revoke(id),
    onMutate: (id: number) => setRevokingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all() });
    },
    onSettled: () => setRevokingId(null),
  });

  return {
    apiKeys,
    isLoading,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    revoke: revokeMutation.mutateAsync,
    isRevoking: revokeMutation.isPending,
    /** id of the key currently being revoked, or null when idle. */
    revokingId,
    revokeError: revokeMutation.error,
    /** True once the account is at `MAX_API_KEYS_PER_USER` keys. */
    limitReached: apiKeys.length >= MAX_API_KEYS_PER_USER,
    maxKeys: MAX_API_KEYS_PER_USER,
  };
}

export type { ApiKeyItem, CreatedApiKey };
