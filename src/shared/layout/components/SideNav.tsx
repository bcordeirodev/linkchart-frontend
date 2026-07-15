"use client";
/**
 * Barra lateral fixa e colapsável — navegação primária no desktop.
 *
 * Vive entre o `Navbar` (AppBar fixo) e o `Footer` no `MainLayout`, como um
 * irmão flex não-rolável ao lado de `<main>`: como o contêiner da linha não
 * tem scroll próprio, a barra permanece parada enquanto o conteúdo rola, sem
 * exigir `position: fixed`/`sticky` nem cálculo manual de z-index — e por
 * construção nunca sobrepõe o header (a linha começa abaixo dele) nem o
 * footer (a linha termina antes dele, como irmãos empilhados no flex column
 * do `MainLayout`).
 */

import { useCallback, useEffect, useState } from "react";

import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/lib/auth/AuthContext";
import { darkNeutral, lightNeutral } from "@/lib/theme/colors";
import { motionTokens, radiusTokens } from "@/lib/theme/designSystem";
import { useNavigate, usePathname } from "@/shared/hooks";
import { AppIcon } from "@/shared/ui/icons";

import { getVisibleNavItems } from "./navItems";

import type { Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

/** Chave de `localStorage` que persiste a preferência de colapso da sidebar. */
const SIDENAV_COLLAPSED_STORAGE_KEY = "sidenav:collapsed";

/** Largura (px) da sidebar expandida (ícone + rótulo). */
const EXPANDED_WIDTH = 240;
/** Largura (px) da sidebar colapsada (apenas ícones). */
const COLLAPSED_WIDTH = 72;

/** Paleta de cor de uma linha da sidebar. */
type SideNavRowTone = "default" | "danger" | "muted";

/**
 * Lê a preferência de colapso persistida em `localStorage`.
 *
 * @returns `true` se o usuário colapsou a sidebar em uma sessão anterior;
 * `false` (padrão expandido) em SSR ou na primeira visita — garante que o
 * primeiro paint no cliente bata com o HTML gerado no servidor, evitando
 * mismatch de hidratação.
 */
function readStoredCollapsedState(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(SIDENAV_COLLAPSED_STORAGE_KEY) === "true";
}

/**
 * Persiste a preferência de colapso em `localStorage`.
 *
 * @param collapsed - novo estado de colapso a ser salvo.
 */
function persistCollapsedState(collapsed: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(SIDENAV_COLLAPSED_STORAGE_KEY, String(collapsed));
}

/**
 * Calcula o `sx` de uma linha da sidebar conforme seu `tone` e estado ativo.
 *
 * Todas as linhas reservam 3px de `borderLeft` transparente (mesmo as que
 * nunca ficam "ativas", como Sair e o toggle de colapso) para que o ícone
 * fique sempre alinhado no mesmo x, independente do tone — só a cor do
 * indicador muda. Itens `default` ativos ganham a barra esquerda + fundo
 * tintado na cor primária (o mesmo idioma do sublinhado ativo do `Navbar`
 * horizontal, adaptado para orientação vertical); `danger` (Sair) e `muted`
 * (toggle) nunca participam do destaque de rota ativa.
 *
 * @param theme - tema MUI atual (para cores e modo claro/escuro).
 * @param tone - paleta de cor da linha.
 * @param active - se a linha representa a rota atual (só relevante p/ `default`).
 * @returns objeto `sx` pronto para o `ListItemButton`.
 */
function getSideNavRowSx(theme: Theme, tone: SideNavRowTone, active: boolean) {
  const isDark = theme.palette.mode === "dark";
  const base = {
    borderLeft: "3px solid transparent",
  };

  if (tone === "danger") {
    return {
      ...base,
      color: theme.palette.error.main,
      "&:hover": { backgroundColor: theme.palette.action.hover },
    };
  }

  if (tone === "muted") {
    return {
      ...base,
      color: theme.palette.text.secondary,
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.text.primary,
      },
    };
  }

  return {
    ...base,
    borderLeftColor: active ? theme.palette.primary.main : "transparent",
    backgroundColor: active
      ? alpha(theme.palette.primary.main, isDark ? 0.16 : 0.1)
      : "transparent",
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    fontWeight: active ? 600 : 500,
    "&:hover": {
      backgroundColor: active
        ? alpha(theme.palette.primary.main, isDark ? 0.22 : 0.16)
        : theme.palette.action.hover,
    },
  };
}

interface SideNavRowProps {
  /** Ícone já renderizado (`<AppIcon .../>`) — decidido pelo chamador. */
  icon: ReactNode;
  /** Rótulo visível quando expandida; vira `title` do `Tooltip` quando colapsada. */
  label: string;
  /** Estado atual de colapso da sidebar (controla ícone-only vs ícone+rótulo). */
  collapsed: boolean;
  /** Se esta linha representa a rota atual (destaque visual, tone `default`). */
  active?: boolean;
  /** Paleta de cor da linha. @defaultValue "default" */
  tone?: SideNavRowTone;
  onClick: () => void;
}

