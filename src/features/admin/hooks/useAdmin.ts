"use client";
/**
 * TanStack Query hooks do painel /admin — agregados globais read-only.
 * staleTime espelha o Cache::remember do backend (300s; users/health 60s):
 * refetch dentro da janela é cache hit dos dois lados.
 */

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";
import { adminService } from "@/services/admin.service";

import type {
  AdminEngagement,
  AdminHealth,
  AdminOverview,
  AdminRange,
  AdminUsersPage,
  AdminUsersParams,
} from "@/features/admin/types";
import type { UseQueryResult } from "@tanstack/react-query";

/**
 * Totais, comparação com o período anterior e séries diárias (tab Crescimento).
 *
 * @param range - janela 7d/30d/90d.
 * @remarks Endpoint: `GET /api/admin/overview`.
 */
export function useAdminOverview(
  range: AdminRange,
): UseQueryResult<AdminOverview> {
  return useQuery({
    queryKey: queryKeys.admin.overview(range),
    queryFn: () => adminService.getOverview(range),
    staleTime: 300_000,
  });
}

/**
 * Lista paginada/buscável de usuários (tab Usuários). `keepPreviousData`
 * evita flash de tabela vazia ao trocar de página/ordenar.
 *
 * @param params - paginação, busca e ordenação server-side.
 * @remarks Endpoint: `GET /api/admin/users`.
 */
export function useAdminUsers(
  params: AdminUsersParams,
): UseQueryResult<AdminUsersPage> {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () => adminService.getUsers(params),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Ativação, retorno, distribuição de links e WAU/MAU (tab Engajamento).
 *
 * @param range - janela 7d/30d/90d.
 * @remarks Endpoint: `GET /api/admin/engagement`.
 */
export function useAdminEngagement(
  range: AdminRange,
): UseQueryResult<AdminEngagement> {
  return useQuery({
    queryKey: queryKeys.admin.engagement(range),
    queryFn: () => adminService.getEngagement(range),
    staleTime: 300_000,
  });
}

/**
 * Fila, jobs falhados, saúde dos links e qualidade do tráfego (tab Saúde).
 *
 * @remarks Endpoint: `GET /api/admin/health`.
 */
export function useAdminHealth(): UseQueryResult<AdminHealth> {
  return useQuery({
    queryKey: queryKeys.admin.health(),
    queryFn: () => adminService.getHealth(),
    staleTime: 60_000,
  });
}
