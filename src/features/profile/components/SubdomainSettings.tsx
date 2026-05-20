"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Link,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { ICON_MD } from "@/lib/theme/iconDefaults";

import { useSubdomain } from "../hooks/useSubdomain";

/** Validates the subdomain label on the client before making an API call. */
function isValidSubdomainLabel(value: string): boolean {
  return (
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(value) &&
    value.length >= 3 &&
    value.length <= 63
  );
}

/** Two representative slugs used in examples. Not translatable intentionally. */
const EXAMPLE_SLUGS = ["abc123", "promo-verao"] as const;

/**
 * Renders a muted monospace row showing how a link URL will look.
 * Used in both the claim form (preview) and the active state (examples).
 */
function LinkExample({ url }: { url: string }) {
  return (
    <Typography
      variant="caption"
      component="div"
      sx={{ fontFamily: "monospace", color: "text.secondary", lineHeight: 1.8 }}
    >
      {url}
    </Typography>
  );
}

/**
 * Profile settings section that lets the user claim or release a custom subdomain.
 *
 * Renders three states:
 *  1. Loading — MUI Skeletons while initial data is being fetched
 *  2. No subdomain — before/after explanation + live URL preview + claim form
 *  3. Active subdomain — URL as clickable link + link format examples + release
 */
export function SubdomainSettings() {
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

  /** Sanitizes input to lowercase alphanumeric + hyphens, then triggers debounced check. */
  const handleInputChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setInputValue(sanitized);
    setInputError(null);
    checkAvailability(sanitized);
  };

  /** Validates and submits the claim request. */
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
      // Error surfaced via claimError
    }
  };

  /** Releases the current subdomain after dialog confirmation. */
  const handleRelease = async () => {
    try {
      await release();
      setReleaseDialogOpen(false);
      setTermsAccepted(false);
    } catch {
      // Error surfaced via releaseError
    }
  };

  // Derive the example label: live input value, or the static hint when empty
  const previewLabel =
    inputValue.length > 0 ? inputValue : t("subdomain.exampleSlug");

  // ── Loading state ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <EnhancedPaper
        sx={{
          p: 3,
          borderTop: (theme) => `3px solid ${theme.palette.primary.main}`,
        }}
      >
        <Skeleton variant="text" width={200} height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={320} height={20} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={56} />
      </EnhancedPaper>
    );
  }

  return (
    <EnhancedPaper
      sx={{
        p: 3,
        borderTop: (theme) => `3px solid ${theme.palette.primary.main}`,
      }}
    >
      {/* ── Section header ───────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
        >
          <Globe {...ICON_MD} />
          {t("subdomain.title")}
        </Typography>
        {subdomain ? (
          <Chip
            label={t("subdomain.chip.active")}
            color="success"
            variant="filled"
            size="small"
          />
        ) : (
          <Chip
            label={t("subdomain.chip.free")}
            size="small"
            variant="outlined"
          />
        )}
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t("subdomain.description")}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* ── Active subdomain ─────────────────────────────────────────── */}
      {subdomain ? (
        <Box>
          {/* URL as a plain clickable link — no box, no buttons */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5 }}
          >
            {t("subdomain.yourDomainLabel")}
          </Typography>
          <Link
            href={subdomain.full_url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              fontFamily: "monospace",
              fontWeight: 600,
              fontSize: "1rem",
              display: "inline-block",
              mb: 3,
            }}
          >
            {subdomain.full_url}
          </Link>

          {/* Link format examples */}
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {t("subdomain.linksLookLike")}
          </Typography>
          <Box
            sx={{
              pl: 1.5,
              borderLeft: (theme) =>
                `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              mb: 3,
            }}
          >
            {EXAMPLE_SLUGS.map((slug) => (
              <LinkExample
                key={slug}
                url={`${subdomain.subdomain}.linkcharts.com.br/${slug}`}
              />
            ))}
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setReleaseDialogOpen(true)}
            disabled={isReleasing}
          >
            {isReleasing ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            {t("subdomain.releaseButton")}
          </Button>

          {releaseError && (
            <Alert severity="error" sx={{ mt: 1.5 }}>
              {t("subdomain.releaseError")}
            </Alert>
          )}
        </Box>
      ) : (
        /* ── Claim form ──────────────────────────────────────────────── */
        <Box>
          {/* How-it-works: live example block */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t("subdomain.exampleDesc")}
          </Typography>
          <Box
            sx={{
              pl: 1.5,
              borderLeft: (theme) =>
                `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              mb: 3,
            }}
          >
            {EXAMPLE_SLUGS.map((slug) => (
              <LinkExample
                key={slug}
                url={`${previewLabel}.linkcharts.com.br/${slug}`}
              />
            ))}
          </Box>

          {/* Input */}
          <FormLabel sx={{ display: "block", mb: 0.75 }}>
            {t("subdomain.inputLabel")}
          </FormLabel>
          <TextField
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t("subdomain.inputPlaceholder")}
            error={!!inputError}
            size="small"
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" color="text.disabled">
                      .linkcharts.com.br
                    </Typography>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 0.75 }}
          />

          {/* Availability indicator */}
          {inputValue.length >= 3 && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}
            >
              {isCheckingAvailability ? (
                <CircularProgress size={14} />
              ) : availability?.available ? (
                <CheckCircleOutlineIcon fontSize="small" color="success" />
              ) : availability ? (
                <ErrorOutlineIcon fontSize="small" color="error" />
              ) : null}
              <Typography
                variant="caption"
                color={
                  isCheckingAvailability
                    ? "text.secondary"
                    : availability?.available
                      ? "success.main"
                      : "error.main"
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
          )}

          {inputError && (
            <Typography
              variant="caption"
              color="error"
              sx={{ display: "block", mb: 1.5 }}
            >
              {inputError}
            </Typography>
          )}

          {/* Responsibility clause */}
          <Alert severity="warning" variant="outlined" sx={{ mb: 1 }}>
            {t("subdomain.responsibility.text")}
          </Alert>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">
                {t("subdomain.responsibility.checkbox")}
              </Typography>
            }
            sx={{ mb: 1.5, alignItems: "center" }}
          />

          {claimError && (
            <Alert severity="error" sx={{ mb: 1.5 }}>
              {t("subdomain.claimError")}
            </Alert>
          )}

          <Button
            variant="contained"
            size="small"
            onClick={handleClaim}
            disabled={
              isClaiming ||
              isCheckingAvailability ||
              !availability?.available ||
              inputValue.length < 3 ||
              !termsAccepted
            }
          >
            {isClaiming ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            {t("subdomain.claimButton")}
          </Button>
        </Box>
      )}

      {/* ── Release confirmation dialog ──────────────────────────────── */}
      <Dialog
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
      </Dialog>
    </EnhancedPaper>
  );
}
