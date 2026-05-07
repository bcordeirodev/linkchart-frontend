# Not Found Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar a página 404 com identidade visual alinhada ao tema MUI, corrigir bug de ícone hardcoded e remover ruído desnecessário (footer, cores hardcoded).

**Architecture:** `ErrorLayout` torna-se um shell configurável via props `iconNode` e `backgroundText`; `NotFoundPage` passa `<LinkOff>` como `iconNode` e `"404"` como `backgroundText`, ficando responsável apenas pelo conteúdo textual. O bug de ícone é corrigido mapeando `errorConfig` para `IconIntent` válidos.

**Tech Stack:** Next.js 15 App Router, MUI 6, Lucide React, `@mui/material/styles` (alpha), TypeScript.

---

## File Map

| Arquivo                                       | Operação | Responsabilidade                                                                                                         |
| --------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `src/shared/layout/ErrorLayout.tsx`           | Modify   | Shell de layout: header, background decorativo, círculo de ícone configurável, botões, chips de sugestão. Remove footer. |
| `src/page-components/system/NotFoundPage.tsx` | Modify   | Conteúdo 404: passa `iconNode` e `backgroundText` para `ErrorLayout`, renderiza título e descrição.                      |

---

## Task 1: Atualizar ErrorLayout

**Files:**

- Modify: `src/shared/layout/ErrorLayout.tsx`

- [ ] **Step 1: Substituir o conteúdo de `ErrorLayout.tsx` pelo código abaixo**

