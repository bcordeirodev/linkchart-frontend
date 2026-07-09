"use client";

import {
  BarChart2,
  Calendar,
  Shield,
  BadgeCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { ICON_MD, ICON_SM } from "@/lib/theme/iconDefaults";
import {
  Button,
  CircularProgress,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { useProfileStats } from "../hooks/useProfileStats";
import { useResendVerification } from "../hooks/useResendVerification";
import {
  ProfileInfoRow,
  ProfileSection,
  ProfileSectionHeader,
  ProfileStatGrid,
} from "./ProfileSection";

import { formatCount } from "@/lib/utils/formatNumber";

import type { UserProfile } from "@/services";

interface ProfileSidebarProps {
  user: UserProfile;
  /** Exibe a ação de reenviar verificação (false para contas OAuth, que já são tratadas como verificadas). */
  showResendVerification?: boolean;
}

export function ProfileSidebar({
  user,
  showResendVerification = false,
}: ProfileSidebarProps) {
  const { t, i18n } = useTranslation("profile");
  const { data: stats, isLoading: statsLoading } = useProfileStats();
  const { resend, isSending, isCoolingDown } = useResendVerification();

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString(i18n.language)
    : t("sidebar.dateUnavailable");

  const statValue = (n: number) =>
    statsLoading ? (
      <Skeleton variant="text" width={48} height={32} />
    ) : (
      formatCount(n, i18n.language)
    );

  const statValueOptional = (value: string | number) =>
    statsLoading ? <Skeleton variant="text" width={40} height={32} /> : value;

  const avgClicks =
    stats && stats.total_links > 0
      ? Math.round(stats.total_clicks / stats.total_links).toLocaleString(
          i18n.language,
        )
      : "—";

  return (
    <Stack spacing={2}>
      <ProfileSection>
        <ProfileSectionHeader
          icon={<Shield {...ICON_MD} />}
          title={t("sidebar.accountStatus")}
        />
        <ProfileInfoRow
          icon={
            user.email_verified_at ? (
              <BadgeCheck {...ICON_MD} />
            ) : (
              <AlertCircle {...ICON_MD} />
            )
          }
          label={
            user.email_verified_at
              ? t("sidebar.verified")
              : t("sidebar.pendingVerification")
          }
          value={
            user.email_verified_at
              ? t("sidebar.verifiedDesc")
              : t("sidebar.pendingVerificationDesc")
          }
        />
        {!user.email_verified_at && showResendVerification ? (
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            fullWidth
            onClick={resend}
            disabled={isSending || isCoolingDown}
            startIcon={
              isSending ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <RefreshCw {...ICON_SM} />
              )
            }
            sx={{ my: 1, borderColor: "divider", color: "text.secondary" }}
          >
            {t("sidebar.resendVerification")}
          </Button>
        ) : null}
        <ProfileInfoRow
          icon={<Calendar {...ICON_SM} />}
          label={t("sidebar.memberSince")}
          value={memberSince}
        />
      </ProfileSection>

      <ProfileSection>
        <ProfileSectionHeader
          icon={<BarChart2 {...ICON_MD} />}
          title={t("sidebar.activity")}
        />

        <ProfileStatGrid
          items={[
            {
              label: t("sidebar.totalLinks"),
              value: statValue(stats?.total_links ?? 0),
            },
            {
              label: t("sidebar.totalClicks"),
              value: statValue(stats?.total_clicks ?? 0),
            },
          ]}
        />

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 1.5, fontWeight: 600 }}
        >
          {t("sidebar.thisMonth")}
        </Typography>
        <ProfileStatGrid
          columns={3}
          items={[
            {
              label: t("sidebar.avgClicks"),
              value: statValueOptional(avgClicks),
            },
            {
              label: t("sidebar.linksThisMonth"),
              value: statValue(stats?.links_this_month ?? 0),
            },
            {
              label: t("sidebar.clicksThisMonth"),
              value: statValue(stats?.clicks_this_month ?? 0),
            },
          ]}
        />
      </ProfileSection>
    </Stack>
  );
}

export default ProfileSidebar;
