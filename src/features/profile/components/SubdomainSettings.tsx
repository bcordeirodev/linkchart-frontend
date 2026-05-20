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
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useTranslation } from "react-i18next";

import { useSubdomain } from "../hooks/useSubdomain";

/** Validates the subdomain label on the client before making an API call. */
function isValidSubdomainLabel(value: string): boolean {
  return (
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(value) &&
    value.length >= 3 &&
    value.length <= 63
  );
}

/**
 * Profile settings section that lets the user claim or release a custom subdomain.
 *
 * Renders three states:
 *  1. Loading — MUI Skeletons while initial data is being fetched
 *  2. No subdomain — claim form with availability check + responsibility checkbox
 *  3. Active subdomain — display URL + copy + open + release dialog
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
  const [copied, setCopied] = useState(false);
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

  /** Copies the full subdomain URL to the clipboard. */
  const handleCopy = () => {
    if (!subdomain?.full_url) return;
    navigator.clipboard.writeText(subdomain.full_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  // ── Loading state ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={320} height={20} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={56} />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {/* ── Section header ───────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        <Typography variant="h6">{t("subdomain.title")}</Typography>
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
          <FormLabel sx={{ display: "block", mb: 0.75 }}>
            {t("subdomain.activeLabel")}
          </FormLabel>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <TextField
              value={subdomain.full_url}
              slotProps={{ input: { readOnly: true } }}
              size="small"
              sx={{ flexGrow: 1 }}
              fullWidth
            />
            <Tooltip
              title={copied ? t("subdomain.copied") : t("subdomain.copy")}
            >
              <IconButton onClick={handleCopy} size="small">
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("subdomain.openInNew")}>
              <IconButton
                component="a"
                href={subdomain.full_url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
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
    </Paper>
  );
}
