/**
 * 🔄 AUTH UTILS - LINK CHART
 * Utilitários de autenticação e permissões
 *
 * @description
 * Utilitários essenciais para verificação de permissões de usuário.
 * Simplificado para manter apenas as funções realmente utilizadas.
 *
 * @since 2.0.0
 */

import type { User } from "@/types";

/**
 * Classe de utilitários de autenticação
 */
class FuseUtils {
  /**
   * Verifica se o usuário tem permissão baseado nos roles
   * @param authArr - Array de roles necessários ou null para acesso livre
   * @param userRole - Role do usuário atual
   * @returns true se o usuário tem permissão
   */
  static hasPermission(
    authArr: string[] | string | null | undefined,
    userRole: User["role"],
  ): boolean {
    // Se authArr é null ou undefined, acesso livre
    if (authArr === null || authArr === undefined) {
      return true;
    }

    // Se authArr é array vazio, apenas usuários sem role podem acessar
    if (Array.isArray(authArr) && authArr?.length === 0) {
      return !userRole || userRole.length === 0;
    }

    // Se userRole é array e authArr é array, verifica interseção
    if (userRole && Array.isArray(authArr) && Array.isArray(userRole)) {
      return authArr.some((r: string) => userRole.indexOf(r) >= 0);
    }

    // Se userRole é string e authArr é array, verifica se inclui
    if (typeof userRole === "string" && Array.isArray(authArr)) {
      return authArr?.includes?.(userRole);
    }

    return false;
  }
}

export default FuseUtils;
