"use client";
import {
  BarChart2,
  Calendar,
  Shield,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD, ICON_SM } from "@/lib/theme/iconDefaults";
import { Box, Divider, Skeleton, Stack, Typography } from "@mui/material";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { useProfileStats } from "../hooks/useProfileStats";

import type { UserProfile } from "@/services";

interface ProfileSidebarProps {
  user: UserProfile;
}

/**
 * Sidebar do perfil com status da conta e estatísticas de atividade.
 *
 * Composta por dois cards:
 *  1. Account Status — verified badge + member since
 *  2. Activity — total links and total clicks from useProfileStats
 */
export function ProfileSidebar({ user }: ProfileSidebarProps) {
  const { t, i18n } = useTranslation("profile");
  const { data: stats, isLoading: statsLoading } = useProfileStats();

  return (
    <Stack spacing={3}>
      {/* ── Card 1: Account Status ───────────────────────────────── */}
      <EnhancedPaper>
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
          >
            <Shield {...ICON_MD} />
            {t("sidebar.accountStatus")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {user.email_verified_at ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.success.light, 0.15),
                }}
              >
                <BadgeCheck {...ICON_MD} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {t("sidebar.verified")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("sidebar.verifiedDesc")}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.warning.light, 0.15),
                }}
              >
                <AlertCircle {...ICON_MD} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {t("sidebar.pendingVerification")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("sidebar.pendingVerificationDesc")}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.info.light, 0.15),
              }}
            >
              <Calendar {...ICON_SM} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t("sidebar.memberSince")}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString(
                        i18n.language,
                      )
                    : t("sidebar.dateUnavailable")}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </EnhancedPaper>

      {/* ── Card 2: Activity ─────────────────────────────────────── */}
      <EnhancedPaper>
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
          >
            <BarChart2 {...ICON_MD} />
            {t("sidebar.activity")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", gap: 5 }}>
            <Box>
              {statsLoading ? (
                <Skeleton variant="text" width={48} height={52} />
              ) : (
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, lineHeight: 1.1 }}
                >
                  {stats?.total_links ?? 0}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                {t("sidebar.totalLinks")}
              </Typography>
            </Box>

            <Box>
              {statsLoading ? (
                <Skeleton variant="text" width={64} height={52} />
              ) : (
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, lineHeight: 1.1 }}
                >
                  {(stats?.total_clicks ?? 0).toLocaleString(i18n.language)}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                {t("sidebar.totalClicks")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </EnhancedPaper>
    </Stack>
  );
}

export default ProfileSidebar;
