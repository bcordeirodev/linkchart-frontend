"use client";
import {
  BarChart3,
  CalendarDays,
  ExternalLink,
  MousePointerClick,
} from "lucide-react";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import {
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { format, formatDistanceToNow } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/shared/hooks";

import { getLinkStatus, STATUS_MAP } from "@/features/links/utils/linkStatus";
import type { LinkStatus } from "@/features/links/utils/linkStatus";
import { useAppDispatch } from "@/lib/store/hooks";
import { showMessage } from "@/lib/store/messageSlice";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import useClipboard from "@/hooks/useClipboard";
import type { LinkMeta, LinkResponse } from "@/types";

import { LinkActionsMenu } from "./LinkActionsMenu";
import { LinkHealthBadge } from "./LinkHealthBadge";
import { LinkPreviewThumb } from "./LinkPreviewThumb";
import { LinkSparkline } from "./LinkSparkline";
import { LinkTrendBadge } from "./LinkTrendBadge";

const analyticsPulse = keyframes`
	0%, 100% {
		box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.5);
	}
	50% {
		box-shadow: 0 0 0 9px rgba(25, 118, 210, 0);
	}
`;

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
}

export function LinkCardRich({ link, meta, onDelete }: LinkCardRichProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("links");
  const dateLocale = i18n.language === "pt-BR" ? ptBR : enUS;

  const { copied, copy } = useClipboard({ timeout: 1500 });

  const shortUrl = `${window.location.origin}/r/${link.slug}`;

  const handleDelete = useCallback(async () => {
    if (
      window.confirm(
        `${t("actions.deleteConfirm")}\n${t("actions.deleteConfirmDesc")}`,
      )
    ) {
      try {
        await onDelete(String(link.id));
      } catch {
        dispatch(
          showMessage({ message: "Erro ao excluir o link.", variant: "error" }),
        );
      }
    }
  }, [link.id, onDelete, dispatch, t]);

  const status = getLinkStatus(link);
  const { color: statusColor } = STATUS_MAP[status];
  const statusLabel = t(STATUS_LABEL_KEYS[status]);

  const lastClickAt = meta?.trend?.last_click_at;
  const lastClickLabel = lastClickAt
    ? formatDistanceToNow(new Date(lastClickAt), {
        addSuffix: true,
        locale: dateLocale,
      })
    : t("metrics.neverClicked");

  const createdDate = link.created_at ? new Date(link.created_at) : null;
  const createdLabel =
    createdDate && !isNaN(createdDate.getTime())
      ? format(createdDate, "dd/MM/yyyy", { locale: dateLocale })
      : null;

  return (
    <EnhancedPaper
      sx={{
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 4 },
      }}
    >
      {/* Linha 1 — Header */}
      <Box
        sx={{
          px: 3,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <LinkPreviewThumb preview={meta?.preview} size={24} />
        <Typography
          variant="body1"
          sx={{
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

        <Tooltip
          title={copied ? t("actions.copySuccess") : t("actions.copyLink")}
        >
          <Box
            onClick={() => copy(shortUrl)}
            sx={{
              px: 1.5,
              py: 0.25,
              bgcolor: "rgba(25, 118, 210, 0.08)",
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "primary.light",
              fontFamily: "monospace",
              fontSize: "0.75rem",
              color: "primary.main",
              fontWeight: 600,
              cursor: "pointer",
              maxWidth: 360,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flexShrink: 0,
              "&:hover": { bgcolor: "rgba(25, 118, 210, 0.15)" },
            }}
          >
            {shortUrl}
          </Box>
        </Tooltip>

        <Tooltip title="Analytics">
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/links/analytics/${link.id}`);
            }}
            sx={{
              flexShrink: 0,
              minWidth: 0,
              borderRadius: "20px",
              px: 1,
              py: 0.25,
              boxShadow: "none",
              animation: `${analyticsPulse} 2.4s ease-in-out infinite`,
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
              },
              "&:hover": { boxShadow: "none", animation: "none" },
            }}
          >
            <BarChart3 {...ICON_SM} />
          </Button>
        </Tooltip>

        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ flexShrink: 0 }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: statusColor,
            }}
          />
          <Typography variant="caption">{statusLabel}</Typography>
        </Stack>

        <Box onClick={(e) => e.stopPropagation()}>
          <LinkActionsMenu
            onEdit={() => navigate(`/links/edit/${link.id}`)}
            onQR={() => navigate(`/links/qr/${link.id}`)}
            onDelete={handleDelete}
          />
        </Box>
      </Box>

      <Divider />

      {/* Linha 2 — URL original + thumb OG */}
      <Box sx={{ px: 3, py: 1, display: "flex", alignItems: "center", gap: 2 }}>
        <ExternalLink
          size={14}
          strokeWidth={1.5}
          style={{ flexShrink: 0, opacity: 0.5 }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={link.original_url}
        >
          {link.original_url}
        </Typography>
        {meta?.preview?.og_image_url ? (
          <Box
            component="img"
            src={meta.preview.og_image_url}
            alt={meta.preview.og_title ?? ""}
            sx={{
              width: 64,
              height: 40,
              objectFit: "cover",
              borderRadius: 1,
              flexShrink: 0,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
      </Box>

      <Divider />

      {/* Linha 3 — Métricas */}
      <Box
        sx={{
          px: 3,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        {meta?.sparkline?.length ? (
          <Box sx={{ flexShrink: 0 }}>
            <LinkSparkline
              data={meta.sparkline}
              trend={meta.trend?.percent_change}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: 120,
              height: 32,
              bgcolor: "action.hover",
              borderRadius: 1,
            }}
          />
        )}

        <Box
          sx={{ height: 24, bgcolor: "divider", width: "1px", flexShrink: 0 }}
        />

        <LinkTrendBadge trend={meta?.trend} />

        <Box
          sx={{ height: 24, bgcolor: "divider", width: "1px", flexShrink: 0 }}
        />

        <Stack spacing={0}>
          <Typography variant="caption" color="text.secondary">
            {t("metrics.lastClick")}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {lastClickLabel}
          </Typography>
        </Stack>

        <Box
          sx={{ height: 24, bgcolor: "divider", width: "1px", flexShrink: 0 }}
        />

        <LinkHealthBadge health={meta?.health} />

        <Box
          sx={{ height: 24, bgcolor: "divider", width: "1px", flexShrink: 0 }}
        />

        <Stack direction="row" spacing={0.75} alignItems="center">
          <MousePointerClick {...ICON_SM} style={{ opacity: 0.5 }} />
          <Stack spacing={0}>
            <Typography variant="caption" color="text.secondary">
              {t("metrics.totalClicks")}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {link.clicks.toLocaleString()}
            </Typography>
          </Stack>
        </Stack>

        {createdLabel ? (
          <>
            <Box
              sx={{
                height: 24,
                bgcolor: "divider",
                width: "1px",
                flexShrink: 0,
              }}
            />
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CalendarDays {...ICON_SM} style={{ opacity: 0.5 }} />
              <Stack spacing={0}>
                <Typography variant="caption" color="text.secondary">
                  {t("table.created")}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {createdLabel}
                </Typography>
              </Stack>
            </Stack>
          </>
        ) : null}

        {link.click_limit ? (
          <>
            <Box
              sx={{
                height: 24,
                bgcolor: "divider",
                width: "1px",
                flexShrink: 0,
              }}
            />
            <Tooltip
              title={`${t("table.clickLimit")}: ${link.click_limit.toLocaleString()}`}
            >
              <Stack spacing={0}>
                <Typography variant="caption" color="text.secondary">
                  {t("table.clickLimit")}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color:
                      link.clicks >= link.click_limit
                        ? "error.main"
                        : "text.primary",
                  }}
                >
                  {link.clicks.toLocaleString()} /{" "}
                  {link.click_limit.toLocaleString()}
                </Typography>
              </Stack>
            </Tooltip>
          </>
        ) : null}
      </Box>
    </EnhancedPaper>
  );
}