/**
 * Uma linha da sidebar (item de navegação, Perfil, Sair ou o toggle de
 * colapso). Sempre mostra o ícone; o rótulo só é renderizado como texto
 * quando a sidebar está expandida — quando colapsada, o rótulo vira o
 * `title` de um `Tooltip` para a linha continuar identificável ao passar o
 * mouse, e um `aria-label` garante o nome acessível do botão nos dois modos.
 */
function SideNavRow({
  icon,
  label,
  collapsed,
  active = false,
  tone = "default",
  onClick,
}: SideNavRowProps) {
  const theme = useTheme();

  const button = (
    <ListItemButton
      onClick={onClick}
      aria-label={label}
      aria-current={
        tone === "default" && active ? ("page" as const) : undefined
      }
      sx={{
        mx: 1,
        px: collapsed ? 1.5 : 2,
        py: 1.25,
        borderRadius: `${radiusTokens.sm}px`,
        justifyContent: collapsed ? "center" : "flex-start",
        transition: ["background-color", "color", "border-color"]
          .map(
            (prop) =>
              `${prop} ${motionTokens.duration.base} ${motionTokens.easing.default}`,
          )
          .join(", "),
        ...getSideNavRowSx(theme, tone, active),
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: collapsed ? 0 : 36,
          color: "inherit",
          justifyContent: "center",
        }}
      >
        {icon}
      </ListItemIcon>
      {collapsed ? null : (
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            fontSize: "0.875rem",
            fontWeight: "inherit",
            noWrap: true,
          }}
        />
      )}
    </ListItemButton>
  );

  if (!collapsed) {
    return button;
  }

  return (
    <Tooltip title={label} placement="right" arrow>
      {button}
    </Tooltip>
  );
}

/**
 * Sidebar fixa e colapsável de navegação primária, visível apenas em telas
 * `md+` (o mobile continua usando o hambúrguer + Drawer do `Navbar`, sem
 * nenhuma alteração).
 *
 * Renderiza os destinos de `getVisibleNavItems()` no topo, e Perfil/Sair no
 * rodapé — reaproveitando a mesma navegação e o mesmo logout do `Navbar`. Um
 * botão de colapso ao final alterna entre o modo completo (ícone + rótulo) e
 * o modo apenas-ícones (com tooltip ao passar o mouse), persistindo a
 * escolha em `localStorage` (`sidenav:collapsed`) para sobreviver a reloads.
 *
 * @returns o elemento da sidebar, ou `null` enquanto não há usuário
 * autenticado (mesmo guard usado pela navegação do `Navbar`).
 */
export function SideNav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useTranslation("common");

  const [collapsed, setCollapsed] = useState(false);
  const isDark = theme.palette.mode === "dark";
  const navItems = getVisibleNavItems();
  const isProfileActive = pathname?.startsWith("/profile") ?? false;

  // Lê a preferência persistida só no efeito (não no estado inicial) para
  // que o primeiro render no cliente bata com o SSR (sempre expandido).
  useEffect(() => {
    setCollapsed(readStoredCollapsedState());
  }, []);

  /** Alterna o colapso da sidebar e persiste a escolha em `localStorage`. */
  const toggleCollapsed = useCallback(() => {
    setCollapsed((previous) => {
      const next = !previous;
      persistCollapsedState(next);
      return next;
    });
  }, []);

  /** Efetua logout a partir da sidebar (mesma ação do menu do `Navbar`). */
  const handleLogout = useCallback(() => {
    void logout();
  }, [logout]);

  if (!user) {
    return null;
  }

  return (
    <Box
      component="nav"
      aria-label={t("nav.sidebarAriaLabel")}
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        flexShrink: 0,
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: isDark ? darkNeutral.surface : lightNeutral.surface,
        borderRight: `1px solid ${theme.palette.divider}`,
        transition: `width ${motionTokens.duration.slow} ${motionTokens.easing.default}`,
      }}
    >
      <List sx={{ py: 1, flexGrow: 1 }}>
        {navItems.map((item) => (
          <SideNavRow
            key={item.key}
            label={t(`nav.${item.key}`)}
            icon={<AppIcon intent={item.icon} size={20} />}
            collapsed={collapsed}
            active={pathname?.startsWith(item.route) ?? false}
            onClick={() => navigate(item.route)}
          />
        ))}
      </List>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      <List sx={{ py: 1 }}>
        <SideNavRow
          label={t("nav.profile")}
          icon={<AppIcon intent="profile" size={20} />}
          collapsed={collapsed}
          active={isProfileActive}
          onClick={() => navigate("/profile")}
        />
        <SideNavRow
          label={t("nav.signOut")}
          icon={<AppIcon intent="logout" size={20} color="currentColor" />}
          collapsed={collapsed}
          tone="danger"
          onClick={handleLogout}
        />
      </List>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      <List sx={{ py: 1 }}>
        <SideNavRow
          label={collapsed ? t("nav.expandSidebar") : t("nav.collapseSidebar")}
          icon={
            <AppIcon
              name={collapsed ? "navigation.next" : "navigation.prev"}
              size={20}
            />
          }
          collapsed={collapsed}
          tone="muted"
          onClick={toggleCollapsed}
        />
      </List>
    </Box>
  );
}

export default SideNav;
