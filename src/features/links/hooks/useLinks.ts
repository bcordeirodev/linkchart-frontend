"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppDispatch } from "@/lib/store/hooks";
import { showMessage } from "@/lib/store/messageSlice";
import { queryKeys } from "@/lib/query/keys";
import { API_CONFIG } from "@/lib/api/endpoints";
import { linkService } from "@/services";

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

export function useCreateLink() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LinkCreateRequestExtended) => linkService.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all() });
    },
    onError: () => {
      dispatch(
        showMessage({ message: "Erro ao criar link", variant: "error" }),
      );
    },
  });
}

export function useUpdateLink() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: LinkUpdateRequestExtended;
    }) => linkService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all() });
    },
    onError: () => {
      dispatch(
        showMessage({ message: "Erro ao atualizar link", variant: "error" }),
      );
    },
  });
}

export function useDeleteLink() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => linkService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all() });
    },
    onError: () => {
      dispatch(
        showMessage({ message: "Erro ao remover link", variant: "error" }),
      );
    },
  });
}

export function useLinkById(id: string) {
  const dispatch = useAppDispatch();

  return useQuery<LinkResponse>({
    queryKey: queryKeys.links.detail(id),
    queryFn: () => linkService.findOne(id),
    staleTime: API_CONFIG.CACHE.LINKS_TTL,
    enabled: !!id,
    throwOnError: false,
    meta: {
      onError: () => {
        dispatch(
          showMessage({ message: "Erro ao buscar link", variant: "error" }),
        );
      },
    },
  });
}
