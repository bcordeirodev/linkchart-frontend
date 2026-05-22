"use client";
/**
 * LINKS MOBILE CARDS
 *
 * Optimised card list for narrow viewports. Each card shows:
 * - Favicon, title, status chip and overflow menu in the header row
 * - Destination URL (truncated)
 * - Action zone: click-to-copy short-URL strip + Analytics button (one row, no duplication)
 * - Compact metrics footer (sparkline, trend %, clicks, date, health)
 *
 * A status-coloured left accent (inset box-shadow) mirrors the desktop card.
 */

import { Eye, Clock, Link2 } from "lucide-react";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import {
  alpha,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { LinkCardActionBar } from "./LinkCardActionBar";
import { LinkActionsMenu } from "./LinkActionsMenu";

import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import {
  getLinkStatus,
  getResolvedStatusColor,
  STATUS_MAP,
} from "../../utils/linkStatus";
import type { LinkStatus } from "../../utils/linkStatus";

import type {
  BatchMetaResponse,
  LinkMeta,
  LinkResponse as Link,
} from "@/types";

import { LinkHealthBadge } from "./LinkHealthBadge";
import { LinkPreviewThumb } from "./LinkPreviewThumb";
import { LinkSparkline } from "./LinkSparkline";
import { useShortUrl } from "@/features/links/hooks/useShortUrl";
import {
  getLinkCardMetricsRowSx,
  getLinkCardShellSx,
  getNewlyCreatedHighlightSx,
  linkCardContentSx,
  linkCardMetricInlineSx,
} from "./linksPanelStyles";

const STATUS_LABEL_KEYS = {
  active: "status.active",
  inactive: "status.inactive",
  scheduled: "status.scheduled",
  expired: "status.expired",
} as const satisfies Record<LinkStatus, string>;

interface LinksMobileCardsProps {
  data: Link[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (link: Link) => void;
  meta?: BatchMetaResponse;
  highlightedLinkId?: string | null;
}

interface LinkMobileCardProps {
  link: Link;
  onDelete?: (id: string) => void;
  onEdit?: (link: Link) => void;
  meta?: LinkMeta;
  isHighlighted?: boolean;
}

/**
 * Individual mobile card for a single link.
 */
const LinkMobileCard = memo(
  ({
    link,
    onDelete,
    onEdit,
    meta,
    isHighlighted = false,
  }: LinkMobileCardProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { t, i18n } = useTranslation("links");
    const dateLocale = i18n.language === "pt-BR" ? ptBR : enUS;
    const isDark = theme.palette.mode === "dark";

    const shortUrl = useShortUrl(link.slug || link.custom_slug || "");
    const displayUrl = shortUrl.replace(/^https?:\/\//, "");

    const getFormattedDate = () => {
      try {
        if (!link.created_at) return t("table.dateUnavailable");
        const date = new Date(link.created_at);
        if (isNaN(date.getTime())) return t("table.dateInvalid");
        return formatDistanceToNow(date, {
          addSuffix: true,
          locale: dateLocale,
        });
      } catch {
        return t("table.dateUnavailable");
      }
    };

    const createdAt = getFormattedDate();

    const linkStatus = getLinkStatus(link);
    const statusColorKey = STATUS_MAP[linkStatus].color;
    const statusColorValue = getResolvedStatusColor(theme, linkStatus);
    const statusLabel = t(STATUS_LABEL_KEYS[linkStatus]);

    const truncateUrl = (url: string, maxLength = 48) =>
      url.length <= maxLength ? url : `${url.substring(0, maxLength)}…`;

    // Consistent decorative left accent — same blue-gray as desktop card.
    const accentShadow = `inset 3px 0 0 0 ${alpha(
      theme.palette.primary.light,
      isDark ? 0.38 : 0.32,
    )}`;
    const baseElevation = isDark ? elevationTokens.xs : elevationLightTokens.xs;
    const hoverElevation = isDark
      ? elevationTokens.sm
      : elevationLightTokens.sm;

    return (
      <Card
        id={`link-card-${link.id}`}
        sx={{
          mb: 1,
          ...getLinkCardShellSx(theme),
          ...(isHighlighted
            ? getNewlyCreatedHighlightSx(theme)
            : {
                boxShadow: `${accentShadow}, ${baseElevation}`,
                "&:hover": {
                  boxShadow: `${accentShadow}, ${hoverElevation}`,
                },
              }),
        }}
      >
        <CardContent
          sx={{
            ...linkCardContentSx,
            "&:last-child": { pb: linkCardContentSx.py },
          }}
        >
          {/* 1 — Favicon · title · status chip · menu — all in one row */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ mb: 0.375, minWidth: 0 }}
          >
            <LinkPreviewThumb preview={meta?.preview} size={20} />
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {link.title || t("list.noTitle")}
            </Typography>
            <Chip
              size="small"
              label={statusLabel}
              sx={{
                height: 20,
                fontSize: "0.625rem",
                fontWeight: 500,
                flexShrink: 0,
                bgcolor: alpha(statusColorValue, 0.12),
                color: statusColorKey,
                border: `1px solid ${alpha(statusColorValue, 0.22)}`,
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
            <LinkActionsMenu
              onEdit={() => {
                if (onEdit) {
                  onEdit(link);
                } else {
                  navigate(`/links/edit/${link.id}`);
                }
              }}
              onQR={() => navigate(`/links/qr/${link.id}`)}
              onDelete={() => setDeleteDialogOpen(true)}
            />
          </Stack>

          {/* 2 — Destination URL full width */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontSize: "0.75rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              mb: 0.75,
            }}
          >
            {truncateUrl(link.original_url)}
          </Typography>

          <LinkCardActionBar
            shortUrl={shortUrl}
            displayUrl={displayUrl}
            onAnalytics={() => navigate(`/links/analytics/${link.id}`)}
            sx={{ mb: 0.75 }}
          />

          <Box sx={{ ...getLinkCardMetricsRowSx(theme), mt: 0.75, pt: 0.75 }}>
            {!!meta?.sparkline?.length && (
              <LinkSparkline
                data={meta.sparkline}
                trend={meta.trend?.percent_change}
                height={22}
                width={72}
              />
            )}

            {meta?.trend ? (
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  color:
                    meta.trend.percent_change >= 0
                      ? "success.main"
                      : "error.main",
                }}
              >
                {meta.trend.percent_change >= 0 ? "+" : ""}
                {meta.trend.percent_change.toFixed(1)}%
              </Typography>
            ) : null}

            <Box sx={linkCardMetricInlineSx}>
              <Eye {...ICON_SM} style={{ opacity: 0.4 }} />
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, fontSize: "0.7rem" }}
              >
                {link.clicks || 0}
              </Typography>
            </Box>

            <Box sx={linkCardMetricInlineSx}>
              <Clock {...ICON_SM} style={{ opacity: 0.4 }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.7rem" }}
              >
                {createdAt}
              </Typography>
            </Box>

            {meta?.trend ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.7rem" }}
              >
                {meta.trend.last_click_at
                  ? formatDistanceToNow(new Date(meta.trend.last_click_at), {
                      addSuffix: true,
                      locale: dateLocale,
                    })
                  : t("metrics.neverClicked")}
              </Typography>
            ) : null}

            <LinkHealthBadge health={meta?.health} />
          </Box>
        </CardContent>

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          shortUrl={shortUrl}
          onConfirm={() => {
            setDeleteDialogOpen(false);
            if (onDelete) onDelete(String(link.id));
          }}
          onCancel={() => setDeleteDialogOpen(false)}
        />
      </Card>
    );
  },
);

