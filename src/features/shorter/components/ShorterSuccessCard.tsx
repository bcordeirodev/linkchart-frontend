"use client";

import {
  Box,
  Button,
  Link,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, lighten } from "@mui/material/styles";
import { BarChart3, Check, Copy, Globe, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { useShareAPI } from "@/shared/hooks/useShareAPI";
import useClipboard from "@/shared/hooks/useClipboard";
import { ICON_MD, ICON_SM } from "@/lib/theme/iconDefaults";
import {
  getPublicBlockDescriptionSx,
  getPublicBlockTitleSx,
  getPublicFocalSx,
  getPublicInsetSx,
  publicHairline,
} from "@/lib/theme/publicPageStyles";
import {
  ANALYTICS_GRADIENT_FROM,
  ANALYTICS_GRADIENT_TO,
  RESTART_HUE,
  SHARE_HUE,
  WHATSAPP_GREEN,
  WHATSAPP_GREEN_HOVER,
} from "@/lib/theme/publicActionColors";
import { getShortUrl } from "@/lib/utils/shortUrl";
import { PublicBlockIcon } from "@/shared/ui/base";
import { WhatsAppIcon } from "@/shared/ui/icons";
import { useNavigate } from "@/shared/hooks";
import { SHORTER_CONTENT_MAX_WIDTH } from "@/shared/constants";

import { ShorterQrPanel } from "./ShorterQrPanel";

/** Props for the inline success card shown after a guest shortens a link. */
export interface ShorterSuccessCardProps {
  shortUrl: string;
  destinationUrl: string;
  slug: string;
  onReset: () => void;
}

/**
 * Inline success surface for the `/shorter` landing.
 *
 * Vertical flow: confirm → copy link → scan/share → analytics.
 * One inset holds URL + destination; QR and share actions sit below as
 * optional next steps so the card reads clearly top-to-bottom.
 */
export function ShorterSuccessCard({
  shortUrl,
  destinationUrl,
  slug,
  onReset,
}: ShorterSuccessCardProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const navigate = useNavigate();
  const { shareOrCopy } = useShareAPI();
  const isDark = theme.palette.mode === "dark";

  const resolvedShortUrl = getShortUrl(shortUrl);
  const { copy, copied } = useClipboard({ timeout: 1500 });

  const [autoCopied, setAutoCopied] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setAutoCopied(false), 2600);
    return () => clearTimeout(id);
  }, []);

  const handleCopy = (): void => {
    setAutoCopied(false);
    copy(resolvedShortUrl);
  };

  const cardHeadingId = useId();
  const linkHeadingId = useId();
  const isCopied = copied || autoCopied;

  const handleViewAnalytics = (): void => {
    navigate(`/public-analytics/${encodeURIComponent(slug)}`);
  };

  const handleShare = (): void => {
    void shareOrCopy({ url: resolvedShortUrl });
  };

  const handleWhatsApp = (): void => {
    const href = `https://wa.me/?text=${encodeURIComponent(resolvedShortUrl)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const displayDestination = destinationUrl
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");

  /** Bare destination host, used to fetch its favicon. */
  const destinationHost = (() => {
    try {
      return new URL(destinationUrl).hostname.replace(/^www\./i, "");
    } catch {
      return "";
    }
  })();

  const shortUrlColor = isDark
    ? alpha(theme.palette.common.white, 0.96)
    : theme.palette.primary.dark;

  const sectionLabelSx = {
    display: "block",
    fontSize: "0.71875rem",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    lineHeight: 1.2,
    color: alpha(theme.palette.text.primary, isDark ? 0.78 : 0.74),
  };

  /** Solid, white-on-color action (Copy = primary blue, WhatsApp = brand green). */
  const solidActionSx = (bg: string, bgHover: string) => ({
    flex: 1,
    minHeight: 44,
    px: 1.5,
    borderRadius: 1.5,
    fontSize: "0.8125rem",
    fontWeight: 700,
    textTransform: "none" as const,
    letterSpacing: "-0.01em",
    color: theme.palette.common.white,
    bgcolor: bg,
    border: "1px solid transparent",
    transition: "background-color 160ms ease, transform 120ms ease",
    "& .MuiButton-startIcon": { mr: 0.625 },
    "&:hover": { bgcolor: bgHover },
    "&:active": { transform: "translateY(1px)" },
    "&.Mui-disabled": {
      opacity: 0.5,
      color: alpha(theme.palette.common.white, 0.7),
    },
  });

  /**
   * Solid coordinated-color action matching Copy/WhatsApp (white on color),
   * but sized to its content so only the primary Copy button grows widest.
   */
  const colorActionSx = (base: string) => ({
    ...solidActionSx(base, lighten(base, 0.1)),
    flex: "0 0 auto",
  });

  /**
   * Blue→violet gradient fill for the analytics action — the only gradient in
   * the row, so the headline feature reads one notch above its solid siblings.
   */
  const analyticsActionSx = {
    ...colorActionSx(ANALYTICS_GRADIENT_FROM),
    backgroundImage: `linear-gradient(90deg, ${ANALYTICS_GRADIENT_FROM}, ${ANALYTICS_GRADIENT_TO})`,
    // Span the transparent 1px border too — with the default padding-box
    // origin the gradient tiles into the border and its blue end bleeds
    // into the left edge.
    backgroundOrigin: "border-box",
    transition: "filter 160ms ease, transform 120ms ease",
    "&:hover": { filter: "brightness(1.12)" },
  };

  /** Squares off an action into an icon-only button (spread after a base sx). */
  const iconSquareSx = {
    flex: "0 0 auto",
    width: 48,
    minWidth: 48,
    px: 0,
  } as const;

  return (
    <Box
      component="article"
      aria-labelledby={cardHeadingId}
      sx={{
        ...getPublicFocalSx(theme),
        maxWidth: SHORTER_CONTENT_MAX_WIDTH,
        mx: "auto",
        overflow: "hidden",
      }}
    >
      <Stack
        spacing={{ xs: 2, md: 2.25 }}
        sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
          <PublicBlockIcon
            icon={Check}
            sx={{
              color: alpha(theme.palette.common.white, isDark ? 0.96 : 0.94),
            }}
          />
          <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              id={cardHeadingId}
              component="h2"
              sx={getPublicBlockTitleSx(theme)}
            >
              {t("shorter.successTitle")}
            </Typography>
            <Typography component="p" sx={getPublicBlockDescriptionSx(theme)}>
              {t("shorter.successCopiedHint")}
            </Typography>
          </Stack>
        </Box>

        {/* Left: link card + primary actions · Right: QR (spans both). */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "stretch",
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: { sm: "space-between" },
              gap: { xs: 1.5, sm: 1.75 },
            }}
          >
            {/* Short link + destination */}
            <Box
              component="section"
              aria-labelledby={linkHeadingId}
              sx={{
                ...getPublicInsetSx(theme),
                p: { xs: 1.75, sm: 2 },
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  id={linkHeadingId}
                  component="h3"
                  variant="overline"
                  color="text.secondary"
                  sx={{ ...sectionLabelSx, fontSize: "0.6875rem", mb: 0.75 }}
                >
                  {t("publicAnalytics.linkInfo.yourShortLink")}
                </Typography>
                <Typography
                  component="p"
                  sx={{
                    m: 0,
                    minWidth: 0,
                    fontFamily: "monospace",
                    fontSize: { xs: "1rem", sm: "1.0625rem" },
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: shortUrlColor,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Link
                    href={resolvedShortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ color: "inherit", fontWeight: "inherit" }}
                  >
                    {resolvedShortUrl}
                  </Link>
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  minWidth: 0,
                  pt: 1.25,
                  borderTop: `1px solid ${publicHairline(theme, "inset")}`,
                }}
              >
                <DestinationFavicon host={destinationHost} />
                <Link
                  href={destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontFamily: "monospace",
                    fontSize: "0.8125rem",
                    lineHeight: 1.35,
                    color: alpha(
                      theme.palette.text.primary,
                      isDark ? 0.72 : 0.7,
                    ),
                    "&:hover": { color: theme.palette.primary.light },
                  }}
                >
                  {displayDestination}
                </Link>
              </Box>
            </Box>

            {/* One action row: copy · share · whatsapp · analytics · restart. */}
            <Stack
              direction="row"
              useFlexGap
              flexWrap="wrap"
              alignItems="stretch"
              spacing={1}
            >
              {/* Labelled actions first: copy (primary) · analytics · restart. */}
              <Button
                onClick={handleCopy}
                disabled={!resolvedShortUrl}
                startIcon={
                  isCopied ? (
                    <Check {...ICON_MD} aria-hidden />
                  ) : (
                    <Copy {...ICON_MD} aria-hidden />
                  )
                }
                sx={solidActionSx(
                  theme.palette.primary.dark,
                  theme.palette.primary.main,
                )}
              >
                {isCopied
                  ? t("publicAnalytics.linkInfo.copied")
                  : t("publicAnalytics.linkInfo.copy")}
              </Button>
              <Tooltip title={t("shorter.viewAnalyticsTooltip")} arrow>
                <Button
                  onClick={handleViewAnalytics}
                  startIcon={<BarChart3 {...ICON_MD} aria-hidden />}
                  sx={analyticsActionSx}
                >
                  {t("shorter.viewAnalytics")}
                </Button>
              </Tooltip>
              <Button
                onClick={onReset}
                startIcon={<RotateCcw {...ICON_MD} aria-hidden />}
                sx={colorActionSx(RESTART_HUE)}
              >
                {t("shorter.createAnother")}
              </Button>
              {/* Icon-only share actions last. */}
              <Button
                onClick={handleShare}
                aria-label={t("shorter.share")}
                title={t("shorter.share")}
                sx={{ ...colorActionSx(SHARE_HUE), ...iconSquareSx }}
              >
                <Share2 {...ICON_MD} aria-hidden />
              </Button>
              <Button
                onClick={handleWhatsApp}
                aria-label={t("shorter.shareWhatsapp")}
                title={t("shorter.shareWhatsapp")}
                sx={{
                  ...solidActionSx(WHATSAPP_GREEN, WHATSAPP_GREEN_HOVER),
                  ...iconSquareSx,
                }}
              >
                <WhatsAppIcon size={18} aria-hidden style={{ flexShrink: 0 }} />
              </Button>
            </Stack>
          </Box>

          {/* QR code — spans the height of the link card + actions. */}
          <Box
            sx={{
              ...getPublicInsetSx(theme),
              flexShrink: 0,
              alignSelf: { xs: "stretch", sm: "auto" },
              px: 2,
              py: 1.75,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Typography
              component="h3"
              variant="overline"
              color="text.secondary"
              sx={{
                ...sectionLabelSx,
                fontSize: "0.6875rem",
                mb: 0,
                textAlign: "center",
              }}
            >
              {t("shorter.qrLabel")}
            </Typography>
            <ShorterQrPanel shortUrl={resolvedShortUrl} slug={slug} />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

/**
 * Destination site favicon with a Globe fallback.
 *
 * Renders the destination host's favicon (via DuckDuckGo's privacy-friendly
 * icon service) so the destination line carries the same at-a-glance brand cue
 * modern link tools (e.g. Dub) show next to a short link. Falls back to a
 * neutral globe glyph when the host is unknown or the icon fails to load.
 */
function DestinationFavicon({ host }: { host: string }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [failed, setFailed] = useState(false);

  if (!host || failed) {
    return (
      <Globe
        {...ICON_SM}
        aria-hidden
        style={{
          color: alpha(theme.palette.text.primary, isDark ? 0.5 : 0.45),
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <Box
      component="img"
      src={`https://icons.duckduckgo.com/ip3/${host}.ico`}
      alt=""
      aria-hidden
      onError={() => setFailed(true)}
      sx={{
        width: 16,
        height: 16,
        flexShrink: 0,
        borderRadius: "3px",
        objectFit: "contain",
      }}
    />
  );
}
