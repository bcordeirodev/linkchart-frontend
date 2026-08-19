"use client";

import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";
import { darkNeutral, lightNeutral, radiusTokens } from "@/lib/theme";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import { useProfileStats } from "../hooks/useProfileStats";
import { useResendVerification } from "../hooks/useResendVerification";
import { ProfileMetaRow, ProfileSection } from "./ProfileSection";
import { OverviewMetricRow, SectionLabel } from "@/shared/ui/base";

import { formatCount } from "@/lib/utils/formatNumber";

import type { UserProfile } from "@/services";

interface ProfileAccountStatusProps {
  user: UserProfile;
  /** Exibe a ação de reenviar verificação (false para contas OAuth, que já são tratadas como verificadas). */
  showResendVerification?: boolean;
}

/**
 * "/ Status da conta" — verification state as a colored `Chip` "badge" (not
 * a plain colored word) + its caption, and "member since" as a mono/tabular
 * date. Top of the right column in the two-column `/profile` composition
 * (round 2 of the "instrumento técnico" redesign — Bruno's gate rejected
 * the single-column flow this page had briefly landed on: "ficou pobre em
 * informação").
 *
 * The Chip's contrast follows the app's semantic-chip rule (white text in
 * dark mode; a saturated-enough dark tone in light mode, never a pastel
 * color over a same-hue tint) rather than the plain colored `Typography`
 * line the single-column round used, which read as flatter prose.
 */
export function ProfileAccountStatus({
  user,
  showResendVerification = false,
}: ProfileAccountStatusProps) {
  const { t, i18n } = useTranslation("profile");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { resend, isSending, isCoolingDown } = useResendVerification();

  const isVerified = !!user.email_verified_at;
  const tone = isVerified ? theme.palette.success : theme.palette.warning;
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString(i18n.language)
    : t("sidebar.dateUnavailable");

  return (
    <Stack spacing={1.25}>
      <SectionLabel headingLevel={2}>{t("sidebar.accountStatus")}</SectionLabel>
      <ProfileSection>
        <Stack spacing={2}>
          <Box>
            <Chip
              label={
                isVerified
                  ? t("sidebar.verified")
                  : t("sidebar.pendingVerification")
              }
              size="small"
              sx={{
                bgcolor: alpha(tone.main, isDark ? 0.24 : 0.14),
                border: `1px solid ${alpha(tone.main, isDark ? 0.5 : 0.32)}`,
                color: isDark ? theme.palette.common.white : tone.dark,
                fontWeight: 600,
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {isVerified
                ? t("sidebar.verifiedDesc")
                : t("sidebar.pendingVerificationDesc")}
            </Typography>
            {!isVerified && showResendVerification ? (
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={resend}
                disabled={isSending || isCoolingDown}
                startIcon={
                  isSending ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <RefreshCw {...ICON_SM} />
                  )
                }
                sx={{
                  mt: 1.5,
                  borderColor: "divider",
                  color: "text.secondary",
                }}
              >
                {t("sidebar.resendVerification")}
              </Button>
            ) : null}
          </Box>
          <ProfileMetaRow
            label={t("sidebar.memberSince")}
            value={memberSince}
            divider
            mono
          />
        </Stack>
      </ProfileSection>
    </Stack>
  );
}

/**
 * Rough skeleton matching the two `OverviewMetricRow` groups (totals, then
 * "this month") while `useProfileStats` is loading — `OverviewMetricRow`'s
 * own `value` prop is typed `string | number` (no `ReactNode`), so it can't
 * host a `Skeleton` itself; this stands in for the whole block instead.
 *
 * Atualizado no redesenho de tiles (2026-08-17): a fileira real virou um
 * grid de caixas com borda, então o esqueleto reproduz as MESMAS caixas
 * (mesma borda/raio/gap, `nested` como as fileiras reais deste card) com
 * placeholders de rótulo e valor dentro — antes eram linhas de texto soltas,
 * que agora mudariam de forma no instante em que os dados chegassem.
 */
function ProfileActivitySkeleton() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const tileSx = {
    backgroundColor: isDark ? darkNeutral.elevated : lightNeutral.bg,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: `${radiusTokens.md}px`,
    p: 2,
  } as const;
  const rowSx = {
    display: "grid",
    gap: 1.5,
  } as const;

  return (
    <Stack spacing={2.5}>
      <Box
        sx={{
          ...rowSx,
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
          },
        }}
      >
        {[0, 1].map((i) => (
          <Box key={i} sx={tileSx}>
            <Skeleton variant="text" width="60%" height={18} />
            <Skeleton
              variant="text"
              width="45%"
              sx={{ height: { xs: 40, sm: 48 } }}
            />
          </Box>
        ))}
      </Box>
      <Box>
        <Skeleton variant="text" width={96} height={20} sx={{ mb: 1 }} />
        <Box
          sx={{
            ...rowSx,
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                ...tileSx,
                // 3 métricas: no `xs` a fileira real vira grid de 2 colunas
                // com a última ocupando a linha inteira.
                gridColumn: { xs: i === 2 ? "span 2" : "auto", sm: "auto" },
              }}
            >
              <Skeleton variant="text" width="65%" height={18} />
              <Skeleton
                variant="text"
                width="50%"
                sx={{ height: { xs: 40, sm: 48 } }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Stack>
  );
}

/**
 * "/ Atividade" — link/click totals as the page's information anchor: big
 * Space Grotesk numbers via the shared `OverviewMetricRow` primitive (desde
 * 2026-08-17, tiles com hairline — sem ícone), not small prose rows. Right
 * column, below
 * {@link ProfileAccountStatus} in the two-column `/profile` composition.
 */
export function ProfileActivity() {
  const { t, i18n } = useTranslation("profile");
  const { data: stats, isLoading: statsLoading } = useProfileStats();

  const avgClicks =
    stats && stats.total_links > 0
      ? Math.round(stats.total_clicks / stats.total_links).toLocaleString(
          i18n.language,
        )
      : "—";

  return (
    <Stack spacing={1.25}>
      <SectionLabel headingLevel={2}>{t("sidebar.activity")}</SectionLabel>
      <ProfileSection>
        {statsLoading ? (
          <ProfileActivitySkeleton />
        ) : (
          <Stack spacing={2.5}>
            {/* `nested`: as duas fileiras vivem dentro do card
                `ProfileSection`. Desde o redesenho de tiles (2026-08-17) o
                tile precisa do degrau de elevação para não sumir contra a
                superfície do card hospedeiro. */}
            <OverviewMetricRow
              nested
              metrics={[
                {
                  label: t("sidebar.totalLinks"),
                  value: formatCount(stats?.total_links ?? 0, i18n.language),
                },
                {
                  label: t("sidebar.totalClicks"),
                  value: formatCount(stats?.total_clicks ?? 0, i18n.language),
                },
              ]}
            />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1.25, fontWeight: 600 }}
              >
                {t("sidebar.thisMonth")}
              </Typography>
              <OverviewMetricRow
                nested
                metrics={[
                  { label: t("sidebar.avgClicks"), value: avgClicks },
                  {
                    label: t("sidebar.linksThisMonth"),
                    value: formatCount(
                      stats?.links_this_month ?? 0,
                      i18n.language,
                    ),
                  },
                  {
                    label: t("sidebar.clicksThisMonth"),
                    value: formatCount(
                      stats?.clicks_this_month ?? 0,
                      i18n.language,
                    ),
                  },
                ]}
              />
            </Box>
          </Stack>
        )}
      </ProfileSection>
    </Stack>
  );
}