LinkMobileCard.displayName = "LinkMobileCard";

/**
 * Renders a scrollable list of mobile link cards with an inline loading skeleton.
 */
export const LinksMobileCards = memo(
  ({
    data,
    loading,
    onDelete,
    onEdit,
    meta,
    highlightedLinkId = null,
  }: LinksMobileCardsProps) => {
    const { t } = useTranslation("links");

    if (loading) {
      return (
        <Box sx={{ p: 2 }}>
          {[...Array(3)].map((_, index) => (
            <Card
              key={index}
              sx={{ mb: 2, borderRadius: `${radiusTokens.lg}px` }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "grey.200",
                      mr: 2,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        height: 20,
                        bgcolor: "grey.200",
                        borderRadius: `${radiusTokens.sm}px`,
                        mb: 1,
                      }}
                    />
                    <Box
                      sx={{
                        height: 16,
                        bgcolor: "grey.100",
                        borderRadius: `${radiusTokens.sm}px`,
                        width: "70%",
                      }}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: 40,
                    bgcolor: "grey.100",
                    borderRadius: `${radiusTokens.md}px`,
                    mb: 2,
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box
                    sx={{
                      height: 24,
                      bgcolor: "grey.200",
                      borderRadius: `${radiusTokens.full}px`,
                      width: 60,
                    }}
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "grey.200",
                        borderRadius: "50%",
                      }}
                    />
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "grey.200",
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    if (!data || data.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 6, px: 3 }}>
          <Link2
            size={64}
            strokeWidth={1.5}
            style={{ opacity: 0.3, marginBottom: 16 }}
          />
          <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
            {t("list.empty.title")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.disabled" }}>
            {t("list.empty.createButton")}
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        {data.map((link) => (
          <LinkMobileCard
            key={link.id}
            link={link}
            meta={meta?.[String(link.id)]}
            onDelete={onDelete}
            onEdit={onEdit}
            isHighlighted={String(link.id) === highlightedLinkId}
          />
        ))}
      </Box>
    );
  },
);

LinksMobileCards.displayName = "LinksMobileCards";

export default LinksMobileCards;
