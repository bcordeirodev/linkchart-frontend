"use client";
/**
 * Layout principal da aplicação com suporte a temas
 */
import { useCallback, useEffect, useState } from "react";

import { alpha, Box, useTheme } from "@mui/material";

import { useResponsive } from "@/lib/theme";
import { motionTokens } from "@/lib/theme/designSystem";

import { Navbar, Footer, SideNav } from "./components";

interface MainLayoutProps {
  children: React.ReactNode;
  navbar?: boolean;
  footer?: boolean;
  className?: string;
}

/** Chave de `localStorage` que persiste a preferência de colapso da sidebar. */
const SIDENAV_COLLAPSED_STORAGE_KEY = "sidenav:collapsed";

/**
 * Lê a preferência de colapso persistida em `localStorage`.
 *
 * @returns `true` se o usuário colapsou a sidebar em uma sessão anterior;
 * `false` (padrão expandido) em SSR ou na primeira visita — garante que o
 * primeiro paint no cliente bata com o HTML gerado no servidor, evitando
 * mismatch de hidratação.
 */
function readStoredSidebarCollapsed(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(SIDENAV_COLLAPSED_STORAGE_KEY) === "true";
}

/**
 * Persiste a preferência de colapso da sidebar em `localStorage`.
 *
 * @param collapsed - novo estado de colapso a ser salvo.
 */
function persistSidebarCollapsed(collapsed: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(SIDENAV_COLLAPSED_STORAGE_KEY, String(collapsed));
}

/**
 * Casca (shell) principal da aplicação autenticada.
 *
 * Estrutura: uma linha flex horizontal `[SideNav (altura total, desktop
 * `md+`) | coluna direita]`, onde a coluna direita empilha `Navbar` (header,
 * `position: static`) → `<main>` (único elemento com scroll próprio) →
 * `Footer`. A sidebar ocupa `100dvh` de topo a fundo do viewport — não fica
 * mais "sanduichada" entre header e footer — e nunca é coberta por eles
 * porque ambos vivem na coluna irmã, à direita. O botão que alterna o
 * colapso da sidebar mora no `Navbar` (ícone de hambúrguer, `md+`); este
 * componente é quem possui o estado (`collapsed`) e o persiste em
 * `localStorage`, repassando-o para `Navbar` (o botão) e `SideNav` (a
 * largura) como um componente controlado.
 */
function MainLayout({
  children,
  navbar = true,
  footer = true,
  className,
}: MainLayoutProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { isMobile } = useResponsive();
  const [collapsed, setCollapsed] = useState(false);

  const showNavbar = navbar;
  const showFooter = footer;

  // Lê a preferência persistida só no efeito (não no estado inicial) para
  // que o primeiro render no cliente bata com o SSR (sempre expandido).
  useEffect(() => {
    setCollapsed(readStoredSidebarCollapsed());
  }, []);

  /** Alterna o colapso da sidebar e persiste a escolha em `localStorage`. */
  const toggleSidebarCollapsed = useCallback(() => {
    setCollapsed((previous) => {
      const next = !previous;
      persistSidebarCollapsed(next);
      return next;
    });
  }, []);

  return (
    <Box
      className={className}
      sx={{
        height: "100dvh",
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        padding: 0,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}, color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
      }}
    >
      {showNavbar ? <SideNav collapsed={collapsed} /> : null}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {showNavbar ? (
          <Navbar
            isMobile={isMobile}
            collapsed={collapsed}
            onToggleSidebar={toggleSidebarCollapsed}
          />
        ) : null}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "auto",
            pb: 0,
            px: 0,
            // Scrollbar do conteúdo principal alinhada ao tema (o Box raiz é
            // overflow:hidden, então a estilização precisa viver aqui, no
            // único elemento que realmente rola). Firefox via scrollbar-*,
            // WebKit via ::-webkit-scrollbar.
            scrollbarWidth: "thin",
            scrollbarColor: `${alpha(theme.palette.text.primary, isDark ? 0.22 : 0.28)} transparent`,
            "&::-webkit-scrollbar": {
              width: "10px",
              height: "10px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: alpha(
                theme.palette.text.primary,
                isDark ? 0.2 : 0.26,
              ),
              borderRadius: "8px",
              border: `2px solid ${theme.palette.background.default}`,
              backgroundClip: "content-box",
              "&:hover": {
                backgroundColor: alpha(
                  theme.palette.text.primary,
                  isDark ? 0.34 : 0.4,
                ),
              },
            },
            "& > *": {
              width: "100%",
              minHeight: "inherit",
              boxSizing: "border-box",
            },
            "& > * > *": {
              margin: 0,
            },
          }}
        >
          {children}
        </Box>

        {/* Compact: este footer vive FORA do <main> com scroll, então fica
            permanentemente visível — a variante cheia (links de aquisição)
            ocupava ~32% do viewport mobile. */}
        {showFooter ? <Footer variant="compact" /> : null}
      </Box>
    </Box>
  );
}

export default MainLayout;
