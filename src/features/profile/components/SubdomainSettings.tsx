"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Link,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

import { semanticDark, semanticLight } from "@/lib/theme/colors";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";
import { ResponsiveDialog } from "@/shared/ui/feedback";

import { useSubdomain } from "../hooks/useSubdomain";
import {
  ProfileMutedBox,
  ProfileSection,
  ProfileSectionHeader,
} from "./ProfileSection";
import { LinkExample, SubdomainStatusChip } from "./SubdomainSettings.parts";

const DOMAIN_SUFFIX = ".linkcharts.com.br";

function isValidSubdomainLabel(value: string): boolean {
  return (
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(value) &&
    value.length >= 3 &&
    value.length <= 63
  );
}

const EXAMPLE_SLUGS = ["abc123", "promo-verao"] as const;

export function SubdomainSettings() {
  const theme = useTheme();
  const { t } = useTranslation("profile");
  const {
    subdomain,
    isLoading,
    claim,
    isClaiming,
    claimError,
    release,
    isReleasing,
    releaseError,
    checkAvailability,
    availability,
    isCheckingAvailability,
  } = useSubdomain();

  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setInputValue(sanitized);
    setInputError(null);
    checkAvailability(sanitized);
  };

  const handleClaim = async () => {
    if (!isValidSubdomainLabel(inputValue)) {
      setInputError(t("subdomain.validation.format"));
      return;
    }
    if (!availability?.available) {
      setInputError(t("subdomain.validation.unavailable"));
      return;
    }
    try {
      await claim(inputValue);
      setInputValue("");
      setTermsAccepted(false);
    } catch {
      // claimError
    }
  };

  const handleRelease = async () => {
    try {
      await release();
      setReleaseDialogOpen(false);
      setTermsAccepted(false);
    } catch {
      // releaseError
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const previewLabel =
    inputValue.length > 0 ? inputValue : t("subdomain.exampleSlug");
  const previewPrefix = `${previewLabel}${DOMAIN_SUFFIX}/`;

  const statusChip = (
    <SubdomainStatusChip
      active={!!subdomain}
      label={subdomain ? t("subdomain.chip.active") : t("subdomain.chip.free")}
    />
  );

  if (isLoading) {
    return (
      <ProfileSection emphasized>
        <Skeleton variant="text" width={220} height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={88} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={48} />
      </ProfileSection>
    );
  }

  return (
    <ProfileSection emphasized>
      <ProfileSectionHeader
        featured
        icon={<Globe {...ICON_MD} />}
        title={t("subdomain.title")}
        description={
          <>
            <Typography variant="body2" color="inherit">
              {t("subdomain.description")}
            </Typography>
            {!subdomain ? (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.75,
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? semanticDark.success.main
                      : semanticLight.success.dark,
                  fontWeight: 500,
                }}
              >
                {t("subdomain.freeNote")}
              </Typography>
            ) : null}
          </>
        }
        action={statusChip}
      />

      {subdomain ? (
        <Stack spacing={2.5}>
          <ProfileMutedBox well label={t("subdomain.yourDomainLabel")}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Link
                href={subdomain.full_url}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color:
                    theme.palette.mode === "dark"
                      ? "common.white"
                      : "text.primary",
                  wordBreak: "break-all",
                }}
              >
                {subdomain.full_url.replace(/^https?:\/\//, "")}
              </Link>
              <Box sx={{ display: "flex", gap: 0.25, flexShrink: 0 }}>
                <Tooltip
                  title={copied ? t("subdomain.copied") : t("subdomain.copy")}
                >
                  <IconButton
                    size="small"
                    aria-label={t("subdomain.copy")}
                    onClick={() => handleCopy(subdomain.full_url)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("subdomain.openInNew")}>
                  <IconButton
                    size="small"
                    component="a"
                    href={subdomain.full_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("subdomain.openInNew")}
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </ProfileMutedBox>

          <ProfileMutedBox well label={t("subdomain.linksLookLike")}>
            <Stack spacing={0.5}>
              {EXAMPLE_SLUGS.map((slug) => (
                <LinkExample
                  key={slug}
                  url={`${subdomain.subdomain}${DOMAIN_SUFFIX}/${slug}`}
                  highlightPrefix={`${subdomain.subdomain}${DOMAIN_SUFFIX}/`}
                />
              ))}
            </Stack>
          </ProfileMutedBox>

          <Box>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => setReleaseDialogOpen(true)}
              disabled={isReleasing}
              sx={{ borderColor: "divider", color: "text.secondary" }}
            >
              {isReleasing ? (
                <CircularProgress size={16} sx={{ mr: 1 }} />
              ) : null}
              {t("subdomain.releaseButton")}
            </Button>
            {releaseError ? (
              <Alert severity="error" sx={{ mt: 1.5 }}>
                {t("subdomain.releaseError")}
              </Alert>
            ) : null}
          </Box>
        </Stack>
      ) : (
        <Stack spacing={2.5}>
          <ProfileMutedBox well label={t("subdomain.previewLabel")}>
            <Stack spacing={0.5}>
              {EXAMPLE_SLUGS.map((slug) => (
                <LinkExample
                  key={slug}
                  url={`${previewPrefix}${slug}`}
                  highlightPrefix={previewPrefix}
                />
              ))}
            </Stack>
          </ProfileMutedBox>

          <Box>
            <FormLabel
              htmlFor="subdomain-label"
              sx={{
                display: "block",
                mb: 0.75,
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {t("subdomain.inputLabel")}
            </FormLabel>
            <TextField
              id="subdomain-label"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={t("subdomain.inputPlaceholder")}
              error={!!inputError}
              fullWidth
              size="small"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          color: "text.secondary",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {DOMAIN_SUFFIX}
                      </Typography>
                    </InputAdornment>
                  ),
                  sx: {
                    fontFamily: "monospace",
                    fontWeight: 500,
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: `${radiusTokens.md}px`,
                  bgcolor: theme.palette.background.default,
                },
              }}
            />
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ display: "block", mt: 0.75 }}
            >
              {t("subdomain.formatHint")}
            </Typography>
          </Box>

          {inputValue.length >= 3 ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              {isCheckingAvailability ? (
                <CircularProgress size={14} />
              ) : availability?.available ? (
                <CheckCircleOutlineIcon
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
              ) : availability ? (
                <ErrorOutlineIcon fontSize="small" color="error" />
              ) : null}
              <Typography
                variant="caption"
                color={
                  isCheckingAvailability
                    ? "text.secondary"
                    : availability?.available
                      ? "text.secondary"
                      : "error"
                }
              >
                {isCheckingAvailability
                  ? t("subdomain.checking")
                  : availability?.available
                    ? t("subdomain.available")
                    : availability
                      ? t("subdomain.unavailable")
                      : ""}
              </Typography>
            </Box>
          ) : null}

          {inputError ? (
            <Typography variant="caption" color="error">
              {inputError}
            </Typography>
          ) : null}

          <Typography variant="body2" color="text.secondary">
            {t("subdomain.responsibility.text")}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                sx={{ py: 0.25 }}
              />
            }
            label={
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                {t("subdomain.responsibility.checkbox")}
              </Typography>
            }
            sx={{
              alignItems: "center",
              m: 0,
              ml: -0.5,
              gap: 0.25,
              "& .MuiFormControlLabel-label": { mt: 0 },
            }}
          />

          {claimError ? (
            <Alert severity="error">{t("subdomain.claimError")}</Alert>
          ) : null}

          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClaim}
              disabled={
                isClaiming ||
                isCheckingAvailability ||
                !availability?.available ||
                inputValue.length < 3 ||
                !termsAccepted
              }
            >
              {isClaiming ? (
                <CircularProgress size={16} sx={{ mr: 1 }} />
              ) : null}
              {t("subdomain.claimButton")}
            </Button>
          </Box>
        </Stack>
      )}

      <ResponsiveDialog
        open={releaseDialogOpen}
        onClose={() => setReleaseDialogOpen(false)}
      >
        <DialogTitle>{t("subdomain.releaseDialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("subdomain.releaseDialog.body")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReleaseDialogOpen(false)}>
            {t("subdomain.releaseDialog.cancel")}
          </Button>
          <Button color="error" onClick={handleRelease} disabled={isReleasing}>
            {isReleasing ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            {t("subdomain.releaseDialog.confirm")}
          </Button>
        </DialogActions>
      </ResponsiveDialog>
    </ProfileSection>
  );
}
