"use client";
/**
 * Componente de navegação principal — POV sóbrio (SP2)
 *
 * `position: "static"`: o header vive na coluna à direita da sidebar dentro
 * do `MainLayout` (linha flex `[SideNav | coluna direita]`), não mais
 * flutuando com `position: fixed` sobre a página inteira — por isso ocupa
 * espaço normal no fluxo da coluna, sem precisar de padding-top compensando
 * a altura do Toolbar em nenhum outro lugar. No desktop (`md+`) o logo some
 * daqui (mora na sidebar) e um botão de hambúrguer alterna o colapso da
 * sidebar; no mobile nada muda — logo + hambúrguer abrindo o Drawer.
 *
 * **Todo gate de mobile-vs-desktop aqui é só CSS** (`sx={{ display: {xs,
 * md} }}`), nunca `useMediaQuery`/`useResponsive()` escolhendo qual JSX
 * renderizar — ver o gate visual de 2026-08-03 (item 2): o botão da
 * DIREITA (avatar/menu vs. hambúrguer/Drawer) usava `isMobile` de
 * `useResponsive()` para decidir qual dos dois renderizar, e esse hook não
 * tem `noSsr`/`ssrMatchMedia` configurado em lugar nenhum do app — o valor
 * inicial é sempre `false` no server E no primeiro paint do cliente,
 * então todo mundo via o gatilho de DESKTOP (avatar) por um instante,
 * mesmo no celular, até o listener real do `matchMedia` assentar e trocar
 * para o hambúrguer — o "menu renderizando 2x" que o Bruno viu. Os dois
 * botões agora sempre existem no DOM (server e cliente concordam desde o
 * primeiro frame) e a CSS escolhe qual aparece, o mesmo padrão que o
 * logo/botão de colapso abaixo já usava.
 */

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Drawer,
  List,
  ListItemButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "@/shared/hooks";
import { Menu as MenuIcon, Moon, Sun } from "lucide-react";

import { useTranslation } from "react-i18next";

import { useAuth } from "@/lib/auth/AuthContext";
import { motionTokens, radiusTokens } from "@/lib/theme/designSystem";
import { AppIcon } from "@/shared/ui/icons";
import { AppLogo } from "@/shared/ui/base";
import { LanguageSelector } from "@/lib/i18n/components/LanguageSelector";
import { useAppThemeMode } from "@/shared/layout/AppThemeScope";

import { getVisibleNavItems, normalizeUserRoles } from "./navItems";

interface NavbarProps {
  /** Estado de colapso da sidebar desktop, controlado pelo `MainLayout`. */
  collapsed: boolean;
  /**
   * Alterna o colapso da sidebar desktop. Acionado pelo ícone de hambúrguer
   * renderizado aqui (visível só em `md+`); a própria sidebar não tem mais
   * botão de colapso interno.
   */
  onToggleSidebar: () => void;
}

