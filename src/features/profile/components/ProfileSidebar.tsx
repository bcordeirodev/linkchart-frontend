"use client";

import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";
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
 * Mirrors the real component's responsive direction
 * (`{xs:"column", sm:"row"}`) and its value height at each breakpoint
 * (~40px/48px) so the loading state doesn't change shape once real data
 * replaces it.
 */
function ProfileActivitySkeleton() {
  const valueSx = { height: { xs: 40, sm: 48 } };

  return (
    <Stack spacing={2.5}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.5, sm: 3 }}
      >
        <Skeleton variant="text" width={64} sx={valueSx} />
        <Skeleton variant="text" width={64} sx={valueSx} />
      </Stack>
      <Box>
        <Skeleton variant="text" width={96} height={20} sx={{ mb: 1 }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1.5, sm: 1.5 }}
        >
          <Skeleton variant="text" width={48} sx={valueSx} />
          <Skeleton variant="text" width={48} sx={valueSx} />
          <Skeleton variant="text" width={48} sx={valueSx} />
        </Stack>
      </Box>
    </Stack>
  );
}

/**
 * "/ Atividade" — link/click totals as the page's information anchor: big
 * Space Grotesk numbers via the shared `OverviewMetricRow` primitive (the
 * mandated "number + hairline, no card, no icon" treatment for overview
 * metrics), not small prose rows. Right column, below
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
            <OverviewMetricRow
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
