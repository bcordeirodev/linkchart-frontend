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
    return configs[errorType] ?? configs.generic!;
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
                      onClick={() => {
                        window.location.href = suggestion.href;
                      }}
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