export function Navbar({ collapsed, onToggleSidebar }: NavbarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { t } = useTranslation("common");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const navItems = getVisibleNavItems(normalizeUserRoles(user?.role));
  const themeMode = useAppThemeMode();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          // Header compartilha o fundo do container principal — sem "surface"
          // própria — para que sidebar, header, conteúdo e footer leiam como
          // uma única superfície. Separação só por uma borda hairline.
          backgroundColor: theme.palette.background.default,
          backgroundImage: "none",
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
          color: theme.palette.text.primary,
          transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: 1,
            minHeight: { xs: 64, md: 60 },
            // Split: à ESQUERDA só o ícone ☰ (desktop) / logo (mobile); à
            // DIREITA idioma + avatar.
            justifyContent: "space-between",
          }}
        >
          {/* ESQUERDA — só o ícone ☰ no desktop; no mobile, o logo. */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Logo — só mobile (no desktop a marca mora na sidebar). */}
            <Box
              component="button"
              type="button"
              onClick={() => navigate("/links")}
              aria-label={t("nav.logoAriaLabel")}
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                cursor: "pointer",
                gap: 1.5,
                p: 0,
                border: "none",
                background: "none",
                font: "inherit",
                color: "inherit",
                textAlign: "left",
              }}
            >
              <AppLogo size={36} showText={false} />
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: "1.125rem",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.2,
                  }}
                >
                  Link Charts
                </Typography>
                <Typography
                  variant="caption"
                  suppressHydrationWarning
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {t("appTagline")}
                </Typography>
              </Box>
            </Box>
            {/* Toggle ☰ da sidebar — só desktop (md+); no mobile a navegação
                é o Drawer aberto pelo hambúrguer à direita. */}
            {user ? (
              <Tooltip
                title={
                  collapsed ? t("nav.expandSidebar") : t("nav.collapseSidebar")
                }
                arrow
              >
                <IconButton
                  aria-label={
                    collapsed
                      ? t("nav.expandSidebar")
                      : t("nav.collapseSidebar")
                  }
                  onClick={onToggleSidebar}
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                    width: 44,
                    height: 44,
                    borderRadius: `${radiusTokens.md}px`,
                    transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <MenuIcon size={20} strokeWidth={1.5} />
                </IconButton>
              </Tooltip>
            ) : null}
          </Box>

          {/* DIREITA — idioma + avatar (desktop) / hambúrguer (mobile).
              Os dois botões ficam sempre no DOM; só a `display` responsiva
              decide qual aparece — nenhuma escolha em JS/`useMediaQuery`
              (ver o comentário no topo do arquivo). No mobile o Drawer é a
              única superfície de navegação (identidade + links + sair vivem
              lá), por isso o avatar-menu fica oculto (não removido) nessa
              faixa — evita uma segunda superfície de navegação redundante
              sem reintroduzir o problema de renderização condicional. */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user ? (
              <>
                {/* Toggle de tema — visível em mobile e desktop; só existe dentro do
                    AppThemeScope (área logada), fora dele o hook retorna null. O ícone
                    mostra o modo de DESTINO: sol no dark, lua no light. */}
                {themeMode ? (
                  <Tooltip
                    title={
                      themeMode.mode === "dark"
                        ? t("nav.switchToLight")
                        : t("nav.switchToDark")
                    }
                    arrow
                  >
                    <IconButton
                      data-testid="theme-toggle"
                      aria-label={
                        themeMode.mode === "dark"
                          ? t("nav.switchToLight")
                          : t("nav.switchToDark")
                      }
                      onClick={themeMode.toggleMode}
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: `${radiusTokens.md}px`,
                        transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      {themeMode.mode === "dark" ? (
                        <Sun size={20} strokeWidth={1.5} />
                      ) : (
                        <Moon size={20} strokeWidth={1.5} />
                      )}
                    </IconButton>
                  </Tooltip>
                ) : null}
                <LanguageSelector />
                <IconButton
                  aria-label={t("nav.openNavAriaLabel", "open navigation")}
                  onClick={() => setDrawerOpen(true)}
                  edge="end"
                  sx={{
                    display: { xs: "inline-flex", md: "none" },
                    width: 44,
                    height: 44,
                  }}
                >
                  <MenuIcon size={20} strokeWidth={1.5} />
                </IconButton>
                <Tooltip
                  title={t("nav.menuTooltip", { name: user.displayName })}
                  arrow
                >
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label={t("nav.accountMenuAriaLabel")}
                    onClick={handleProfileMenuOpen}
                    sx={{
                      display: { xs: "none", md: "inline-flex" },
                      width: 44,
                      height: 44,
                      borderRadius: `${radiusTokens.md}px`,
                      transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <Avatar
                      src={user.photoURL}
                      alt={user.displayName ?? ""}
                      aria-label={t("nav.avatarAriaLabel", {
                        name: user.displayName,
                      })}
                      sx={{
                        width: 36,
                        height: 36,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {user.displayName?.charAt(0).toUpperCase() ?? "U"}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </>
            ) : null}
          </Box>

          {/* User Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 280,
                borderRadius: `${radiusTokens.md}px`,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[4],
                overflow: "visible",
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  borderTop: `1px solid ${theme.palette.divider}`,
                  borderLeft: `1px solid ${theme.palette.divider}`,
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            {/* User Info Header */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={user?.photoURL}
                  alt={user?.displayName ?? ""}
                  aria-label={t("nav.avatarAriaLabel", {
                    name: user?.displayName,
                  })}
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  {user?.displayName?.charAt(0).toUpperCase() ?? "U"}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user?.displayName ?? "User"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Menu Items */}
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/profile");
              }}
              sx={{
                py: 1.5,
                px: 3,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <AppIcon intent="profile" size={20} />
              </ListItemIcon>
              <ListItemText
                primary={t("nav.profile")}
                secondary={t("nav.profileDesc")}
              />
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.5,
                px: 3,
                color: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <AppIcon
                  intent="logout"
                  size={20}
                  color={theme.palette.error.main}
                />
              </ListItemIcon>
              <ListItemText
                primary={t("nav.signOut")}
                secondary={t("nav.signOutDesc")}
              />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <AppLogo
            size={28}
            textSx={{ fontSize: "1rem", color: theme.palette.text.primary }}
          />
        </Box>

        {user ? (
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Avatar
              src={user.photoURL}
              alt={user.displayName ?? ""}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {user.displayName?.charAt(0).toUpperCase() ?? "U"}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={600} noWrap>
                {user.displayName ?? "User"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ display: "block" }}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>
        ) : null}

        <List sx={{ py: 1 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.key}
              onClick={() => {
                navigate(item.route);
                setDrawerOpen(false);
              }}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: `${radiusTokens.md}px`,
                mx: 1,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <AppIcon intent={item.icon} size={20} />
              </ListItemIcon>
              <ListItemText primary={t(`nav.${item.key}`)} />
            </ListItemButton>
          ))}

          <ListItemButton
            onClick={() => {
              navigate("/profile");
              setDrawerOpen(false);
            }}
            sx={{ px: 3, py: 1.5, borderRadius: `${radiusTokens.md}px`, mx: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AppIcon intent="profile" size={20} />
            </ListItemIcon>
            <ListItemText primary={t("nav.profile")} />
          </ListItemButton>

          <Divider sx={{ my: 1 }} />

          <ListItemButton
            onClick={() => {
              setDrawerOpen(false);
              void logout();
            }}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: `${radiusTokens.md}px`,
              mx: 1,
              color: "error.main",
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AppIcon intent="logout" size={20} color="currentColor" />
            </ListItemIcon>
            <ListItemText primary={t("nav.signOut")} />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
