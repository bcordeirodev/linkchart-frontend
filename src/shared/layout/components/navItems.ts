import type { IconIntent } from "@/shared/ui/icons";

/**
 * Chaves i18n válidas em `common:nav.<key>` para os itens de navegação
 * principal. Mantida como união literal (em vez de `string`) para que
 * `` t(`nav.${key}`) `` continue type-checked pelo i18next tipado.
 */
export type NavItemKey =
  | "myLinks"
  | "bio"
  | "reports"
  | "subdomains"
  | "apiKeys"
  | "admin";

/**
 * Item de navegação principal, renderizado tanto no AppBar (desktop) quanto
 * no Drawer (mobile) do `Navbar`.
 *
 * `key` é a chave i18n em `common:nav.<key>` (label) e `common:nav.<key>Desc`
 * (descrição, usada nas páginas scaffold). `icon` é o intent do `AppIcon`.
 */
export interface NavItem {
  key: NavItemKey;
  route: string;
  icon: IconIntent;
  /** Item só aparece se a feature flag correspondente estiver ativa. */
  flag?: "subdomains";
  /** Item só aparece se o papel do usuário incluir este role. */
  requiresRole?: "admin";
}

/**
 * Fonte única de verdade dos itens de navegação principal.
 * Renderizada no AppBar (desktop) e no Drawer (mobile) — ver `Navbar.tsx`.
 */
const NAV_ITEMS: NavItem[] = [
  { key: "myLinks", route: "/links", icon: "link" },
  { key: "bio", route: "/bio", icon: "bio" },
  { key: "reports", route: "/reports", icon: "reports" },
  {
    key: "subdomains",
    route: "/subdomains",
    icon: "subdomain",
    flag: "subdomains",
  },
  { key: "apiKeys", route: "/api-keys", icon: "apiKeys" },
  { key: "admin", route: "/admin", icon: "admin", requiresRole: "admin" },
];

/**
 * Retorna os itens de navegação visíveis, filtrando por feature flags e
 * pelo papel do usuário (itens com `requiresRole`).
 *
 * @param roles - papéis do usuário logado (`user.role`); default vazio =
 *   nenhum item privilegiado aparece.
 */
export function getVisibleNavItems(roles: readonly string[] = []): NavItem[] {
  return NAV_ITEMS.filter((item) => {
    if (
      item.flag === "subdomains" &&
      process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED !== "true"
    ) {
      return false;
    }
    if (item.requiresRole && !roles.includes(item.requiresRole)) {
      return false;
    }
    return true;
  });
}

/**
 * Normaliza `user.role` (`string[] | string | null | undefined`, conforme
 * `src/types/core/auth.ts`) para o array que {@link getVisibleNavItems}
 * espera. Compartilhada pelos dois pontos de renderização da navegação
 * (`SideNav` e `Navbar`) para não duplicar a checagem `Array.isArray`.
 *
 * @param role - valor bruto de `user.role`.
 */
export function normalizeUserRoles(
  role: string[] | string | null | undefined,
): string[] {
  if (!role) return [];
  return Array.isArray(role) ? role : [role];
}
