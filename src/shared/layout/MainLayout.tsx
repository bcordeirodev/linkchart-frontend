"use client";
/**
 * Layout principal da aplicação com suporte a temas
 */
import { Box, useTheme } from "@mui/material";

import { useResponsive } from "@/lib/theme";
import { motionTokens } from "@/lib/theme/designSystem";

import { Navbar, Footer, SideNav } from "./components";

interface MainLayoutProps {
  children: React.ReactNode;
  navbar?: boolean;
  footer?: boolean;
  className?: string;
}

/**
 * Casca (shell) principal da aplicação autenticada.
 *
 * Estrutura: `Navbar` (AppBar fixo, full-width) no topo → uma linha flex
 * horizontal com `SideNav` (desktop `md+`) + `<main>` preenchendo o espaço
 * restante → `Footer` (full-width) ao final. A linha do meio não tem scroll
 * próprio (`overflow: hidden`); só `<main>` rola internamente — por isso a
 * sidebar permanece parada ao lado do conteúdo sem precisar de
 * `position: fixed`/`sticky`, e nunca sobrepõe o header (a linha começa
 * abaixo dele, compensada pelo mesmo `pt` que já existia) nem o footer (a
 * linha termina antes dele, como irmão seguinte no flex column).
 */
function MainLayout({
  children,
  navbar = true,
  footer = true,
  className,
}: MainLayoutProps) {
  const theme = useTheme();
  const { isMobile } = useResponsive();

  const showNavbar = navbar;
  const showFooter = footer;

  return (
    <Box
      className={className}
      sx={{
        minHeight: "100dvh",
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        padding: 0,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}, color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: theme.palette.background.paper,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.divider,
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }}
    >
      {showNavbar ? <Navbar isMobile={isMobile} /> : null}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
          minHeight: 0,
          width: "100%",
          overflow: "hidden",
          // Match the fixed navbar height (Toolbar minHeight xs:64, md:72) so
          // the sidebar and the top of the page aren't clipped under the AppBar.
          pt: showNavbar ? { xs: 8, md: 9 } : 0,
        }}
      >
        {showNavbar ? <SideNav /> : null}

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
      </Box>

      {showFooter ? <Footer /> : null}
    </Box>
  );
}

export default MainLayout;
