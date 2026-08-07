"use client";
/**
 * Barra lateral de altura total — navegação primária no desktop.
 *
 * Vive como irmão do bloco `Navbar + <main> + Footer` no `MainLayout`, os
 * dois como colunas de uma linha flex que ocupa `100dvh`: por isso a sidebar
 * se estende do topo ao fundo do viewport (não apenas entre header e
 * footer), sem exigir `position: fixed`/`sticky` nem cálculo manual de
 * z-index. Header e footer nunca ficam por baixo dela porque vivem na coluna
 * irmã, à direita.
 *
 * O colapso (ícone+rótulo vs. apenas ícones) é controlado externamente pelo
 * `MainLayout` via prop `collapsed` — o botão que alterna esse estado agora
 * mora no `Navbar` (ícone de hambúrguer no header), não mais aqui dentro.
 */

import { useCallback } from "react";

import {
  Box,
  Button,
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
import { motionTokens, radiusTokens } from "@/lib/theme/designSystem";
import { useNavigate, usePathname } from "@/shared/hooks";
import { AppLogo } from "@/shared/ui/base";
import { AppIcon } from "@/shared/ui/icons";

import { getVisibleNavItems, normalizeUserRoles } from "./navItems";

import type { Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

/** Largura (px) da sidebar expandida (ícone + rótulo). */
const EXPANDED_WIDTH = 280;
/** Largura (px) da sidebar colapsada (apenas ícones). */
const COLLAPSED_WIDTH = 72;

/** Paleta de cor de uma linha da sidebar. */
type SideNavRowTone = "default" | "danger";

/**
 * Indica se `route` é a rota atual, respeitando a fronteira de segmento.
 *
 * Usa a mesma regra do `middleware.ts` (`pathname === route` ou começa com
 * `${route}/`) para não marcar `/reports` como ativo em `/reports-export`.
 *
 * @param pathname - caminho atual (`usePathname()`), possivelmente nulo.
 * @param route - rota do item de navegação.
 * @returns `true` se o item representa a rota atual.
 */
function isRouteActive(pathname: string | null, route: string): boolean {
  if (!pathname) {
    return false;
  }
  return pathname === route || pathname.startsWith(`${route}/`);
}

/**
 * Calcula o `sx` de uma linha da sidebar conforme seu `tone` e estado ativo.
 *
 * Sem indicador de borda esquerda: o destaque de hover/foco/ativo é uma
 * pílula arredondada recuada das bordas da sidebar (mesma linguagem do
 * tema de referência) — só o fundo e o peso da fonte distinguem o estado.
 * `danger` (Sair) nunca participa do destaque de rota ativa.
 *
 * @param theme - tema MUI atual (para cores e modo claro/escuro).
 * @param tone - paleta de cor da linha.
 * @param active - se a linha representa a rota atual (só relevante p/ `default`).
 * @returns objeto `sx` pronto para o `ListItemButton`.
 */
function getSideNavRowSx(theme: Theme, tone: SideNavRowTone, active: boolean) {
  const isDark = theme.palette.mode === "dark";

  if (tone === "danger") {
    return {
      color: theme.palette.error.main,
      "&:hover": { backgroundColor: theme.palette.action.hover },
    };
  }

  // Destaque do item ativo é uma tinta sutil da cor de marca (não mais um
  // cinza neutro): o rótulo continua legível/neutro (text.primary, peso 600)
  // — só o fundo da pílula carrega a cor. Inativo fica transparente; hover
  // usa o `action.hover` padrão do MUI para não competir com o tom ativo.
  return {
    backgroundColor: active
      ? alpha(theme.palette.primary.main, isDark ? 0.16 : 0.1)
      : "transparent",
    color: active ? theme.palette.text.primary : theme.palette.text.secondary,
    fontWeight: active ? 600 : 500,
    "&:hover": {
      backgroundColor: active
        ? alpha(theme.palette.primary.main, isDark ? 0.22 : 0.16)
        : theme.palette.action.hover,
      color: theme.palette.text.primary,
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
 * Uma linha da sidebar (item de navegação, Perfil ou Sair). Sempre mostra o
 * ícone; o rótulo só é renderizado como texto quando a sidebar está
 * expandida — quando colapsada, o rótulo vira o `title` de um `Tooltip`
 * para a linha continuar identificável ao passar o mouse, e um
 * `aria-label` garante o nome acessível do botão nos dois modos.
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
        // Métricas da pílula (referência Fuse): linha de 40px de altura fixa,
        // recuada 12px das bordas da sidebar, raio 8px e 4px de respiro entre
        // linhas — o realce nunca encosta nas bordas.
        mx: 1.5,
        mb: 0.5,
        px: 1.5,
        py: 0,
        minHeight: 40,
        borderRadius: `${radiusTokens.md}px`,
        justifyContent: collapsed ? "center" : "flex-start",
        transition: ["background-color", "color"]
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
            fontSize: "0.8125rem",
            fontWeight: "inherit",
            lineHeight: 1.5,
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

interface SideNavProps {
  /**
   * Estado de colapso controlado pelo `MainLayout` (persistido em
   * `localStorage` por ele). A sidebar em si não guarda esse estado.
   */
  collapsed: boolean;
}

/**
 * Sidebar de altura total e navegação primária, visível apenas em telas
 * `md+` (o mobile continua usando o hambúrguer + Drawer do `Navbar`, sem
 * nenhuma alteração).
 *
 * Renderiza uma linha de marca (logo, navega para `/links`) no topo, os
 * destinos de `getVisibleNavItems()` em seguida, e Perfil/Sair no rodapé —
 * reaproveitando a mesma navegação e o mesmo logout do `Navbar`. O colapso
 * (ícone + rótulo vs. apenas ícones) é 100% controlado pelo pai via prop
 * `collapsed`; o botão que alterna esse estado vive no `Navbar`.
 *
 * @param props.collapsed - se `true`, renderiza a variante apenas-ícones.
 * @returns o elemento da sidebar, ou `null` enquanto não há usuário
 * autenticado (mesmo guard usado pela navegação do `Navbar`).
 */
export function SideNav({ collapsed }: SideNavProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useTranslation("common");

  const navItems = getVisibleNavItems(normalizeUserRoles(user?.role));
  const isProfileActive = isRouteActive(pathname, "/profile");

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
        // Trava o limite superior no mesmo valor de `width`: sem isto, o item
        // ativo (pílula tintada + ícone, únicos elementos coloridos daqui)
        // podia deixar um fiapo de cor vazar 1-2px além da borda direita
        // durante a transição de largura — `overflowX: hidden` sozinho não
        // bastava porque o navegador arredonda a caixa de recorte e a de
        // pintura em frames diferentes da mesma animação. `contain: "paint"`
        // fixa a sidebar como fronteira de pintura própria: nada dela (nem um
        // resquício de borda arredondada) pode aparecer fora da sua caixa,
        // independente do frame da transição.
        maxWidth: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        contain: "paint",
        // Mesmo fundo do container — a sidebar não é uma "surface" separada;
        // só uma borda hairline a distingue do conteúdo.
        backgroundColor: theme.palette.background.default,
        borderRight: `1px solid ${theme.palette.divider}`,
        transition: `width ${motionTokens.duration.slow} ${motionTokens.easing.default}`,
      }}
    >
      {/* Brand row — mesma altura do Toolbar do Navbar (64/72px) para que a
          borda inferior continue a borda do header na linha do meio. */}
      <Box
        component="button"
        type="button"
        onClick={() => navigate("/links")}
        aria-label={t("nav.logoAriaLabel")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          flexShrink: 0,
          // +1px vs. o header por design: o AppBar tem altura automática e soma
          // a borda POR FORA (Toolbar minHeight + 1), enquanto esta linha usa
          // minHeight + border-box (borda POR DENTRO). Igualar o minHeight ao
          // Toolbar deixaria a borda 1px acima — daí Toolbar+1 aqui (64→65,
          // 60→61), para as duas bordas caírem exatamente na mesma linha.
          minHeight: { xs: 65, md: 61 },
          px: collapsed ? 1.5 : 2.5,
          border: "none",
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: "none",
          cursor: "pointer",
          font: "inherit",
          color: "inherit",
          textAlign: "left",
        }}
      >
        <AppLogo
          size={28}
          showText={!collapsed}
          textSx={{ fontSize: "1rem", color: theme.palette.text.primary }}
        />
      </Box>

      {/* CTA primária — ação principal do app (encurtar URL). Leva direto ao
          formulário de criação; colapsa para só o ícone "+" com tooltip
          quando a sidebar está recolhida. */}
      <Box sx={{ px: 1.5, pt: 1.5, pb: 0.5 }}>
        <Tooltip
          title={t("nav.shortenUrl")}
          placement="right"
          arrow
          disableHoverListener={!collapsed}
        >
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => navigate("/links/create")}
            aria-label={t("nav.shortenUrl")}
            startIcon={
              collapsed ? undefined : <AppIcon intent="create" size={18} />
            }
            sx={{
              width: "100%",
              minWidth: 0,
              py: 0.9,
              px: collapsed ? 0 : 2,
              borderRadius: `${radiusTokens.md}px`,
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.01em",
              boxShadow: "none",
              justifyContent: "center",
              "& .MuiButton-startIcon": { mr: 0.75 },
            }}
          >
            {collapsed ? (
              <AppIcon intent="create" size={20} />
            ) : (
              t("nav.shortenUrl")
            )}
          </Button>
        </Tooltip>
      </Box>

      <List sx={{ py: 1, flexGrow: 1 }}>
        {navItems.map((item) => (
          <SideNavRow
            key={item.key}
            label={t(`nav.${item.key}`)}
            icon={<AppIcon intent={item.icon} size={20} />}
            collapsed={collapsed}
            active={isRouteActive(pathname, item.route)}
            onClick={() => navigate(item.route)}
          />
        ))}
      </List>

      <Divider />

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
    </Box>
  );
}

export default SideNav;
