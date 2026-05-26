"use client";
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  Container,
  Alert,
  Button,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { getPublicInsetSx } from "@/lib/theme/publicPageStyles";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/features/shorter/constants";

import { PublicLayout } from "@/shared/layout";

interface ErrorStateProps {
  error: string;
  debugInfo?: string;
  onCreateLink: () => void;
}

/**
 * ❌ ERROR STATE
 *
 * Estado de erro para Basic Analytics
 * Oferece ações de recuperação e debug info
 */
export function ErrorState({
  error,
  debugInfo,
  onCreateLink,
}: ErrorStateProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation("public");
  return (
    <PublicLayout variant="shorter" chrome="minimal">
      <Container
        maxWidth="md"
        sx={{ pt: { xs: 7, md: 8 }, pb: { xs: 6, md: 8 } }}
      >
        <Alert
          severity="error"
          sx={{
            ...getPublicInsetSx(theme),
            mb: 4,
            maxWidth: SHORTER_CONTENT_MAX_WIDTH,
            mx: "auto",
            borderColor: alpha(theme.palette.error.main, isDark ? 0.42 : 0.35),
            bgcolor: alpha(theme.palette.error.main, isDark ? 0.14 : 0.08),
            color: theme.palette.text.primary,
            "& .MuiAlert-icon": {
              color: theme.palette.error.main,
            },
          }}
          action={
            <Button
              color="inherit"
              onClick={onCreateLink}
              sx={{ fontWeight: 600, opacity: 0.9 }}
            >
              {t("publicAnalytics.createLink")}
            </Button>
          }
        >
          {error}
          {debugInfo ? (
            <Typography
              component="div"
              sx={{
                mt: 1.25,
                fontSize: "0.75rem",
                color: alpha(theme.palette.text.primary, isDark ? 0.72 : 0.75),
              }}
            >
              Debug: {debugInfo}
            </Typography>
          ) : null}
        </Alert>

        <Box textAlign="center">
          <Button
            variant="contained"
            startIcon={<Home {...ICON_MD} />}
            onClick={onCreateLink}
            size="large"
            sx={{
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { boxShadow: "none", opacity: 0.92 },
            }}
          >
            {t("publicAnalytics.backToShortener")}
          </Button>
        </Box>
      </Container>
    </PublicLayout>
  );
}