```tsx
"use client";
import { alpha } from "@mui/material/styles";
import {
  Box,
  useTheme,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "@/shared/hooks";
import { AppIcon } from "@/shared/ui/icons";
import type { IconIntent } from "@/shared/ui/icons";
import { useResponsive, createPresetAnimations } from "@/lib/theme";
import { Link } from "@/shared/components";

interface ErrorLayoutProps {
  children: ReactNode;
  errorType?: "404" | "500" | "403" | "network" | "generic";
  showBackButton?: boolean;
  showHomeLink?: boolean;
  suggestions?: { label: string; href: string }[];
  className?: string;
  iconNode?: ReactNode;
  backgroundText?: string;
}

function ErrorLayout({
  children,
  errorType = "generic",
  showBackButton = true,
  showHomeLink = true,
  suggestions = [],
  className,
  iconNode,
  backgroundText,
}: ErrorLayoutProps) {
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const animations = createPresetAnimations(theme);
  const navigate = useNavigate();

  const errorConfig = useMemo(() => {
    const configs: Record<
      string,
      { bgGradient: [string, string]; defaultIntent: IconIntent }
    > = {
      "404": {
        bgGradient: [theme.palette.primary.light, theme.palette.primary.main],
        defaultIntent: "info",
      },
      "500": {
        bgGradient: [theme.palette.error.light, theme.palette.error.main],
        defaultIntent: "error",
      },
      "403": {
        bgGradient: [theme.palette.error.light, theme.palette.error.main],
        defaultIntent: "error",
      },
      network: {
        bgGradient: [theme.palette.info.light, theme.palette.info.main],
        defaultIntent: "warning",
      },
      generic: {
        bgGradient: [theme.palette.grey[300], theme.palette.grey[500]],
        defaultIntent: "warning",
      },
    };
    return configs[errorType] ?? configs.generic;
  }, [errorType, theme]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <Box
      className={className}
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot pattern overlay */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.08)} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <Box
        component="header"
        sx={{
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Link
            href="/"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "text.primary",
              fontWeight: 600,
              fontSize: "1.25rem",
            }}
          >
            <AppIcon intent="link" size={24} />
            Link Charts
          </Link>
        </Container>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3, md: 4 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {backgroundText && (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: { xs: "8rem", sm: "12rem", md: "18rem" },
              fontWeight: 900,
              color: alpha(theme.palette.primary.main, 0.06),
              userSelect: "none",
              pointerEvents: "none",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {backgroundText}
          </Box>
        )}

        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", ...animations.fadeIn }}>
            {/* Icon circle */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${errorConfig.bgGradient[0]}, ${errorConfig.bgGradient[1]})`,
                color: "#fff",
                mb: 4,
                boxShadow: theme.shadows[8],
                willChange: "transform",
                animation: "float 3s ease-in-out infinite",
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-12px)" },
                },
              }}
            >
              {iconNode ?? (
                <AppIcon
                  intent={errorConfig.defaultIntent}
                  size={isMobile ? 40 : 48}
                />
              )}
            </Box>

            {/* Children */}
            <Box
              sx={{
                mb: 4,
                animation: "slideInUp 0.5s ease-out",
                "@keyframes slideInUp": {
                  from: { opacity: 0, transform: "translateY(20px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              {children}
            </Box>

            {/* Action buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: suggestions.length > 0 ? 4 : 0 }}
            >
              {showBackButton && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGoBack}
                  startIcon={<AppIcon intent="back" size={20} />}
                  sx={{ minWidth: { xs: "100%", sm: 160 } }}
                >
                  Voltar
                </Button>
              )}
              {showHomeLink && (
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/"
                  startIcon={<AppIcon intent="link" size={20} />}
                  sx={{ minWidth: { xs: "100%", sm: 160 } }}
                >
                  Início
                </Button>
              )}
            </Stack>

            {/* Navigation suggestions as chips */}
            {suggestions.length > 0 && (
              <Box
                sx={{
                  animation: "slideInUp 0.5s ease-out 0.3s both",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ mb: 1.5, color: "text.secondary" }}
                >
                  Talvez você esteja procurando:
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="center"
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  {suggestions.map((suggestion) => (
                    <Chip
                      key={suggestion.href}
                      label={suggestion.label}
                      variant="outlined"
                      size="small"
                      clickable
                      component={Link}
                      href={suggestion.href}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default ErrorLayout;
```

- [ ] **Step 2: Verificar que o arquivo foi salvo corretamente**

```bash
head -5 src/shared/layout/ErrorLayout.tsx
```

Esperado: `"use client";` na linha 1 e `import { alpha } from "@mui/material/styles";` na linha 2.

- [ ] **Step 3: Commit**

```bash
git add src/shared/layout/ErrorLayout.tsx
git commit -m "refactor(layout): update ErrorLayout with iconNode/backgroundText props and dot pattern bg"
```

---

## Task 2: Atualizar NotFoundPage

**Files:**

- Modify: `src/page-components/system/NotFoundPage.tsx`

- [ ] **Step 1: Substituir o conteúdo de `NotFoundPage.tsx` pelo código abaixo**

```tsx
"use client";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LinkOff } from "lucide-react";
import { useLocation } from "@/shared/hooks";
import { ErrorLayout } from "@/shared/layout";
import { useResponsive } from "@/lib/theme";
import useUser from "../../lib/auth/useUser";

function NotFoundPage() {
  const { t } = useTranslation("public");
  const { data: user } = useUser();
  const location = useLocation();
  const { isMobile } = useResponsive();
  const isAuthenticated = !!user;
  const [suggestions, setSuggestions] = useState<
    { label: string; href: string }[]
  >([]);

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const suggestionList: { label: string; href: string }[] = [];

    if (isAuthenticated) {
      suggestionList.push({ label: "Meus Links", href: "/links" });
      if (pathSegments.length > 1) {
        suggestionList.push({
          label: "Seção Principal",
          href: `/${pathSegments[0]}`,
        });
      }
    } else {
      suggestionList.push({ label: "Encurtador", href: "/shorter" });
    }

    setSuggestions(suggestionList);
  }, [location.pathname, isAuthenticated]);

  return (
    <ErrorLayout
      errorType="404"
      suggestions={suggestions}
      backgroundText="404"
      iconNode={<LinkOff size={isMobile ? 36 : 48} />}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}
      >
        {t("notFound.title")}
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, color: "text.secondary", maxWidth: 480, mx: "auto" }}
      >
        {t("notFound.description")}
      </Typography>
    </ErrorLayout>
  );
}

export default NotFoundPage;
```

- [ ] **Step 2: Verificar que o arquivo foi salvo corretamente**

```bash
head -5 src/page-components/system/NotFoundPage.tsx
```

Esperado: `"use client";` na linha 1.

- [ ] **Step 3: Commit**

```bash
git add src/page-components/system/NotFoundPage.tsx
git commit -m "feat(404): redesign not-found page with themed icon and background text"
```

---

## Task 3: Verificação de qualidade e browser

**Files:** nenhum arquivo modificado

- [ ] **Step 1: Rodar `npm run quality` dentro do container Docker**

```bash
docker-compose exec frontend npm run quality
```

Esperado: saída sem erros de TypeScript, ESLint ou Prettier. Se houver erro de tipo em `Chip component={Link}`, usar:

```tsx
// Substituir o Chip por:
<Chip
  key={suggestion.href}
  label={suggestion.label}
  variant="outlined"
  size="small"
  clickable
  onClick={() => {
    window.location.href = suggestion.href;
  }}
/>
```

- [ ] **Step 2: Abrir a página 404 no browser**

Navegar para `http://localhost:3000/pagina-que-nao-existe`.

Verificar:

- Texto "404" aparece grande e translúcido no fundo
- Círculo com ícone `LinkOff` flutua suavemente (loop de 3s)
- Título "Página não encontrada" renderiza abaixo do círculo
- Botões "Voltar" e "Início" aparecem lado a lado (desktop) ou empilhados (mobile)
- Chips de sugestão aparecem abaixo dos botões
- Sem header de rodapé na página

- [ ] **Step 3: Testar em mobile (375px)**

No DevTools, ativar device emulation iPhone SE (375px).

Verificar:

- "404" de fundo com `font-size: 8rem` (não quebra layout)
- Círculo 80×80px com ícone 36px
- Botões ocupam 100% da largura, empilhados

- [ ] **Step 4: Testar dark mode**

Alternar para dark mode via configuração do tema.

Verificar: nenhuma cor hardcoded aparece — tudo usa cores do tema.
