import type { IconIntent } from "@/shared/ui/icons";

/**
 * Chaves i18n válidas em `common:nav.<key>` para os itens de navegação
 * principal. Mantida como união literal (em vez de `string`) para que
 * `` t(`nav.${key}`) `` continue type-checked pelo i18next tipado.
 */
export type NavItemKey = "myLinks" | "reports" | "subdomains";

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
}

/**
 * Fonte única de verdade dos itens de navegação principal.
 * Renderizada no AppBar (desktop) e no Drawer (mobile) — ver `Navbar.tsx`.
 */
const NAV_ITEMS: NavItem[] = [
  { key: "myLinks", route: "/links", icon: "link" },
  { key: "reports", route: "/reports", icon: "reports" },
  {
    key: "subdomains",
    route: "/subdomains",
    icon: "subdomain",
    flag: "subdomains",
  },
];

/**
 * Retorna os itens de navegação visíveis, filtrando por feature flags.
 * Subdomínios segue a mesma flag usada em `ProfilePage`
 * (`NEXT_PUBLIC_SUBDOMAINS_ENABLED`).
 */
export function getVisibleNavItems(): NavItem[] {
  return NAV_ITEMS.filter(
    (item) =>
      item.flag !== "subdomains" ||
      process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true",
  );
}
