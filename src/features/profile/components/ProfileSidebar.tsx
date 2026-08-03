"use client";

import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_SM } from "@/lib/theme/iconDefaults";
import {
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { useProfileStats } from "../hooks/useProfileStats";
import { useResendVerification } from "../hooks/useResendVerification";
import { ProfileMetaRow, ProfileSection } from "./ProfileSection";
import { OverviewMetricRow, SectionLabel } from "@/shared/ui/base";

import { formatCount } from "@/lib/utils/formatNumber";

import type { UserProfile } from "@/services";

interface ProfileSidebarProps {
  user: UserProfile;
  /** Exibe a ação de reenviar verificação (false para contas OAuth, que já são tratadas como verificadas). */
  showResendVerification?: boolean;
}

/**
 * Rough skeleton matching the two `OverviewMetricRow` groups (totals, then
 * "this month") while `useProfileStats` is loading — `OverviewMetricRow`'s
 * own `value` prop is typed `string | number` (no `ReactNode`), so it can't
 * host a `Skeleton` itself; this stands in for the whole block instead.
 */
function ProfileActivitySkeleton() {
  return (
    <Stack spacing={2.5}>
      <Stack direction="row" spacing={3}>
        <Skeleton variant="text" width={56} height={44} />
        <Skeleton variant="text" width={56} height={44} />
      </Stack>
      <Box>
        <Skeleton variant="text" width={96} height={20} sx={{ mb: 1 }} />
        <Stack direction="row" spacing={1.5}>
          <Skeleton variant="text" width={44} height={36} />
          <Skeleton variant="text" width={44} height={36} />
          <Skeleton variant="text" width={44} height={36} />
        </Stack>
      </Box>
    </Stack>
  );
}

/**
 * Account status and activity summary — two stacked full-width sections
 * (previously a two-column "sidebar" beside the main settings column).
 *
 * "Instrumento técnico" (2026-08-03): both sections lost their icon+title
 * `ProfileSectionHeader` in favor of a plain `SectionLabel`; the verified/
 * pending row dropped the `BadgeCheck`/`AlertCircle` icon for a semantic
 * text color (`success.main`/`warning.main`), matching how the rest of the
 * redesign colors status via the value itself, not an icon; "member since"
 * lost its `Calendar` icon. The link/click counts now go through the shared
 * `OverviewMetricRow` primitive (the mandated "number + hairline, no card,
 * no icon" treatment for overview metrics) instead of the feature-local
 * `ProfileStatGrid`, which is gone.
 */
export function ProfileSidebar({
  user,
  showResendVerification = false,
}: ProfileSidebarProps) {
  const { t, i18n } = useTranslation("profile");
  const { data: stats, isLoading: statsLoading } = useProfileStats();
  const { resend, isSending, isCoolingDown } = useResendVerification();

  const isVerified = !!user.email_verified_at;
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString(i18n.language)
    : t("sidebar.dateUnavailable");

  const avgClicks =
    stats && stats.total_links > 0
      ? Math.round(stats.total_clicks / stats.total_links).toLocaleString(
          i18n.language,
        )
      : "—";

  return (
    <Stack spacing={{ xs: 3, sm: 4 }}>
      <Stack spacing={1.25}>
        <SectionLabel headingLevel={2}>
          {t("sidebar.accountStatus")}
        </SectionLabel>
        <ProfileSection>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: isVerified ? "success.main" : "warning.main",
                }}
              >
                {isVerified
                  ? t("sidebar.verified")
                  : t("sidebar.pendingVerification")}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.25 }}
              >
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
            />
          </Stack>
        </ProfileSection>
      </Stack>

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
    </Stack>
  );
}

export default ProfileSidebar;
