"use client";
import { ExternalLink } from "lucide-react";
import { alpha, Box, Chip, Stack, Tooltip, Typography } from "@mui/material";
import { format } from "date-fns";
import { useTheme, type Theme } from "@mui/material/styles";
import {
  Children,
  Fragment,
  isValidElement,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";

import {
  formatLastClickLabel,
  getDateFnsLocale,
} from "@/features/links/utils/formatLastClick";
import {
  getLinkStatus,
  getResolvedStatusColor,
  STATUS_MAP,
} from "@/features/links/utils/linkStatus";
import type { LinkStatus } from "@/features/links/utils/linkStatus";
import { useAppDispatch } from "@/lib/store/hooks";
import { showMessage } from "@/lib/store/messageSlice";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import type { LinkMeta, LinkResponse } from "@/types";

import { LinkCardActionBar } from "./LinkCardActionBar";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { LinkActionsMenu } from "./LinkActionsMenu";
import { LinkHealthBadge } from "./LinkHealthBadge";
import { LinkPreviewThumb } from "./LinkPreviewThumb";
import { LinkSparkline } from "./LinkSparkline";
import { LinkTrendBadge } from "./LinkTrendBadge";
import { useShortUrl } from "@/features/links/hooks/useShortUrl";
import { radiusTokens } from "@/lib/theme/designSystem";
import {
  getLinkCardMetricDividerSx,
  getLinkCardMetricsRowSx,
  getLinkCardShellSx,
  getNewlyCreatedHighlightSx,
  linkCardListItemMb,
  linkCardContentSx,
  linkCardMetricInlineSx,
  linkCardMetricLabelSx,
  linkCardMetricSegmentSx,
  linkCardMetricValueSx,
} from "./linksPanelStyles";

const STATUS_LABEL_KEYS = {
  active: "status.active",
  inactive: "status.inactive",
  scheduled: "status.scheduled",
  expired: "status.expired",
} as const satisfies Record<LinkStatus, string>;

interface LinkCardRichProps {
  link: LinkResponse;
  meta?: LinkMeta;
  onDelete: (id: string) => Promise<void>;
  isHighlighted?: boolean;
}

function InlineMetric({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Box sx={linkCardMetricInlineSx}>
      <Typography variant="caption" component="span" sx={linkCardMetricLabelSx}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

/** Metrics footer with thin vertical dividers between each segment. */
function MetricsRow({
  children,
  dividerSx,
}: {
  children: ReactNode;
  dividerSx: object;
}) {
  const items = Children.toArray(children).filter((child) => {
    if (child == null || typeof child === "boolean") {
      return false;
    }
    return true;
  });

  return (
    <>
      {items.map((child, index) => (
        <Fragment
          key={isValidElement(child) && child.key != null ? child.key : index}
        >
          {index > 0 ? <Box aria-hidden sx={dividerSx} /> : null}
          <Box sx={linkCardMetricSegmentSx}>{child}</Box>
        </Fragment>
      ))}
    </>
  );
}

/** OG preview thumbnail — fixed aspect, aligned with destination row. */
function LinkOgPreview({
  imageUrl,
  title,
  theme,
}: {
  imageUrl: string;
  title?: string | null;
  theme: Theme;
}) {
  return (
    <Box
      sx={{
        width: 44,
        height: 28,
        flexShrink: 0,
        borderRadius: `${radiusTokens.sm}px`,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.common.black, 0.04),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt={title ?? ""}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </Box>
  );
}

/**
 * Desktop link card — identity row, full-width destination, copy CTA + analytics, metrics.
 */
export function LinkCardRich({
  link,
  meta,
  onDelete,
  isHighlighted = false,
}: LinkCardRichProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("links");
  const dateLocale = getDateFnsLocale(i18n.language);

  const shortUrl = useShortUrl(link.slug);
  const displayUrl = shortUrl.replace(/^https?:\/\//, "");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleConfirmDelete = useCallback(async () => {
    setDeleteDialogOpen(false);
    try {
      await onDelete(String(link.id));
    } catch {
      dispatch(
        showMessage({ message: "Erro ao excluir o link.", variant: "error" }),
      );
    }
  }, [link.id, onDelete, dispatch]);

  const handleDelete = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const status = getLinkStatus(link);
  const statusColorKey = STATUS_MAP[status].color;
  const statusColorValue = getResolvedStatusColor(theme, status);
  const statusLabel = t(STATUS_LABEL_KEYS[status]);

  const lastClickAt = meta?.trend?.last_click_at;
  const lastClickLabel = formatLastClickLabel(lastClickAt, dateLocale, t);
  const hasLastClick = Boolean(lastClickAt);

  const createdDate = link.created_at ? new Date(link.created_at) : null;
  const createdLabel =
    createdDate && !isNaN(createdDate.getTime())
      ? format(createdDate, "dd/MM/yyyy", { locale: dateLocale })
      : null;

  const metricDividerSx = getLinkCardMetricDividerSx(theme);

  return (
    <EnhancedPaper
      id={`link-card-${link.id}`}
      animated={false}
      sx={{
        mb: linkCardListItemMb,
        ...getLinkCardShellSx(theme),
        ...(isHighlighted ? getNewlyCreatedHighlightSx(theme) : {}),
      }}
    >
      <Box sx={linkCardContentSx}>
        {/* 1 — Favicon + title + status + menu (one row) */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ minWidth: 0 }}
        >
          <LinkPreviewThumb preview={meta?.preview} size={22} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {link.title || link.slug || link.custom_slug || t("list.noTitle")}
          </Typography>
          <Chip
            size="small"
            label={statusLabel}
            sx={{
              height: 20,
              flexShrink: 0,
              fontSize: "0.625rem",
              fontWeight: 500,
              bgcolor: alpha(statusColorValue, 0.12),
              color: statusColorKey,
              border: `1px solid ${alpha(statusColorValue, 0.22)}`,
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{ flexShrink: 0, ml: 0.25 }}
          >
            <LinkActionsMenu
              onEdit={() => navigate(`/links/edit/${link.id}`)}
              onQR={() => navigate(`/links/qr/${link.id}`)}
              onDelete={handleDelete}
            />
          </Box>
        </Stack>

        {/* 2 — Destination full width from left edge */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{ mt: 0.5, minWidth: 0 }}
        >
          {meta?.preview?.og_image_url ? (
            <LinkOgPreview
              imageUrl={meta.preview.og_image_url}
              title={meta.preview.og_title}
              theme={theme}
            />
          ) : null}
          <ExternalLink
            size={12}
            strokeWidth={1.75}
            style={{ flexShrink: 0, opacity: 0.4 }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              flex: 1,
              minWidth: 0,
              fontSize: "0.75rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={link.original_url}
          >
            {link.original_url}
          </Typography>
        </Stack>

        <LinkCardActionBar
          shortUrl={shortUrl}
          displayUrl={displayUrl}
          withTopBorder
          onAnalytics={() => navigate(`/links/analytics/${link.id}`)}
        />

        {/* 4 — Metrics with vertical dividers */}
        <Box sx={getLinkCardMetricsRowSx(theme)}>
          <MetricsRow dividerSx={metricDividerSx}>
            {meta?.sparkline?.length ? (
              <LinkSparkline
                data={meta.sparkline}
                trend={meta.trend?.percent_change}
                height={20}
                width={72}
              />
            ) : null}

            <LinkTrendBadge trend={meta?.trend} compact />

            <InlineMetric label={t("metrics.lastClickShort")}>
              <Typography
                variant="caption"
                component="span"
                sx={{
                  ...linkCardMetricValueSx,
                  color: hasLastClick ? "text.primary" : "text.disabled",
                  fontWeight: hasLastClick ? 600 : 500,
                }}
              >
                {lastClickLabel}
              </Typography>
            </InlineMetric>

            <LinkHealthBadge health={meta?.health} />

            <InlineMetric label={t("metrics.clicksShort")}>
              <Typography
                variant="caption"
                component="span"
                sx={linkCardMetricValueSx}
              >
                {link.clicks.toLocaleString(i18n.language)}
              </Typography>
            </InlineMetric>

            {createdLabel ? (
              <InlineMetric label={t("table.created")}>
                <Typography
                  variant="caption"
                  component="span"
                  sx={linkCardMetricValueSx}
                >
                  {createdLabel}
                </Typography>
              </InlineMetric>
            ) : null}

            {link.click_limit ? (
              <Tooltip
                title={`${t("table.clickLimit")}: ${link.click_limit.toLocaleString()}`}
              >
                <InlineMetric label={t("table.clickLimit")}>
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{
                      ...linkCardMetricValueSx,
                      color:
                        link.clicks >= link.click_limit
                          ? "error.main"
                          : "text.primary",
                    }}
                  >
                    {link.clicks.toLocaleString()}/
                    {link.click_limit.toLocaleString()}
                  </Typography>
                </InlineMetric>
              </Tooltip>
            ) : null}
          </MetricsRow>
        </Box>
      </Box>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        shortUrl={shortUrl}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </EnhancedPaper>
  );
}
